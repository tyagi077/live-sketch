"use client"

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";


export default function Room() {

    const Authcontext=useContext(AuthContext)
    const user = Authcontext?.user
    const roomAdmin=Authcontext?.roomAdmin
    const setRoomAdmin=Authcontext?.setRoomAdmin


    const [roomName,setRoomName]=useState("");
    const [submit,setSubmit]=useState(false);
    const [createRoomName,setCreateRoomName]=useState("");
    const [createRoomButton,setCreateRoomButton]=useState(false);
    const router = useRouter()
    
    const handleSubmit = async(e:React.FormEvent) => {
        setSubmit(true)
        e.preventDefault()
        if(roomName===""){
           toast.error("Please Enter Something",{
            pauseOnHover: true,
           })
           setSubmit(false)
           return;
        }
        try{

            const token =localStorage.getItem("D_token")
            if(!token){
                setSubmit(false)
                toast.error("Login first",{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
                return
            }
            
            const response = await axios.get(`${HTTP_BACKEND}/room/${roomName}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                  },
            })
            if(response.data.status){
                toast.success(response.data.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
                const id = response.data.id;
                const adminName=response.data.admin;
    
                localStorage.setItem("roomAdmin", adminName);
                 
                router.push(`/canvas/${id}`)
            }else{
                toast.error(response.data.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
                setSubmit(false)
            }

        }catch(error:any){
            if (error.response) {
                toast.error(error.response.data.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                });
                setSubmit(false)
            } else if (error.request) {
                toast.error("No response from server. Please try again later.",{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                });
                setSubmit(false)
            } else {
                toast.error(error.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                });
                setSubmit(false)
            }
        }

        setRoomName("")
    }


    

    const handleCreateRoom= async(e:React.FormEvent)=>{
        setCreateRoomButton(true)
        e.preventDefault()

        if(createRoomName===""){
           toast.error("Please Enter Something",{
            pauseOnHover: false,
            pauseOnFocusLoss: false,
           })
           setCreateRoomButton(false)
           return;
        }

        try{
            const token =localStorage.getItem("D_token")
            if(!token){
                setCreateRoomButton(false)
                toast.error("Login first",{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
                return
            }
            const response = await axios.post(`${HTTP_BACKEND}/room`,{
                name:createRoomName
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                  },
            })
            if(response.data.status){
                toast.success(response.data.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
                const id = response.data.roomId;
                router.push(`/canvas/${id}`)
            }else{
                toast.error(response.data.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
                setCreateRoomButton(false)
            }

        }catch(error:any){
            if (error.response) {
                toast.error(error.response.data.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                });
                setCreateRoomButton(false)
            } else if (error.request) {
                toast.error("No response from server. Please try again later.",{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                });
                setCreateRoomButton(false)
            } else {
                toast.error(error.message,{
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                });
                setCreateRoomButton(false)
            }
        }
       
        setCreateRoomName("")
    }

    return <div className="w-screen h-screen bg-[#111722] text-white  ">

        <div className="flex flex-col items-center pt-10 gap-6">

            <div className="bg-[#0F2139] p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0077FF" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            </div>

            <h1 className="text-5xl font-bold">Join a Room</h1>
            <p className="text-md text-center text-gray-400">Enter an existing room ID to join or create a new room to start <br /> collaborating.</p>

            <div className="flex gap-10 w-full justify-center pt-8">
                <div className="w-full max-w-90 flex flex-col gap-3 border border-gray-600 px-6 py-4 rounded-lg bg-[#0E131E]">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#0F2139] p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0077FF" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                            </svg>

                        </div>
                        <h3 className="text-xl">Join Existing Room</h3>
                    </div>
                    <p className="text-sm text-gray-400">Enter the room name to join an existing collaboration room and start working together.</p>

                    <form onSubmit={(e)=>handleSubmit(e)} >
                        <div className="flex flex-col gap-2 py-3 ">
                            <label >Room Name</label>
                            <input type="text" value={roomName} onChange={(e)=>setRoomName(e.target.value)} placeholder="Enter room name max length-20" maxLength={20} className="focus:outline-none focus:border-4 focus:border-blue-600 w-full px-3 py-2 border border-gray-600 bg-[#111722] rounded" />

                        </div>
                        <div className="relative cursor-pointer ">
                            <button type="submit" disabled={submit} className="w-full bg-blue-600 py-2 rounded cursor-pointer">{submit?'Finding...':'Join Room'}</button>
                            {submit?'':<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="size-5 absolute top-3 left-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>}
                        </div>
                    </form>

                </div>
                <div className="w-full max-w-90 flex flex-col gap-3 border border-gray-600 px-6 py-4 rounded-lg bg-[#0E131E]">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#0F2139] p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0077FF" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                        </div>
                        <h3 className="text-xl">Create New Room</h3>
                    </div>
                    <p className="text-sm text-gray-400">Start a new collaboration room and share the name with others to join.</p>
                   
                    <form onSubmit={(e)=>handleCreateRoom(e)} >
                    <div className="flex flex-col gap-2 pt-3 py-3">
                        <label >Room Name</label>
                        <input onChange={(e)=>setCreateRoomName(e.target.value)} type="text" placeholder="Enter room name max length-20" minLength={3} maxLength={20} className="focus:outline-none focus:border-4 focus:border-blue-600 w-full px-3 py-2 border border-gray-600 bg-[#111722] rounded" />

                    </div>
                    <div className="relative bg-[#1D2839] flex items-center justify-center gap-2 cursor-pointer rounded-lg">
                        <button type="submit" disabled={createRoomButton} className="py-2 rounded items text-md w-full">{createRoomButton?'Creating...':'Create Room'}</button>
                        {createRoomButton?'':<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="absolute top-2.5 left-52 size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>}

                    </div>
                   </form>
                </div>
            </div>






        </div>
        <div className="text-center text-sm  text-muted-foreground mt-15">
            <p>Need help? <a href="#" className="text-blue-600 hover:underline">View our FAQ</a> or <a href="/" className="text-blue-600 hover:underline">return to home</a></p>
        </div>

    </div>
}