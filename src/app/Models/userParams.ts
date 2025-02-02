import { User } from "./user";

export class UserParams{
    gender : string;
    minAge = 18
    maxAge = 100
    pageNumber = 1
    pageSize = 5
    orderBy='lastActvie'



    constructor(user: User | null) {
        this.gender = user?.data.gender?.toLowerCase() === 'female' ? 'male' : 'female'
    }
}