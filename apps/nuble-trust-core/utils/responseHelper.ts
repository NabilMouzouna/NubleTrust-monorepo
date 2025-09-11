import { ResponseTypes } from "@nubletrust/core-types"
import { NextResponse } from "next/server"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function responseHelper( success : boolean , message : any , status : number ){
    const res : ResponseTypes  = {success,message,status}
    return NextResponse.json(res)
}