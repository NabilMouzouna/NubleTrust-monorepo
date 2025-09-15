import { NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

export async function GET() {
    try {
        const publicKeyPath = path.resolve(process.cwd(), '.secret', 'public_key.pem');
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

        const headers = {
            "Content-Type": "application/x-pem-file",
            "Cache-Control": "public, max-age=86400, must-revalidate",
        }

        return new NextResponse(publicKey, {
            status: 200,
            headers: headers,
        })
    } catch (error) {
        // Likely fs.readFileSync error if file doesn't exist
        console.error("Failed to read public key:", error);
        return new NextResponse("Public key is not available on the server.", { status: 500 })
    }
}