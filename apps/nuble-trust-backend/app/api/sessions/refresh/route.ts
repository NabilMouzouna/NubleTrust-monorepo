import response from "@/libs/response";
import { NextRequest } from "next/server";
import { verify, sign } from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;
        
        if(!refreshToken) {
            return response(false, 401, "Refresh token not found");
        }
        
        const salt = process.env.APP_SECRET;
        if(!salt) {
            throw Error("env is misconfigured");
        }
        
        // Verify the refresh token
        const decoded = verify(refreshToken, salt) as { userId: string; appId: string; email: string; iat: number; exp: number };
        
        if(!decoded) {
            return response(false, 401, "Invalid refresh token");
        }
        
        // Generate new access token
        const payload= {
            userId: decoded.userId,
            appId: decoded.appId,
            email: decoded.email,
        };
        
        const newAccessToken: string = sign(payload, salt, {
            expiresIn: "10m",
        });
        
        // Optionally generate a new refresh token (refresh token rotation)
        const newRefreshToken: string = sign(payload, salt, {
            expiresIn: "7d",
        });
        
        const res = response(true, 200, "Token refreshed successfully", newAccessToken, {id: decoded.userId, email : decoded.email});
        
        // Set new refresh token in HTTP-only cookie
        res.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/api/sessions/refresh'
        });
        
        return res;
    } catch {
        // If token verification fails, clear the cookie
        const res = response(false, 401, "Invalid or expired refresh token");
        res.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/api/sessions/refresh'
        });
        
        return res;
    }
}
