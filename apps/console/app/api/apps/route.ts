import { responseHelper } from "@/utils/responseHelper";
import { getAllApplicationsByDeveloper } from "@nubletrust/postgres-drizzle";
import { NextRequest } from "next/server";

export async function GET(req : NextRequest){
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if(!id) return responseHelper(false,"couldn't get the application, the developer is undifined",500)
    try {
        const apps = await getAllApplicationsByDeveloper(id)
        if(apps.length < 1 || !apps) return responseHelper(true,"no applications, create your first app",200)
        const payload = {
            appsCount : apps.length,
            apps
        }
        return responseHelper(true,payload,200)
        
    } catch (error) {
        return responseHelper(false,`unexpected error : ${(error as Error).message}`,500)
    }
}