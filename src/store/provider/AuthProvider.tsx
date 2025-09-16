"use client";

import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux";
import { logout,setEmailVerified,setUser} from "@/src/store/slice/userSlice";
import { useVerifyAuthQuery } from '../api';
import {RootState} from '../store';


function AuthCheck({children}:{children:React.ReactNode}) {
     const [isCheckingAuth,setIsCheckingAuth] =useState(true);
     const {data,error,isLoading}=useVerifyAuthQuery();
     const dispatch =useDispatch();
     const user = useSelector((state:RootState)=>state.user.user);
     const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn);
     const isEmailVerified=useSelector((state:RootState)=>state.user.isEmailVerified);


     useEffect(()=>{

        const checkAuth=async()=>{

            try {

                if(data?.success){
                    dispatch(setUser(data?.data));
                    dispatch(setEmailVerified(!!data.data.isVerified));
                }else{
                    dispatch(logout());
                }   
                
                
            } catch (error) {
                    console.log(error);   
                      dispatch(logout());
            }finally{
                setIsCheckingAuth(false);
            }

        }

        if(!user && isLoggedIn || !user && !isLoggedIn){
            checkAuth();
        }else{
            setIsCheckingAuth(false);
        }


     },[data,user,isLoggedIn,dispatch,isEmailVerified]);


     if(isLoading || isCheckingAuth){
        return <div>Loading...</div>
     } 

  return <>{children}</> 
}

export default AuthCheck