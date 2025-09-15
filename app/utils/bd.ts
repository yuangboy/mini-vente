import mongoose from "mongoose"

export const DBConnect=async()=>{
 
    mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL as string,{
        dbName:"mini-vente"
    }).then((res)=>{
        console.log("db connected");
    }).catch((err)=>{
        console.log(err);
    })

}