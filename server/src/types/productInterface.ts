import { Question } from "./item";

interface FileSchema {
  key:string;
  name:string
  url?:string;
}
export interface AddProductInfoInterface {
    title: string;
    duration: number;
    category: string;
    level:string;
    tags: string[]|string;
    price: number;
    isPaid: boolean;
    about:string;
    description: string;
    syllabus:string[]|string;
    requirements:string[]|string;
    thumbnail: FileSchema;
    introduction:FileSchema;
    guidelines:FileSchema;
    sellerId: string;
    rating: number;
    isVerified: boolean;
  }

  export interface ProductInterface extends AddProductInfoInterface {
    productsPurchased:Array<string>,
    thumbnailUrl:string,
    introductionUrl:string,
    guidelinesUrl:string;

  }

  
  export interface AddQuizInfoInterface {
    productId:string;
    itemId:string;
    questions: Question[];
  }

  export interface EditQuizInfoInterface {
    productId?:string;
    itemId?:string;
    questions: Question[];
  }
  

  export interface EditProductInfo {
    title?: string;
    thumbnail?: FileSchema;
    guidelines?:FileSchema;
    introductionVideo?: string;
    description?: string;
    category?: string;
    sellerId?: string;
    price?: number;
    purchaseCount?: number;
    rating?: number;
    isVerified?: boolean;
    isPaid?: boolean;
    duration?: number;
    syllabus:string[]|string;
    requirements?: string[]|string;
    quiz?:AddQuizInfoInterface;
    tags?: string[]|string;
    purchaseLimit?: number;
    completionStatus?: number;
  }

