import { useEffect, useRef, useState, useCallback } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Slash } from "lucide-react";
import { Game } from "../draw/Game";
import { toast } from "react-toastify";

interface CanvasProps {
  roomId: string;
  socket: WebSocket;
}
export type Tool = "circle" | "pencil" | "rect" | "line" ;

export function Canvas({ roomId, socket }: CanvasProps) {
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [totalUsers, setTotalUsers] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [game, setGame] = useState<Game>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 1,
    });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (game) {
      game.setTool(selectedTool);
    }
  }, [selectedTool, game]); // Added game to dependencies

  useEffect(() => {
    if (canvasRef.current && socket) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);
      return () => g.destroy();
    }
  }, [roomId, socket, dimensions]);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "total_user":
          setTotalUsers(message.totalUsers);
          break;
        case "newUser_joined":
          toast.success(message.message, {
            pauseOnHover: false,
            pauseOnFocusLoss: false,
          });
          break;
        case "user_disconnected":
          toast.error(message.message, {
            pauseOnHover: false,
            pauseOnFocusLoss: false,
          });
          break;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }, []);

  useEffect(() => {
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, handleMessage]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2 m-4 flex items-center gap-2">
        <span className="text-red-500 text-lg">Live</span>
        <span className="relative inline-flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-md">{totalUsers} connected</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="block bg-white"
      />
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function TopBar({ selectedTool, setSelectedTool }: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div className="fixed top-3 left-3 mt-3 border border-gray-300 p-3 bg-black rounded-md shadow-sm">
      <div className="flex gap-2">
        <IconButton 
          activated={selectedTool === "pencil"}
          icon={<Pencil size={20} />}
          onClick={() => setSelectedTool("pencil")}
        />
        <IconButton
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon size={20} />}
          onClick={() => setSelectedTool("rect")}
        />
        <IconButton
          activated={selectedTool === "circle"}
          icon={<Circle size={20} />}
          onClick={() => setSelectedTool("circle")}
        />
        <IconButton
          activated={selectedTool === "line"}
          icon={<Slash size={20} />}
          onClick={() => setSelectedTool("line")}
        />
        
      </div>
    </div>
  );
}