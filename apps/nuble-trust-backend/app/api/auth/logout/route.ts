import response from "@/libs/response";

export async function POST() {
    try {
        const res = response(true, 200, "Logout successful");
        
        // Clear the refresh token cookie
        res.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/api/sessions/refresh'
        });
        
        return res;
    } catch (error) {
        return response(false, 500, "unexpected error", undefined, undefined, error as Error);
    }
}
