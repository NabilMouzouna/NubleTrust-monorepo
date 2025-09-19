import { registerAppReturn } from "@/lib/utils";
import { createContext, useContext, useState } from "react";

interface appsProviderProps {apps: registerAppReturn[], setApps: (apps: registerAppReturn[]) => void}
const appsProvider = createContext<appsProviderProps>({apps: [], setApps: () => {}})

export function AppsProvider({ children }: { children: React.ReactNode }) {
    const [apps, setApps] = useState<registerAppReturn[]>([])
    return <appsProvider.Provider value={{ apps, setApps }}>{children}</appsProvider.Provider>
}
export function AppsConsumer() {
    return useContext(appsProvider)
}