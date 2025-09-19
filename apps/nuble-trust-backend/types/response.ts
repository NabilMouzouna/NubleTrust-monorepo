import { User } from "./user";

export type Response = {
    success: boolean;
    status: number;
    message: string;
    accessToken?: string;
    user?: User | null;
    error?: Error | null;
}