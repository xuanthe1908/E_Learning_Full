export interface CreateItemInterface {
    title: string;
    description: string;
    contents: string[];
    duration: number;
    sellerId: string;
    productId: string;
    media: {name:string,key:string} [],
    questions:Question[]
  }

  export interface EditItemInterface {
    title?: string;
    description?: string;
    contents?: string[];
    duration?: number;
    sellerId?: string;
    productId?: string;
    media?: {name:string,key:string} [],
    questions?:Question[]
  }

 

  export interface Question {
    question: string;
    options: Option[];
  }
  
  interface Option {
    option: string;
    isCorrect: boolean;
  }

