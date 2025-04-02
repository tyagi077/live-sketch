"use client"
import { RoomCanvas } from "@/app/components/RoomCanvas";
import { useParams } from "next/navigation";



export default function CanvasPage() {
    const params = useParams();
    const roomId = String(params.roomId);
  return <RoomCanvas roomId={roomId} />;
}