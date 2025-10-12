import { ResultType, DeviceInfo } from "./types";
import { Loader } from "./utils/loader";

class NubleTrustAuth {

    private baseURL :string;
    private apiKey :string;

    constructor({baseUrl, apiKey}:{baseUrl : string, apiKey : string}){
        this.baseURL = baseUrl
        this.apiKey = apiKey
    }

    async authentication(authType: "register" | "login", email?: string, password?: string, deviceInfo?: DeviceInfo): Promise<ResultType | unknown> {
        try {
            const payload: any = { email, password, deviceInfo };
            const res = await Loader(`${this.baseURL}/api/auth/${authType}`, payload, this.apiKey);
            return res;
        } catch (error) {
            throw new Error(`Unexpected error happened : ${(error as Error).message}`);
        }
    }

    async logout(): Promise<ResultType | unknown> {
        try {
            const res = await Loader(`${this.baseURL}/api/auth/logout`, null, this.apiKey);
            return res;
        } catch (error) {
            throw new Error(`Unexpected error happened : ${(error as Error).message}`);
        }
    }

    async authRefresh(deviceInfo: DeviceInfo) {
        try {
            const res = await Loader(`${this.baseURL}/api/sessions/refresh`, { deviceInfo }, this.apiKey);
            return res;
        } catch (error) {
            throw new Error(`Unexpected error happened : ${(error as Error).message}`);
        }
    }
}

export default NubleTrustAuth;