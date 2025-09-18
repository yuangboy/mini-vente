"use client";
import React, { useState,useEffect} from 'react'

import { RootState } from '@/src/store/store';
import {useDispatch,useSelector} from "react-redux"; 


export default function Page() {

    const dispatch = useDispatch();
    const user=useSelector((state:RootState)=>state.user.user);
    const cart=useSelector((state:RootState)=>state.cart.items);

    const [totalAmount,setTotalAmout]=useState<number>(0);



    const calculPrice=(
        ProductType:"high-end-phone" | "mid-range-phone" | "laptop",
        clientType:"particular" | "professional",
        annualRevenue?:number,
        tvaNumber?:string,
    ):number=>{

        const tva=19;

        let prices={
            particular:{
                "high-end-phone":1500,
                "mid-range-phone":800,
                laptop:1200,
            },
            professionalLow:{
                "high-end-phone":1150,
                "mid-range-phone":600,
                laptop:1000,
            },
            professionalHigh:{
                "high-end-phone":1000,
                "mid-range-phone":550,
                laptop:900,
            },
        }

        if(clientType==="particular") return prices.particular[ProductType] * (1+(tva/100));
        if((annualRevenue??0)>10000000){
            if(tvaNumber && tvaNumber.length > 0){
                return prices.professionalHigh[ProductType];
        }else{
            return prices.professionalHigh[ProductType] * (1+(tva/100));
        }
    }

       if(annualRevenue ?? 0 < 10000000) {

        if(tvaNumber && tvaNumber.length > 0){
            return prices.professionalLow[ProductType];
        }else{
            return prices.professionalLow[ProductType] * (1+(tva/100));
        }
       }

       return prices.particular[ProductType] * (1+(tva/100));

    }
    const convertPrice=(
        ProductType:"high-end-phone" | "mid-range-phone" | "laptop",
        clientType:"particular" | "professional",
        annualRevenue?:number,
    ):number=>{

        let prices={
            particular:{
                "high-end-phone":1500,
                "mid-range-phone":800,
                laptop:1200,
            },
            professionalLow:{
                "high-end-phone":1150,
                "mid-range-phone":600,
                laptop:1000,
            },
            professionalHigh:{
                "high-end-phone":1000,
                "mid-range-phone":550,
                laptop:900,
            },
        }

        if(clientType==="particular") return prices.particular[ProductType];
        if((annualRevenue??0)>10000000) return prices.professionalHigh[ProductType] ;
       return prices.professionalLow[ProductType];

    }


   useEffect(()=>{

     const totalProduct=():number=>{
            let total=0;

     for(const item of cart){
        const price=calculPrice(item.product.productType,item.product.typeClient,user?.annualRevenue,item.product.tvaNumber);
        total+=price*item.quantity;
     }

     return total;

    }

    setTotalAmout(totalProduct());

   },[cart,totalAmount]);



  return (
    <div className='min-h-screen max-w-7xl mx-auto'>

        <div className='container lg:px-10 px-4 flex flex-col gap-4 mt-4'>
           {
            cart.map((cartItem:any,index:number)=>(
                <div className='flex gap-4' key={index}>
                    <img src={cartItem.product.image[0]} className='w-20 h-20 object-contain'/>
                    <div className='flex flex-col gap-2'>
                        <p>{cartItem.product.title}</p>
                        <p>${convertPrice(cartItem.product.productType,cartItem.product.typeClient,user?.annualRevenue)}</p>
                        
                    </div>
                </div>
            ))

           }
           <span className='text-2xl font-semibold'>Total: {totalAmount}</span>

        </div>

    </div>
  )
}
