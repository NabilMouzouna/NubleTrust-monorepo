"use client"
import React, { useContext, createContext, useState, ReactNode, useEffect } from "react";
import NubleTrustAuth from "../core";
import { ConfigType, User, ResultType } from "../../types";

interface NTContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    authentication: (authType: "register" | "login", email?: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const context = createContext<NTContextType | null>(null);

export default function NTProvider({ config, children }: { config: ConfigType; children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true for session check
    const [user, setUser] = useState<User | null>(null);
    const nt = new NubleTrustAuth(config);

    useEffect(() => {
        const checkSession = async () => {
            console.log("[NTProvider] checkSession: Starting session check.");
            try {
                const storedToken = localStorage.getItem("nuble-trust");
                if (!storedToken) {
                    console.log("[NTProvider] checkSession: No stored token found.");
                    setIsAuthenticated(false);
                    setUser(null);
                    return;
                }

                console.log("[NTProvider] checkSession: Stored token found, attempting refresh.");
                // Attempt to refresh the token to validate the session
                const refreshResult = await nt.authRefresh();
                console.log("[NTProvider] checkSession: authRefresh result:", refreshResult);

                if (refreshResult && typeof refreshResult === 'object' && 'success' in refreshResult) {
                    const resultData = refreshResult as ResultType;
                    if (resultData.success && resultData.user && resultData.accessToken) {
                        console.log("[NTProvider] checkSession: Refresh successful, user authenticated.");
                        localStorage.setItem("nuble-trust", resultData.accessToken); // Store new token
                        setUser(resultData.user);
                        setIsAuthenticated(true);
                    } else {
                        console.log("[NTProvider] checkSession: Refresh failed or didn't return expected data.");
                        // Refresh failed or didn't return expected data
                        localStorage.removeItem("nuble-trust");
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } else {
                    console.log("[NTProvider] checkSession: Unexpected refresh result format.");
                    // Unexpected refresh result
                    localStorage.removeItem("nuble-trust");
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("[NTProvider] checkSession: Error during session refresh:", error);
                // Error during refresh (e.g., network error, server error)
                localStorage.removeItem("nuble-trust");
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                console.log("[NTProvider] checkSession: Session check finished. isLoading set to false.");
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const authentication = async (authType: "register" | "login", email?: string, password?: string) => {
        console.log(`[NTProvider] authentication: Starting ${authType} for email: ${email}`);
        setIsLoading(true);
        try {
            const result = await nt.authentication(authType, email, password);
            console.log(`[NTProvider] authentication: ${authType} result:`, result);
            if (result && typeof result === 'object' && 'success' in result) {
                const resultData = result as ResultType;
                if (resultData.success && resultData.user && resultData.accessToken) {
                    console.log(`[NTProvider] authentication: ${authType} successful for user:`, resultData.user.email);
                    localStorage.setItem("nuble-trust", resultData.accessToken); // Store the access token
                    setUser(resultData.user);
                    setIsAuthenticated(true);
                } else {
                    console.log(`[NTProvider] authentication: ${authType} failed or didn't return expected data.`);
                    localStorage.removeItem("nuble-trust");
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                console.log(`[NTProvider] authentication: Unknown result format for ${authType}:`, result);
                localStorage.removeItem("nuble-trust");
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error(`[NTProvider] authentication: Unexpected error during ${authType}:`, error);
            localStorage.removeItem("nuble-trust-token");
            setIsAuthenticated(false);
            setUser(null);
            throw new Error(`unexpected error on NTProvider ${(error as Error).message}`);
        } finally {
            console.log(`[NTProvider] authentication: ${authType} finished. isLoading set to false.`);
            setIsLoading(false);
        }
    };

    const logout = async () => {
        console.log("[NTProvider] logout: Starting logout process.");
        setIsLoading(true);
        try {
            await nt.logout();
            console.log("[NTProvider] logout: nt.logout() completed.");
        } finally {
            console.log("[NTProvider] logout: Clearing local storage and resetting authentication state.");
            localStorage.removeItem("nuble-trust-token"); // Clear token on logout
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            console.log("[NTProvider] logout: Logout finished. isLoading set to false.");
        }
    };

    const value: NTContextType = {
        isAuthenticated,
        isLoading,
        user,
        authentication,
        logout
    };

    return <context.Provider value={value}>{children}</context.Provider>;
}

export const useNubleTrust = (): NTContextType => {
    const ntContext = useContext(context);
    if (ntContext === null) {
        throw new Error("useNubleTrust must be used within a NTProvider");
    }
    return ntContext;
};
