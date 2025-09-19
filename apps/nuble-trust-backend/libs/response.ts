import { User } from "@/types/user";
import { NextResponse } from "next/server";

export default function response(success: boolean, status: number, message: string, accessToken?: string, user?: any, error?: Error) {
    return NextResponse.json({
        success,
        status,
        message,
        accessToken,
        error,
        user,
    });
}