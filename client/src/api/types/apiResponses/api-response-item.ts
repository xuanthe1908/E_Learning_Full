export interface ApiResponseItem {
    _id: string
    title: string
    description: string
    contents: string[]
    duration: number,
    about:string;
    sellerId: string
    productId: string
    media: Media[]
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface Media{
    key: string
    name: string
    _id: string
  }






















