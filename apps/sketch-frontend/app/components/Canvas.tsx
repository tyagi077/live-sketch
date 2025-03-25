import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { ArrowRight, Circle, CircleIcon, Eraser, MousePointer2, Pencil, RectangleHorizontalIcon, Slash, Type } from "lucide-react";
import { Game } from "../draw/Game";
import { toast } from "react-toastify";

interface CanvasProps {
    roomId: string;
    socket: WebSocket;
}
export type Tool = "circle" | "pencil" | "rect" | "line" | "erase"

export function Canvas({ roomId, socket }: CanvasProps) {


    const [selectedTool, setSelectedTool] = useState<Tool>('circle')
    const [visible, setVisible] = useState(true)
    const [totalUsers, setTotalUsers] = useState(0)

    // this dimesnion is for canvas window screen
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    const [game, setGame] = useState<Game>();


    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 1,
            });
        };


        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        game?.setTool(selectedTool)
    }, [selectedTool])

    useEffect(() => {
        if (canvasRef.current && socket) {
            const g = new Game(canvasRef.current, roomId, socket);
            // initDraw(canvasRef.current, roomId, socket)
            setGame(g)

            return () => {
                g.destroy()
            }
        }
    }, [roomId, socket, dimensions])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {

            const message = JSON.parse(event.data);
            if (message.type === "total_user") {
                setTotalUsers(message.totalUsers);
            }
            if (message.type === "newUser_joined") {
                toast.success(message.message, {
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
            }
            if (message.type === "user_disconnected") {
                toast.error(message.message, {
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                })
            }

        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);


    return (
        <div>

            <div className="absolute z-10 top-0 left-1/2 m-4">
                <span className="text-red-500 text-lg">Live</span> <span className="absolute inline-flex top-2 h-3 w-3 rounded-full animate-ping bg-red-300 opacity-75"></span>  <span className="text-md">{totalUsers} connected</span>
            </div>
            <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height}></canvas>
            <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} visible={visible} />
        </div>
    )
}

function TopBar({ selectedTool, setSelectedTool, visible }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
    visible: boolean
}) {
    return (
        <div style={{ position: "fixed", top: 1, left: 10, marginTop: 12, border: '1px solid gray', padding: '12px 12px' }}>
            <div className="flex gap-2">
                <IconButton activated={selectedTool == "pencil"} icon={<Pencil />} onClick={() => { setSelectedTool("pencil") }}></IconButton>
                <IconButton activated={selectedTool == "rect"} icon={<RectangleHorizontalIcon />} onClick={() => { setSelectedTool("rect") }}></IconButton>
                <IconButton activated={selectedTool == "circle"} icon={<Circle />} onClick={() => { setSelectedTool("circle") }}></IconButton>
                <IconButton activated={selectedTool == "line"} icon={<Slash />} onClick={() => { setSelectedTool("line") }}></IconButton>
                <IconButton activated={selectedTool == "erase"} icon={<Eraser />} onClick={() => { setSelectedTool("erase") }}></IconButton>
            </div>

        </div>
    )
}