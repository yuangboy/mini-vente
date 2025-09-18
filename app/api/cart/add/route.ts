import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import {getAuthenticatedUserFromCookie} from "@/app/utils/auth";
import {NextResponse} from "next/server";
import { DBConnect } from "@/app/utils/bd";
import Product from "@/app/models/product";
import CartItem, { ICartItem } from "@/app/models/cartItem";

export async function POST(req: Request) {
   try {
 
    await DBConnect();
    const user=await getAuthenticatedUserFromCookie(req as AuthenticatedRequest);
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
    console.log("info user: ", user);
    console.log("type info user: ", typeof user);
    
    let userId = user._id;

     const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse
        .json({
          success: false,
          message: "Veuillez saisir tous les champs requis.",
        },{status:400});
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse
        .json({ success: false, message: "Produit introuvable." },{status:404});
    }
    

    if (product.seller.toString() === userId) {
      return NextResponse
        .json({
          success: false,
          message: "Vous ne pouvez pas acheter votre propre produit.",
        },{status:400});
    }

    let cart = await CartItem.findOne({ user: userId });

    if (!cart) {
      cart = new CartItem({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item:any) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = { product: productId, quantity } as ICartItem;
      cart.items.push(newItem);
    }
    await cart.save();
   return NextResponse.json({ success: true, message: "Produit ajouté au panier.", data: cart },{status:200});
    
   } catch (error) {
    console.log(error);
    return NextResponse.json({success:false, message:"Une erreur s'est produite"}, {status:500});
   }
}

