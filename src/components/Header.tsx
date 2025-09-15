"use client";



import { SearchIcon, ShoppingCart } from 'lucide-react'
import React,{useState} from 'react'
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from './ModeToggle'
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

function Header() {
  const { setTheme,themes,theme } = useTheme();


  
  return (
    <div className='hidden md:block sticky  top-0 z-[999] bg-white shadow-md p-4'>

        <div className='container flex mx-auto px-10 tems-center justify-between'>
            <div>112</div>
            <div className='hidden  flex-1 relative max-w-[500px] border-2 border-gray-500 rounded-full md:flex items-center justify-center py-2'>
                <input type="text" placeholder='Search' className='w-full px-8 mx-auto outline-none'/>
                <SearchIcon className='absolute right-2'/>
            </div>

           <div className='flex items-center space-x-4'>
             <div className='flex items-center space-x-2'>
             <div className='relative '>
               <ShoppingCart className='w-6 h-6'/>
               <Badge
          className="absolute -top-3 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="destructive"
        >
          99
        </Badge>
             </div>
            </div>
            <Button>
              Mon compte
            </Button>
            <ModeToggle/>
           </div>

        </div>

    </div>
  )
}

export default Header