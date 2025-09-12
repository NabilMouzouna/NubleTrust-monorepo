import { NextRequest } from "next/server"
import { verifyApiKey } from "../../../../utils/verifyApiKey"
import { responseHelper } from "../../../../utils/responseHelper"
import {createAppUser, createUser, getAppUserByEmail} from "@nubletrust/postgres-drizzle"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request : NextRequest){
    const apiKey = await request.headers.get("x-api-key")
    const {email, password} = await request.json()

    // verifying email and password exists
    if(!email || !password) return responseHelper(false,"Email or Password are missing",400)
    if(!apiKey) return responseHelper(false,"Please provide an API key",401)

    // verifying App Token is valid first, if not valid we won;t even try
    const appId = await verifyApiKey(apiKey)
    if(!appId) return responseHelper(false,"The provided API key is not valid",401)

        try {
            // ideal case, email and password are there
            // check if user already exists on datavase
            const registeredUser = await getAppUserByEmail(appId,email)
            if(registeredUser){
                return responseHelper(false,`This email is already registered. Please try logging in.`,409)
            }
            const [user] = await createUser({email,passwordHash : await bcrypt.hash(password, 10)})

            // if database failed to create the user
            if(!user) return responseHelper(false,"Something went wrong",500)
                try {
                    await createAppUser({ appId, userId: user.id });
                  
                    // JWT payload
                    const payload = {
                      sub: user.id,
                      email: user.email,
                      appId,
                    };
                    const accessToken = jwt.sign(payload, process.env.APP_SECRET!, {
                      expiresIn: "15m",
                    });
                  
                    // Return both token and data
                    const data = {
                      accessToken,
                      message: "Registered successfully",
                    };
                  
                    return responseHelper(true, data, 201);
                  } catch (error) {
                    return responseHelper(false, (error as Error).message, 500);
                  }
    } catch (error) {
    // Unpredictable errors handling
        return responseHelper(false,(error as Error).message,500)
    }
}