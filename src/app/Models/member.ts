import { Photo } from "./photo"

export interface Member {
    id : number
    userName: string
    age: number
    photoUrl: string
    knownAs: string
    createdOn: string
    lastActive: string
    gender: string
    introduction: any
    interests: any
    lookingFor: any
    city: string
    country: string
    photos: Photo[]
  }