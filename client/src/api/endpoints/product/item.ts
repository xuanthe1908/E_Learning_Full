import END_POINTS from "../../../constants/endpoints";
import { getItemsByProductService,addItemsService,getItemsByIdService, editItemsService } from "../../services/product/item-service";

export const getItemsByProduct = (productId: string) => {
    return getItemsByProductService(END_POINTS.GET_ITEMS_BY_PRODUCT, productId);
  };
  
  export const addItem = (productId: string, item: FormData) => {
    return addItemsService(END_POINTS.ADD_ITEM, productId, item);
  };

  export const editItem = (itemId: string, item: FormData) => {
    return editItemsService(END_POINTS.EDIT_ITEM, itemId, item);
  };
  
  export const getItemById = (itemId:string)=>{
    return getItemsByIdService(END_POINTS.GET_ITEMS_BY_ID,itemId)
  }






















