import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Point = { x: number; y: number };

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "pencil"; points: Point[] };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const existingShapes: Shape[] = await getExisitingShapes(roomId);
  let clicked = false;
  let startX = 0;
  let startY = 0;
  let selectedTool: "rect" | "circle" | "pencil" = "rect"; // Default tool

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);

  canvas.addEventListener("mousedown", (e) =>
    mouseDownHandler(e, () => (selectedTool = getSelectedTool()))
  );
  canvas.addEventListener("mouseup", (e) =>
    mouseUpHandler(e, socket, roomId, existingShapes)
  );
  canvas.addEventListener("mousemove", (e) =>
    mouseMoveHandler(e, existingShapes, canvas, ctx)
  );

  function mouseDownHandler(
    e: MouseEvent,
    setTool: () => "rect" | "circle" | "pencil"
  ) {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
    selectedTool = setTool();
  }

  function mouseUpHandler(
    e: MouseEvent,
    socket: WebSocket,
    roomId: string,
    existingShapes: Shape[]
  ) {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = { type: "rect", x: startX, y: startY, width, height };
    } else if (selectedTool === "circle") {
      shape = {
        type: "circle",
        centerX: startX + width / 2,
        centerY: startY + height / 2,
        radius: Math.max(width, height) / 2,
      };
    }

    if (!shape) return;
    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      })
    );
  }

  function mouseMoveHandler(
    e: MouseEvent,
    existingShapes: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    if (!clicked) return;

    const width = e.clientX - startX;
    const height = e.clientY - startY;

    clearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "rgba(255,255,255)";

    if (selectedTool === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (selectedTool === "circle") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      const radius = Math.max(width, height) / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }

  function getSelectedTool(): "rect" | "circle" | "pencil" {
    return "rect"; // Default tool; replace with dynamic logic if needed
  }
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => drawShape(shape, ctx));
}

function drawShape(shape: Shape, ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "rgba(255,255,255)";
  ctx.beginPath();

  if (shape.type === "rect") {
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  } else if (shape.type === "circle") {
    ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.closePath();
}

async function getExisitingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages: { message: string }[] = res.data.messages;

  const shapes = messages.map((shape: { message: string }) => {
    const messageData: { shape: Shape } = JSON.parse(shape.message);
    return messageData.shape;
  });

  return shapes;
}

