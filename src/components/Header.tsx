"use client";

import { LogInIcon, SearchIcon, ShoppingCart, LogOutIcon } from "lucide-react";
import React, { useState,useEffect} from "react";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { DialogDemo } from "./FenAuthenticate";
import { useSelector,useDispatch} from "react-redux";
import { RootState} from "@store/store";
import toast from "react-hot-toast";
import { useLogoutUserMutation,useGetCartQuery} from "@store/api";
import { logout } from "@store/slice/userSlice";
import { resetState } from "@store/reset";
import { authStatus } from "@store/slice/userSlice";
import Link from "next/link";
 

function Header() {
  const router = useRouter();
  const dispatch=useDispatch();

  const { setTheme, themes, theme } = useTheme();
  const [showDialog, setShowDialog] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.cart);
  
  const [logoutUser,{isLoading:isLogoutLoading}]=useLogoutUserMutation();

  const {data:cartData}=useGetCartQuery({userId:user?._id!},{skip:!user});

  const handleOnclick = (href: string) => {
    if (user) {
      router.push(href);
    } else {
      router.push("/login");
    }
  };

   const handleLogout=async()=>{
    console.log("logout");
    
        try{
          const response=await logoutUser().unwrap();
          if(response?.success){
            console.log("data logout: ",response);
             dispatch(logout());
             dispatch(resetState());
             dispatch(authStatus());
            // setIsOpenDialog(false);
            toast.success("Vous avez bien vous deconnecter");
            window.location.reload();
          }

        }catch(error){
          console.log(error);
          toast.error("Echec de la deconnexion");
        }
  }


  interface MenuItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  }

  const menuItems: MenuItem[] = user
    ? [
        {
          label: "Voir les produits",
          href: "/products",
          icon: <SearchIcon className="w-4 h-4" />,
        },
        {
          label: "logout",
          onClick: () => handleLogout(),
          icon: <LogOutIcon className="w-4 h-4" />,
        },
      ]
    : [
        {
          label: "Se connecter",
          onClick: () => setShowDialog(true),
          icon: <LogInIcon className="w-4 h-4" />,
        },
      ];

    
        useEffect(()=>{

    if(cartData?.success && cartData?.data){
      console.log("cartDataaaaa: ",cartData);
      dispatch({type:"cart/setCart",payload:cartData.data});
    }

  },[cartData,dispatch])
  const clickCart = (href:string) => {

    if(cart.items.length>0){
      router.push(href);
    }else{
      toast.error("Votre panier est vide");
    }
    
  }
  

  return (
    <div className="hidden md:block sticky top-0 z-[999] bg-white shadow-md p-4">
      <div className="container flex mx-auto px-10 items-center justify-between">
        <div>112</div>

        <div className="hidden flex-1 relative max-w-[500px] border-2 border-gray-500 rounded-full md:flex items-center justify-center py-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-8 mx-auto outline-none"
          />
          <SearchIcon className="absolute right-2" />
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative cursor-pointer" onClick={() => clickCart("/checkout/cart")}>
            <ShoppingCart className="w-6 h-6" />
            <Badge
              className="absolute -top-3 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              variant="destructive"
            >
               {cart?.items?.length || 0}
            </Badge>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Mon compte</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-amber-50 z-[999]">
              {user && (
                <DropdownMenuLabel>
                  <div className="flex space-x-2 items-center">
                    <Image
                      src="/images/customer.jpg"
                      alt="avatar"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                     {user.role==="particular" && ( <span className="font-semibold">{user?.lastName}</span>)} 
                     {user.role==="professional" && ( <span className="font-semibold">{user?.companyName}</span>)} 
                     {user.role==="admin" && ( <span className="font-semibold">Admin</span>)} 
                      <span className="text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              )}

              <DropdownMenuSeparator />

              {menuItems.map((item, index) => {
                if (item.href) {
                  return (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={item.href} className="flex items-center space-x-2">
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                } else {
                  return (
                    <DropdownMenuItem key={index} onClick={item.onClick}>
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                        {isLogoutLoading && (<span>...</span>)}
                      </div>
                    </DropdownMenuItem>
                  );
                }
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </div>
      </div>

      {/* ✅ Fenêtre modale rendue en dehors du menu */}
      {showDialog && (
        <DialogDemo
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}

export default Header;
