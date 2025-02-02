import { Data } from "@angular/router"
import { Member } from "./member"

export interface response{
    message:string
    statusCode:string
    data?:Data[]
}