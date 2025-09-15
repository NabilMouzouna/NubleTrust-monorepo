import { UserClaims } from "../types";
import { getPbKey } from "./getPbKey";
import jwt from "jsonwebtoken"

export async function verifyJWT(token : string) : Promise<UserClaims | null>{
    try {
        const publicKey = await getPbKey();
        if (!publicKey) {
            console.error("Public key not available for JWT verification.");
            return null;
        }

        const decoded = jwt.verify(token, publicKey);
        return decoded as UserClaims;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}