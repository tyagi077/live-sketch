import { toast } from "react-toastify";
import { Tool } from "../components/Canvas";
import { getExisitingShapes } from "./http";

type Point = { x: number; y: number };

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "pencil"; points: Point[] }
  | { type: "line"; x: number; y: number; width: number; height: number };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private selectedTool: Tool | null = "circle";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: "circle" | "pencil" | "rect" | "line") {
    this.selectedTool = tool;
  }

  private async init() {
    if (!this.roomId) {
      console.error("Room ID is undefined!");
      return;
    }
    this.existingShapes = (await getExisitingShapes(this.roomId)) || [];
    this.clearCanvas();
  }

  private initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "joined_user") {
        toast.success(message.message);
      }
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => this.drawShape(shape));
  }

  private drawShape(shape: Shape) {
    this.ctx.strokeStyle = "rgba(255,255,255)";
    this.ctx.beginPath();

    switch (shape.type) {
      case "rect":
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "circle":
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        break;

      case "pencil":
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        shape.points.forEach((point) => this.ctx.lineTo(point.x, point.y));
        this.ctx.stroke();
        break;

      case "line":
        this.ctx.moveTo(shape.x, shape.y);
        this.ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
        this.ctx.stroke();
        break;
    }

    this.ctx.closePath();
  }

  private mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.selectedTool === "pencil") {
      this.existingShapes.push({
        type: "pencil",
        points: [{ x: this.startX, y: this.startY }],
      });
    }
  };

  private mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    let shape: Shape | null = null;
    const selectedTool = this.selectedTool;

    if (selectedTool === "rect") {
      shape = { type: "rect", x: this.startX, y: this.startY, width, height };
    } else if (selectedTool === "circle") {
      shape = {
        type: "circle",
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
        radius: Math.max(width, height) / 2,
      };
    } else if (selectedTool === "pencil") {
      shape = this.existingShapes[this.existingShapes.length - 1];
    } else if (selectedTool === "line") {
      shape = { type: "line", x: this.startX, y: this.startY, width, height };
    } 

    if (!shape) return;
    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
  };

  private mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    this.clearCanvas();

    this.ctx.strokeStyle = "rgba(255,255,255)";
    this.ctx.beginPath();

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.max(width, height) / 2;
      this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
      this.ctx.stroke();
    } else if (this.selectedTool === "line") {
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.startX + width, this.startY + height);
      this.ctx.stroke();
    } else if (this.selectedTool === "pencil") {
      const lastShape = this.existingShapes[this.existingShapes.length - 1];
      if (lastShape && lastShape.type === "pencil") {
        lastShape.points.push({ x: e.clientX, y: e.clientY });
        this.drawShape(lastShape);
      }
    }

    this.ctx.closePath();
  };

  private initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
