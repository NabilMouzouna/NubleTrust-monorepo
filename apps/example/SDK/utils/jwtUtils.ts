import jwt from "jsonwebtoken"

export async function verifyJWT(token : string) : Promise<string | jwt.JwtPayload | null>{
    //TODO : update the console so that it provides the secret
    const secret = process.env.APP_SECRET
    if(!secret) throw new Error("there is no secret in env")
    try {
        const decoded = jwt.verify(token,secret)
        if(!decoded) return null
        return decoded
    } catch (error) {
        throw new Error((error as Error).message)
    }
}