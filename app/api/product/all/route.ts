import { NextResponse } from "next/server";
import Product from "@/app/models/product";
import { DBConnect } from "@/app/utils/bd";
// import "@/app/models/user";

export async function GET(req:Request){
     try {
        await DBConnect();
        const products=await Product.find()
        .sort({createdAt:-1})
        .populate({
    path: "seller",
    select: "email firstName lastName",
  });

    if(!products){
        console.log("Products introuvables");
        
        return NextResponse.json({
            success:false,
            message:"Produits introuvables"
        },{status:404});
    }

    return NextResponse.json({
        success:true,
        data:products
    },{status:200});
        
     } catch (error) {
        console.log(error);
        return NextResponse.json({success:false,message:"Une erreur s'est produite"},{status:500});

     }
}