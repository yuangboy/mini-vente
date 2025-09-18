// import {ProductFormData} from "@/app/book-sell/page";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { productDetails } from "../interface";


interface Items{
    product:productDetails;
    quantity:number;
}

export interface CartSlice{
_id:string,
user:string,
items:Items[],
createdAt:string,
updatedAt:string
}

const initialState: CartSlice={
_id:"",
user:"",
items:[],
createdAt:"",
updatedAt:""
}

const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        setCart:(state,action:PayloadAction<CartSlice>)=>{
           return {...state,...action.payload}
        },
        addToCart:(state,action:PayloadAction<CartSlice>)=>{
            return {...state,...action.payload}
        },
        clearCart:()=>{
            return initialState;
        }
    }
})
export const {setCart,addToCart,clearCart}=cartSlice.actions;
export default cartSlice.reducer;


