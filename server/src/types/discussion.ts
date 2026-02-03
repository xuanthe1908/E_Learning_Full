export interface Reply  {
   customerId: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
 export interface AddDiscussionInterface  {
    customerId: string;
    message: string;
    itemId: string;
    replies?: Reply[];
    createdAt: Date;
    updatedAt: Date;
  }