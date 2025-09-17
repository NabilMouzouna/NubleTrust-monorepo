import { NextRequest } from "next/server";
import { responseHelper } from "../../../utils/responseHelper";
import { verifyApiKey } from "../../../utils/verifyApiKey";
import { createRiskEvent, getAllRiskEventsForSession } from "@nubletrust/postgres-drizzle";
import { getUserFromToken } from "../../../utils/auth";

export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401);

    const appId = await verifyApiKey(apiKey);
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401);
    
    const user = await getUserFromToken(request);
    if (!user || user.appId !== appId) {
        return responseHelper(false, "Unauthorized or token is not valid for this application", 401);
    }

    try {
        const { sessionId, type, severity, details } = await request.json();
        if (!sessionId || !type || !severity) {
            return responseHelper(false, "Missing required fields: sessionId, type, severity", 400);
        }

        const riskEventData = {
            sessionId,
            type,
            severity,
            details,
            appId: user.appId,
            appUserId: user.appUserId
        };
        const [riskEvent] = await createRiskEvent(riskEventData);
        return responseHelper(true, riskEvent, 201);
    } catch (error) {
        return responseHelper(false, (error as Error).message, 500);
    }
}

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return responseHelper(false, "Please provide an API key", 401);

    const appId = await verifyApiKey(apiKey);
    if (!appId) return responseHelper(false, "The provided API key is not valid", 401);

    const user = await getUserFromToken(request);
    if (!user || user.appId !== appId) {
        return responseHelper(false, "Unauthorized or token is not valid for this application", 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return responseHelper(false, "sessionId query parameter is required", 400);
    }

    try {
        // TODO: check that the session belongs to the user/app.
        const riskEvents = await getAllRiskEventsForSession(sessionId);
        return responseHelper(true, riskEvents, 200);
    } catch (error) {
        return responseHelper(false, (error as Error).message, 500);
    }
}
