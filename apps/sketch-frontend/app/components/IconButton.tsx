import { ReactNode } from "react"
export function IconButton({icon ,onClick,activated}:{
    icon:ReactNode,
    onClick:()=>void
    activated:boolean
}){
   return <div onClick={onClick} className={`cursor-pointer  rounded-full border-2 border-gray p-2 bg-black ${activated? 'text-red-600' :'text-white'}  hover:bg-gray`}>
    {icon}
   </div>
}