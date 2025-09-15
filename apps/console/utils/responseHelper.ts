import { ResponseTypes } from "@nubletrust/core-types"
import { NextResponse } from "next/server"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function responseHelper( success : boolean , data : any , status : number ){
    const res : ResponseTypes  = {success,data,status}
    return NextResponse.json(res)
}