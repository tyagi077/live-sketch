import { HTTP_BACKEND } from "@/config";
import axios from "axios";

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
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  let exisitngShapes: Shape[] = await getExisitingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      exisitngShapes.push(parsedShape.shape);
      clearCanvas(exisitngShapes, canvas, ctx);
    }
  };

  clearCanvas(exisitngShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    (startX = e.clientX), (startY = e.clientY);
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    //@ts-ignore
    const selectedTool = window.selectedTool;

    let shape:Shape|null=null;

    if (selectedTool === "rect") {
       shape= {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width,
      };
     
    } else if (selectedTool === "circle") {
       shape = {
        type: "circle",
        centerX: startX+width/2,
        centerY: startY+height/2,
        radius: Math.max(width,height)/2,
      };
     
    }
    if(!shape){
        return
    }
    exisitngShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId,
      })
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(exisitngShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255,255,255)";

      //@ts-ignore
      const selectedTool = window.selectedTool;
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
  });
}

function clearCanvas(
  exisitngShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  exisitngShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }else if(shape.type==="circle"){
        ctx.beginPath();
        ctx.arc(shape.centerX,shape.centerY,shape.radius,0,2*Math.PI)
        ctx.stroke();
        ctx.closePath()
    }
  });
}

async function getExisitingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages.map((shape: { message: string }) => {
    // one more thing to notice is that in chat application we are sending textual data means but in excelidraw application we will send json data even its a string that get stored in database but it will not look like "hii mayank" it willl be like "{type:"rec" ,x:1,y:1,width:10,height:20}"
    //but actually i should make new schema that will have like rec shape cirecle shape this is beacsue if in my previosu logic soemone or its get stored strign than it will throw run time exception
    const messageData = JSON.parse(shape.message);
    return messageData.shape;
  });
  return shapes;
}
