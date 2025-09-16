import {createSlice,PayloadAction} from "@reduxjs/toolkit";

interface wishListItem{
    _id:string,
    products:string[],
}

interface WishListstate{
    items:wishListItem[],
}

const initialState:WishListstate={
    items:[]
}

const wishListSlice=createSlice({
    name:"wishList",
    initialState,
    reducers:{
        setWishList:(state,action:PayloadAction<any>)=>{
            state.items=action.payload
        },
        clearWishList:(state)=>{
            state.items=[];    
        },
        addToWishList:(state,action:PayloadAction<wishListItem>)=>{
            const existingItemIndex=state.items.findIndex(item=>item._id===action.payload._id);            
            if(existingItemIndex !== -1){
                state.items[existingItemIndex]=action.payload;
            }else{
                state.items.push(action.payload);
            }
        },

        removeFromWishListAction:(state,action:PayloadAction<any>)=>{
            state.items=state.items.map(item=>({
                ...item,
                products:item.products.filter(productId=>productId!==action.payload)
            })).filter(item=>item.products.length>0);

        }

    }
})
export const {setWishList,clearWishList,addToWishList,removeFromWishListAction}=wishListSlice.actions;
export default wishListSlice.reducer;