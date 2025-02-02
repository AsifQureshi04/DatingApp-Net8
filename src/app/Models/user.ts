export interface User {
    message: string
    statusCode: string
    token: number
    securityToken: string
    data: Data
  }
  
  export interface Data {
    message: string
    userName: string
    url: string
    knowAs: string
    gender: string
  }