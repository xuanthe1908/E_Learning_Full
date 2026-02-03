export interface ProductInterface {
    _id: string;
    title: string;
    sellerId: string;
    duration: number;
    category: string;
    level: string;
    tags: string[];
    price: number;
    about: string;
    description: string;
    introduction:Media;
    syllabus: string[];
    requirements: string[];
    thumbnailUrl: string;
    guidelinesUrl:string;
    productsPurchased: any[];
    rating: number;
    isVerified: boolean;
    completionStatus: number;
    createdAt: string;
    isPaid: boolean;
    __v: number;
  }

  export interface Media{
    key: string
    name: string
    _id: string
  }





















