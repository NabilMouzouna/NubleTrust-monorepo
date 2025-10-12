import { NextResponse } from "next/server";

export type User = {
    id: string;
    email: string;
}
export default function response(success: boolean, status: number, message: string, accessToken?: string, user?: User, error?: Error) {
    return NextResponse.json({
        success,
        status,
        message,
        accessToken,
        error,
        user,
    });
}