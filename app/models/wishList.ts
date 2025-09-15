import {Document, Schema, model, Types} from "mongoose";


export interface IWishList extends Document{
    user:Types.ObjectId,
    products:Types.ObjectId[]
}

const WishListSchema=new Schema<IWishList>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    products:{type:[Schema.Types.ObjectId],default:[]}
});

export default model<IWishList>("WishList",WishListSchema);