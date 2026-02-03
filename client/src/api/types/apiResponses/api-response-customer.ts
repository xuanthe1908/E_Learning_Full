export interface ApiResponseCustomer {
    _id: string
    firstName: string
    lastName: string
    email: string
    mobile: string
    productsPurchased: any[]
    isGoogleUser: boolean
    dateJoined: string
    interests: string[]
    profilePic: ProfilePic
  }
  
  export interface ProfilePic {
    name: string
    key?: string
    url?:string;
    _id: string
  }
  






















