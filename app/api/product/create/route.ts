import { NextResponse, NextRequest } from "next/server";
import Product from "@/app/models/product";
import { uploadToCloudinary } from "@/app/utils/cloudinaryConfig";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import { DBConnect } from "@/app/utils/bd";

interface IProduct {
  title: string;
  description?: string;
  price: number;
  category: string;
  image: string[] | null;
  shippingCharge: string;
  seller: string;
  typeClient: "particular" | "professional";
  productType: "high-end-phone" | "mid-range-phone" | "laptop";
}

export async function POST(req: Request) {
  try {
     await DBConnect();

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const priceRaw = formData.get("price")?.toString();
    const category = formData.get("category")?.toString();
    const seller = formData.get("seller")?.toString();
    const typeClient = formData.get("typeClient")?.toString();
    const productType = formData.get("productType")?.toString();

    const price = priceRaw ? Number(priceRaw) : NaN;

    if (
      !title || !description || isNaN(price) || !category ||
      !seller || !typeClient || !productType
    ) {
      return NextResponse.json(
        { success: false, message: "Veuillez remplir tous les champs correctement." },
        { status: 400 }
      );
    }

    const rawImages = formData.getAll("image");
    const images = rawImages.filter((file): file is File => file instanceof File);

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Veuillez choisir au moins une image." },
        { status: 400 }
      );
    }

    const uploadedImages = await Promise.all(images.map(uploadToCloudinary));
    const imagesUrl = uploadedImages.map((img) => img.secure_url);

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      seller,
      typeClient,
      productType,
      image: imagesUrl,
    });

    await newProduct.save();

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}


export function getDynamicPrice(
  productType: "high-end-phone" | "mid-range-phone" | "laptop",
  clientType: "particular" | "professional",
  annualRevenue?: number
): number {
  const prices = {
    particular: {
      "high-end-phone": 1500,
      "mid-range-phone": 800,
      laptop: 1200,
    },
    professionalLow: {
      "high-end-phone": 1150,
      "mid-range-phone": 600,
      laptop: 1000,
    },
    professionalHigh: {
      "high-end-phone": 1000,
      "mid-range-phone": 550,
      laptop: 900,
    },
  };

  if (clientType === "particular") return prices.particular[productType];
  if ((annualRevenue ?? 0) > 10_000_000)
    return prices.professionalHigh[productType];
  return prices.professionalLow[productType];
}
