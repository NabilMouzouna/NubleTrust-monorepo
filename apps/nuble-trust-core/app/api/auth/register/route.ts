import { NextRequest } from "next/server"
import { verifyApiKey } from "../../../../utils/verifyApiKey"
import { responseHelper } from "../../../../utils/responseHelper"
import {getAppUserByEmail} from "@nubletrust/postgres-drizzle"

export async function POST(request : NextRequest){
    const apiKey = await request.headers.get("x-api-key")
    const {email, password} = await request.json()

    // verifying email and password exists
    if(!email || !password) return responseHelper(false,"Email or Password are missing",400)
    if(!apiKey) return responseHelper(false,"Please provide an API key",401)

    // verifying App Token is valid first, if not valid we won;t even try
    const appId = await verifyApiKey(apiKey)
    console.log(appId)
    if(!appId) return responseHelper(false,"The provided API key is not valid",401)

        try {
            // ideal case, email and password are there
            // check if user already exists on datavase
            const user = await getAppUserByEmail(appId,email)
            if(user){
                return responseHelper(false,`This email is already registered. Please try logging in.`,409)
            }
            return responseHelper(true,"Registered successfully",201)
    } catch (error) {
    // Unpredictable errors handling
        return responseHelper(false,(error as Error).message,500)
    }
}