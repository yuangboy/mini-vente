
import {Document, Schema, model, Types} from "mongoose";


export interface IAdress extends Document{
    addressLine1:string;
    addressLine2?:string;
    city:string;
    state:string;
    country:string;
    phoneNumber?:string;
    pincode:number;
    user:Types.ObjectId;
}

const AddressSchema=new Schema<IAdress>({
    addressLine1:{type:String,required:true},
    addressLine2:{type:String,default:null},
    city:{type:String,required:true},
    state:{type:String,required:true},
    country:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    pincode:{type:Number,required:true},
    user:{type:Schema.Types.ObjectId,ref:"User",required:true}
},{
    timestamps:true
});


export default model<IAdress>("Address",AddressSchema);