
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import {getAuthenticatedUserFromCookie} from "@/app/utils/auth";



export async function GET(req:Request,{params}:{params:{productId:string}}){

    try{

        const user=await getAuthenticatedUserFromCookie(req as AuthenticatedRequest);

        const product=await Product.findById(params.productId)
        .sort({createdAt:-1})
        .populate({
            path:"seller",
            select:"name email profilePicture",
            // populate:{
            //     path:"addresses",
            //     model:"Address"
            // }
        });

    if(!product){
        console.log("Product introuvable");
        
        return NextResponse.json({
            success:false,
            message:"Produit introuvable"
        },{status:404});
    }

    return NextResponse.json({
        success:true,
        data:product
    },{status:201});

    }catch(error){
        console.log(error);
        return NextResponse.json({ success: false, message: "Une erreur s'est produite." });
    }

}