export interface ApiResponseRecommended {
  _id: string
  seller: Seller
  product: Product,
  media:{
    profileUrl:string,
    thumbnailUrl:string,
  }
}

export interface Seller {
  _id: string
  firstName: string
  lastName: string
  email: string
}

export interface Product {
  _id: string
  name: string
  thumbnail: string
}

  
  export interface Products {
    _id: string
    title: string
    thumbnail: string
    introductionVideo: string
    description: string
    category: string
    sellerId: string
    isPaid: boolean
    price: number
    purchaseCount: number
    rating: number
    items: string[]
    isVerified: boolean
    duration: number
    requirements: string[]
    tags: string[]
    completionStatus: number
    createdAt: string
    reviews: any[]
    __v: number
    productsPurchased: string[]
    categoryId: string
  }
  
  export interface ApiResponseTrending {
    _id: string
    title: string
    thumbnailUrl: string;
    profileUrl:string;
    sellerFirstName: string
    sellerLastName: string
  }






















