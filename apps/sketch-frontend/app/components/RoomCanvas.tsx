"use client"

import { useEffect, useState } from "react";

import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    
    const [socket,setSocket]=useState<WebSocket |null >(null);

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem("D_token")}`)
        ws.onopen=()=>{
            console.log("WebSocket connected");
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
            
            ws.send(JSON.stringify({ type: "get_total_users", roomId }));
        }

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
          };
          

        return () => {
            console.log("Component unmounting, closing WebSocket...");
            ws.close();
        };



    },[roomId])

     
        if(!socket){
           
            return <div className="">
                Connecting to server....
            </div>
        }
        return <div>
           <div className="absolute z-10  top-2 right-0 m-4">
            Room Admin : <span>{localStorage.getItem("roomAdmin")}</span>
           </div>

            <Canvas roomId={roomId} socket={socket} />
           
        </div>
}