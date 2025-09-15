
import { AuthConfig, UserClaims } from "./types";
import { verifyJWT } from "./utils/jwtUtils";

class AuthClient {
    getAccessToken(): string | null {
        return this.accessToken;
    }
    private config : AuthConfig;
    private accessToken : string | null = null;
    private userClaims : UserClaims | null = null;

    constructor(config : AuthConfig) {this.config = config;}

    private getHeaders(withAuth = false){
        const headers : Record<string,string> = {
            'Content-type' : 'application/json',
            'x-api-key' : this.config.apiKey
        }
        if(withAuth && this.accessToken){
            headers['Authorization'] = `Bearer ${this.accessToken}`
        }
        return headers;
    }
    setSession(accessToken : string){ this.accessToken = accessToken }
    getUser() : UserClaims | null {return this.userClaims}
    async refreshToken(): Promise<string | null> {
        try {

            const response = await fetch(this.config.baseUrl + "/api/auth/refresh", {
                method: 'POST',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to refresh token: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            if (data.accessToken) {
                this.accessToken = data.accessToken;
                return this.accessToken;
            } else {
                throw new Error("Refresh token response did not contain an accessToken.");
            }
        } catch (error) {
            console.error("Error during token refresh:", (error as Error).message);
            this.accessToken = null;
            this.userClaims = null;
            return null;
        }
    }
    async isAuthenticated(): Promise<boolean> {
        if (!this.accessToken) {
            try {
                this.accessToken = await this.refreshToken()
                return true
            } catch (error) {
                console.log((error as Error).message)
                return false
            }
        }

        try {
            const decoded = await verifyJWT(this.accessToken);
            if (decoded) {
                this.userClaims = decoded;
                return true;
            } else {
                // Token is invalid or expired, try to refresh
                const newAccessToken = await this.refreshToken();
                if (newAccessToken) {
                    // If refresh was successful, refreshToken already updated this.accessToken and this.userClaims
                    return true;
                } else {
                    // Refresh failed, clear any lingering state
                    this.accessToken = null;
                    this.userClaims = null;
                    return false;
                }
            }
        } catch (error) {
            console.error("Error during isAuthenticated check:", (error as Error).message);
            this.accessToken = null;
            this.userClaims = null;
            return false;
        }
    }
    async register(email : string, password : string){
        const res = await fetch(`${this.config.baseUrl}/api/auth/register`,{
            method : "POST",
            headers : this.getHeaders(),
            body : JSON.stringify({email,password}),
            credentials : 'include'
        })
        const data = await res.json()
        this.setSession(data.accessToken)
        return data
    }
    async login(email : string, password : string){
        const res = await fetch(`${this.config.baseUrl}/api/auth/login`,{
            method : "POST",
            headers : this.getHeaders(),
            body : JSON.stringify({email,password}),
            credentials : 'include'
        })
        const data = await res.json()
        this.setSession(data.accessToken)
        return data
    }
    async logout(){
        const res = await fetch(`${this.config.baseUrl}/api/auth/logout`,{
            method : "POST",
            headers : this.getHeaders(),
            credentials : "include"
        })
        await this.handleResponse(res)
        this.accessToken = null
        this.userClaims = null
    }
    async handleResponse(res : Response){
        const text = await res.text()
        let data;
        try {
            data = text? JSON.parse(text) : {};
        } catch (error) {
            console.log((error as Error).message)
            throw new Error("Invalid JSON")
        }
        if(!res.ok){
            throw new Error(data.message || "request Failed")
        }
        return data
    }
}

export default AuthClient