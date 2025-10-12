export type ResultType = {
    success : boolean
    status : number
    message : string
    accessToken? : string 
    error? : Error,
    user? : User
}

export type ConfigType ={
    baseUrl : string,
    apiKey : string,
}
export type DeviceInfo = {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
};

export type User = {
    id: string;
    username : string;
    email: string;
}


