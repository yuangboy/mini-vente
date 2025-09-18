


interface ISeller{
firstName?:string;
lastName?:string;
companyName?:string;
siren?:string;
tvaNumber?:string;
annualRevenue?:number;
email:string;
}

export interface IBook{
 _id?:string;
image:[string];
title:string;
category:string;
description?:string;
price:number;
seller:ISeller;
typeClient: "particular" | "professional";
productType: "high-end-phone" | "mid-range-phone" | "laptop";
createdAt:Date;
}

export const filters={
  category:["smartphone","laptop","tablet"],
  productType:["high-end-phone","mid-range-phone","laptop"],
  typeClient:["particular","professional"]
}

export const books:IBook[]=[
     {
    _id: "1",
    image: [
      "https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg",
    ],
    title: "Card Title1",
    category: "smartphone",
    description:
      "A card component has a figure a body part, and inside body there are title and actions parts",
    price: 300,
    createdAt: new Date("2023-04-01"),
    seller: {
      lastName: "MOUNKA",
      firstName:"Alex Junior",
      email:"alex@gmail.com"
    },
    typeClient: "particular",
    productType: "high-end-phone"
  },
     {
    _id: "2",
    image: [
      "https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg",
    ],
    title: "Card Title1",
    category: "smartphone",
    description:
      "A card component has a figure a body part, and inside body there are title and actions parts",
    price: 300,
    createdAt: new Date("2023-04-01"),
    seller: {
      companyName:"DD Production",
      annualRevenue:1000000,
      siren:"CG-190112345",
      tvaNumber:"TVA-001",
      email:"alex"
    },
    typeClient:"professional",
    productType: "high-end-phone",
  },
     {
    _id: "3",
    image: [
      "https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg",
    ],
    title: "Card Title1",
    category: "smartphone",
    description:
      "A card component has a figure a body part, and inside body there are title and actions parts",
    price: 300,
    createdAt: new Date("2023-04-01"),
    seller: {
      companyName:"DD Production",
      annualRevenue:1000000,
      siren:"CG-190112345",
      tvaNumber:"TVA-001",
      email:"alex"
    },
    typeClient:"professional",
    productType: "mid-range-phone"
  },
     {
    _id: "4",
    image: [
      "https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg",
    ],
    title: "Card Title1",
    category: "smartphone",
    description:
      "A card component has a figure a body part, and inside body there are title and actions parts",
    price: 300,
    createdAt: new Date("2023-04-01"),
    seller: {
      companyName:"DD Production",
      annualRevenue:1000000,
      siren:"CG-190112345",
      tvaNumber:"TVA-001",
      email:"alex"
    },
    typeClient:"professional",
    productType: "laptop"
  },
    {
    _id: "5",
    image: [
      "https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg",
    ],
    title: "Card Title1",
    category: "smartphone",
    description:
      "A card component has a figure a body part, and inside body there are title and actions parts",
    price: 300,
    createdAt: new Date("2023-04-01"),
    seller: {
      lastName: "MOUNKA",
      firstName:"Alex Junior",
      email:"alex@gmail.com"
    },
    typeClient: "particular",
    productType: "mid-range-phone"
  },
]