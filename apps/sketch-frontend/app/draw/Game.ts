import { toast } from "react-toastify";
import { Tool } from "../components/Canvas";
import { getExisitingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
    type: "pencil";
    points: { x: number; y: number }[];
  }
  |{
    type:"line";
     x:number;
     y:number;
     width:number;
     height:number;
  }|{
    type:"erase";
    x:number,
    y:number,
    width:number,
  }

export class Game{


    private canvas:HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D
    private exisitngShapes:Shape[];
    private roomId:string
    private socket:WebSocket
    private clicked:boolean
    private startX:number;
    private startY:number;
    private selectedTool:Tool|null="circle"
    
    
    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
        this.canvas=canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId=roomId
        this.socket=socket
        this.exisitngShapes=[]
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.clicked=false
        this.startX=0
        this.startY=0;
    }

    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup",this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler)
    }

    setTool(tool:"circle"| "pencil" |"rect" |"line" |"erase"){
        this.selectedTool=tool;
        console.log(this.selectedTool);
    }

    async init() {
        if (!this.roomId) {
            console.error("Room ID is undefined in init!");
            return;
        }
        this.exisitngShapes = await getExisitingShapes(this.roomId) || [];
        this.clearCanvas();
    }
    
    initHandlers(){
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.type=="joined_user"){
                toast.success(message.message)
            }
            if (message.type == "chat") {
              const parsedShape = JSON.parse(message.message);
              this.exisitngShapes.push(parsedShape.shape);
              this.clearCanvas();
            }
          };
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.exisitngShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                shape.points.forEach((point) => {
                    this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
                this.ctx.closePath();
            } else if(shape.type==="line"){
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x+shape.width,shape.y+shape.height);
                this.ctx.lineTo(shape.x,shape.y);
                this.ctx.stroke();
                this.ctx.closePath()
            }
        });
    }
    

    mouseDownHandler=(e)=>{
        this.clicked = true;
        this.startX = e.clientX
        this.startY = e.clientY;

        if (this.selectedTool === "pencil") {
            // Start a new pencil stroke
            this.exisitngShapes.push({
                type: "pencil",
                points: [{ x: this.startX, y: this.startY }],
            });
        }
         
    }
    mouseUpHandler = (e) => {

        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
    
        let shape: Shape | null = null;
        //@ts-ignore
        const selectedTool = this.selectedTool;
    
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width,
            };
        } else if (selectedTool === "circle") {
            shape = {
                type: "circle",
                centerX: this.startX + width / 2,
                centerY: this.startY + height / 2,
                radius: Math.max(width, height) / 2,
            };
        } else if (selectedTool === "pencil") {
            // Find last pencil shape and send it
            shape = this.exisitngShapes[this.exisitngShapes.length - 1];
        } else if (selectedTool==="line"){
            shape={
                type:"line",
                x:this.startX,
                y:this.startY,
                width,
                height
            }
        }
    
        if (!shape) return;
    
        this.exisitngShapes.push(shape);
    
        // Send shape to WebSocket
        this.socket.send(
            JSON.stringify({
                type: "chat",
                message: JSON.stringify({ shape }),
                roomId: this.roomId,
            })
        );
    };
    
    mouseMoveHandler=(e)=>{
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255,255,255)";
      
            //@ts-ignore
            const selectedTool = this.selectedTool;

            

            if (selectedTool === "rect") {
              this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "circle") {
              const centerX = this.startX + width / 2;
              const centerY = this.startY + height / 2;
              const radius = Math.max(width, height) / 2;
              this.ctx.beginPath();
              this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
              this.ctx.stroke();
              this.ctx.closePath();
            } else if(selectedTool==="line"){
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX+width,this.startY+height);
                this.ctx.lineTo(this.startX,this.startY);
                this.ctx.stroke()
           
            }else if (this.selectedTool === "pencil") {
                // Find the last drawn pencil stroke
                const lastShape = this.exisitngShapes[this.exisitngShapes.length - 1];
    
                if (lastShape && lastShape.type === "pencil") {
                    lastShape.points.push({ x: e.clientX, y: e.clientY });
    
                    this.ctx.beginPath();
                    this.ctx.moveTo(lastShape.points[0].x, lastShape.points[0].y);
                    lastShape.points.forEach((point) => {
                        this.ctx.lineTo(point.x, point.y);
                    });
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
          }
    }

    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler)

          this.canvas.addEventListener("mouseup", this.mouseUpHandler);

          this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}






























