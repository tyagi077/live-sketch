"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";


type user={
    id:string,
    name:string,
    email:string,
    photo:string|null
}
type AuthContextType = {
    user: user|null
    setUser:(user:user|null)=>void,
    roomAdmin: string|null,
    setRoomAdmin:(admin:string)=>void
  };


export const AuthContext = createContext<AuthContextType|null>(null);
export function AuthProvider({children}:{children:ReactNode}){

    const [user,setUser]=useState<user|null>(null);
    const [roomAdmin,setRoomAdmin]=useState<string|null>(null);
    async function findUser(){
       try{
        const token =localStorage.getItem("D_token");
        if(token){
            const response = await axios.get(`${HTTP_BACKEND}/data`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(response.data.status){
                setUser(response.data.user)
            }else{
                setUser(null)
                toast.error("Login Now")
            }
        }
       }catch(error:any){
        toast.error(error.message)
       }

    }

    useEffect(()=>{
        findUser()

    },[])


    return (
        <AuthContext.Provider value={{user,setUser,roomAdmin,setRoomAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}