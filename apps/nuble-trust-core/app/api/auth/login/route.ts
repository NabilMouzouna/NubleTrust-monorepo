import { NextRequest } from "next/server"
import { verifyApiKey } from "../../../../utils/verifyApiKey"
import { responseHelper } from "../../../../utils/responseHelper"
import { getAppUserByEmail } from "@nubletrust/postgres-drizzle"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
    const apiKey = await request.headers.get("x-api-key")
    const { email, password } = await request.json()

    // verifying email and password exists
    if (!email || !password) return responseHelper(false, "Email or Password are missing", 400)
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401)

    // verifying App Token is valid first, if not valid we won't even try
    const appId = await verifyApiKey(apiKey)
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401)

    try {
        // check if user already exists on datavase
        const registeredUser = await getAppUserByEmail(appId, email)
        if (!registeredUser) {
            return responseHelper(false, `This email is not registered. Please try signing up.`, 404)
        }

        const passwordMatch = await bcrypt.compare(password, registeredUser.passwordHash)

        if (!passwordMatch) {
            return responseHelper(false, "Invalid credentials", 401)
        }

        // JWT payload
        const payload = {
            sub: registeredUser.id,
            email: registeredUser.email,
            appId,
        };
        const accessToken = jwt.sign(payload, process.env.APP_SECRET!, {
            expiresIn: "15m",
        });

        // Return both token and data
        const data = {
            accessToken,
            message: "Logged in successfully",
        };

        return responseHelper(true, data, 200);
    } catch (error) {
        // Unpredictable errors handling
        return responseHelper(false, (error as Error).message, 500)
    }
}
