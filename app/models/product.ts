import { Document, Schema, model, Types,models } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number;
  category: string;
  image: string[] | null;
  seller: Schema.Types.ObjectId;
  typeClient: "particular" | "professional";
  productType: "high-end-phone" | "mid-range-phone" | "laptop";
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: [String], default: null },
   seller: {
  type:Schema.Types.ObjectId,
  ref: "User",
  required: true
},
    typeClient: {
      type: String,
      enum: ["particular", "professional"],
      default: "particular",
    },
  productType: {
  type: String,
  enum: ["high-end-phone", "mid-range-phone", "laptop"],
  required: true,
}
  },
  {
    timestamps: true,
  }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
