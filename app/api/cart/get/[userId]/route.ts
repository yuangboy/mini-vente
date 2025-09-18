
import { NextResponse } from "next/server";
import { DBConnect } from "@/app/utils/bd";
import CartItem from "@/app/models/cartItem";

export async function GET(req:Request,{params}:{params:{userId:string}}){

    try{
        await DBConnect();
    const cart = await CartItem.findOne({ user: params.userId }).populate(
    "items.product"
  );
  if (!cart) {
    return NextResponse
      .json({ success: false, message: "Panier introuvable." },{status:404});
  }
    return NextResponse.json({ success: true, data:cart });
        
    }catch(error){
        console.log(error);
        return NextResponse.json({ success: false, message: "Une erreur s'est produite." });    
    }
    
}