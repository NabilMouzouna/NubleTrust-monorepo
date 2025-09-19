import { getAllApplicationsByDeveloper } from "@nubletrust/postgres-drizzle";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const developerId = searchParams.get("developerId")
        if (!developerId) {
            return NextResponse.json({ error: "Developer ID is required" }, { status: 400 })
        }
        const apps = await getAllApplicationsByDeveloper(developerId)
        return NextResponse.json(apps ?? [])
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}