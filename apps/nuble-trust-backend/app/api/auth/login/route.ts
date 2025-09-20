import response from "@/libs/response";
import verifyApiKey from "@/libs/verify-api-key";
import { getUserByEmail } from "@nubletrust/postgres-drizzle";
import { compare } from "bcryptjs";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    const apiKey = request.headers.get("x-api-key");
    
    if(!email || !password) return response(false, 400, "Email and password are required");
    if(!apiKey) return response(false, 400, "API key is required");

    const application = await verifyApiKey(apiKey);
    if(!application || application instanceof Error) return response(false, 402, "invalid API key, please register your app to get api key");
    
    try {
        const user = await getUserByEmail(email);
        if(!user) return response(false, 401, "Invalid email or password");
        
        const isPasswordValid = await compare(password, user.passwordHash);
        if(!isPasswordValid) return response(false, 401, "Invalid email or password");
        
        const salt = process.env.APP_SECRET;
        if(!salt) throw Error("env is misconfigured");
        
        const payload = {
            userId: user.id,
            appId: application.id,
            email: user.email,
        };
        
        const accessToken: string = sign(payload, salt, {
            expiresIn: "10m",
        });
        
        const refreshToken: string = sign(payload, salt, {
            expiresIn: "7d",
        });
        
        const userResponse = {
            id: user.id,
            email: user.email,
            password: "" // Don't send password in response
        };
        const res = response(true, 200, "Login successful", accessToken, userResponse);
        
        // Set refresh token in HTTP-only cookie
        res.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/api/sessions/refresh'
        });
        
        return res;
    } catch (error) {
        return response(false, 500, "unexpected error", undefined, undefined, error as Error);
    }
}
