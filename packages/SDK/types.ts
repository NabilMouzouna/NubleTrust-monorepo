export type User = {
    id: string;
    email: string;
}
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
