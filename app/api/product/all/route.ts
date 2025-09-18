import { NextResponse } from "next/server";
import Product from "@/app/models/product";
import { DBConnect } from "@/app/utils/bd";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import "@/app/models/user";
import {getAuthenticatedUserFromCookie} from "@/app/utils/auth";
import { getDynamicPrice } from "../create/route";

// export async function GET(req:Request){
//      try {
//         await DBConnect();
//         const products=await Product.find()
//         .sort({createdAt:-1})
//         .populate({
//     path: "seller",
//     select: "email firstName lastName",
//   });

//     if(!products){
//         console.log("Products introuvables");
        
//         return NextResponse.json({
//             success:false,
//             message:"Produits introuvables"
//         },{status:404});
//     }

//     return NextResponse.json({
//         success:true,
//         data:products
//     },{status:200});
        
//      } catch (error) {
//         console.log(error);
//         return NextResponse.json({success:false,message:"Une erreur s'est produite"},{status:500});

//      }
// }



export async function GET(req:Request){

    try {
        await DBConnect();
        const user=await getAuthenticatedUserFromCookie(req as AuthenticatedRequest);
        const products=await Product.find()
        .sort({createdAt:-1})
        .populate({
    path: "seller",
    select: "email firstName lastName companyName siren tvaNumber annualRevenue email",
  });

    const enrichedProducts = products.map((product) => {
    let displayPrice = product.price;
    let priceLabel = "Prix particulier";

    if (user) {
      displayPrice = getDynamicPrice(
        product.productType,
        product.clientType,
        user.annualRevenue
      );
      priceLabel =
        user.role === "professional"
          ? user.tvaNumber
            ? "Prix HT (TVA non appliquée)"
            : "Prix TTC (TVA incluse)"
          : "Prix particulier";
    }

    return {
      ...product.toObject(),
      displayPrice,
      priceLabel,
    };

  });

        return NextResponse.json({
            success:true,
            data:enrichedProducts
        });


    } catch (error) {
        console.log(error);
        
    }

}