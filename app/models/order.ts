import { Document, Schema, model, Types } from "mongoose";
import type { IAdress } from "./address.ts";

export interface IOrderItem extends Document {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: Schema.Types.ObjectId | IAdress;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  totalAmount: number;
  paymentDetails: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  status: "processing" | "shipped" | "delivered" | "cancelled";
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  status: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
},{
    timestamps: true,
  });

export default model<IOrder>("Order", OrderSchema);
