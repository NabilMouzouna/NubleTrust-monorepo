import response from "@/libs/response";
import verifyApiKey from "@/libs/verify-api-key";
import { createAppUser, createUser, getUserByEmail } from "@nubletrust/postgres-drizzle";
import {hashSync, genSaltSync} from "bcryptjs";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken"

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    const apiKey = request.headers.get("x-api-key");
    if(!email || !password) return response(false, 400, "Email and password are required");
    if(!apiKey) return response(false, 400, "API key is required");
 
    const application = await verifyApiKey(apiKey)
    if(!application || application instanceof Error) return response(false,402,"invalid API key, please register your app to get api key")
    
    try {
        const user = await getUserByEmail(email)
        if(user) return response(false,400,`the user with email ${user.email} already exists, try login`)
        const [newUser] =await createUser({email,passwordHash : hashSync(password,genSaltSync(12)) })
        if(!newUser) return response(false,400,"the user is not registered, please try again")
        const [appUser] = await createAppUser({appId :application.id ,userId : newUser.id})
        const salt = process.env.APP_SECRET
        if(!salt) throw Error("env is misconfigured")
        
        const payload = {
            userId : appUser.id,
            appId : appUser.appId,
            email,
        }
        
        const accessToken : string = sign(payload, salt, {
            expiresIn : "15m",
        })
        
        const refreshToken : string = sign(payload, salt, {
            expiresIn : "7d",
        })
        
        if(appUser) {
            const userResponse = {
                id: newUser.id,
                email: newUser.email,
                password: "" // Don't send password in response
            };
            const res = response(true, 201, "user registered", accessToken, userResponse)
            
            // Set refresh token in HTTP-only cookie
            res.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/api/sessions/refresh'
            })
            
            return res
        }
    } catch (error) {
        return response(false,500,"unexpected error",undefined,undefined,error as Error)
    }
}