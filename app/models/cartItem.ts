import {Schema,Document,model,Types,models} from "mongoose";
import { getDynamicPrice } from "../api/product/create/route";


export interface ICartItem extends Document{
    product:Types.ObjectId;
    quantity:number;
}

export interface ICart extends Document{
    user:Types.ObjectId;
    items: ICartItem[];
}

const CartItemSchema=new Schema<ICartItem>({
    product:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    quantity:{type:Number,required:true}
});

const CartSchema=new Schema<ICart>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    items:{type:[CartItemSchema],default:[]}
});

CartSchema.methods.calculateTotal = async function (): Promise<number> {
  const user = await model("User").findById(this.user);
  let total = 0;

  for (const item of this.items) {
    const product = await model("Product").findById(item.product);
    const price = getDynamicPrice(
      product.productType,
      user.role,
      user.annualRevenue
    );
    total += price * item.quantity;
  }

  return total;
};


export default models.CartItem || model<ICart>("CartItem",CartSchema);