import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
const wss = new WebSocketServer({ port: 8080 });
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  userName: string;
}

const users: User[] = [];

function checkUser(token: string): { userId: string; name: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
     
      if (typeof decoded === "string") {
        return null;
      }
  
      if (!decoded || !decoded.userId || !decoded.name) {
        return null;
      }
  
      return { userId: decoded.userId, name: decoded.name };
    } catch (e) {
      return null;
    }
  }

  function RoomCount(roomId: string) {
    const totalUsers = users.filter((user) => user.rooms.includes(roomId)).length;
  
    users.forEach((user) => {
      if (user.rooms.includes(roomId)) {
        user.ws.send(
          JSON.stringify({
            type: "total_user",
            totalUsers,
          })
        );
      }
    });
  }
  
  
wss.on("connection", async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  //Taking Token in from url "http:localhost:3000?ansajnsajnsjansanjsnajnsajnsaj"
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const currentUser = checkUser(token);

  if (currentUser?.userId == null) {
    ws.close();
    return null;
  }

  const existingUserIndex = users.findIndex((user) => user.userId === currentUser.userId);

  if (existingUserIndex !== -1) {
    const existingUser = users[existingUserIndex];
    existingUser?.ws.send(
        JSON.stringify({
          type: "session_replaced",
          message: "Your session has been replaced by a new connection.",
        })
      );

      existingUser?.ws.close();

      users[existingUserIndex]!.ws = ws;

    }else{

    users.push({
       ws,
      rooms: [],
      userId:currentUser.userId,
      userName: currentUser.name,
    });
  } 

  ws.on("close", () => {
   
    const index = users.findIndex((user) => user.ws === ws);
  
    if (index !== -1) {
        
      const disconnectedUser = users[index];
      // Remove the user from the list
      
      users.splice(index, 1);
  
      if (disconnectedUser?.rooms) {
        disconnectedUser.rooms.forEach((room) => {
          users.forEach((user) => {
            if (user.rooms?.includes(room) && user.ws !== ws) {
              user.ws.send(
                JSON.stringify({
                  type: "user_disconnected",
                  message: `${disconnectedUser?.userName} left `,
                })
              );
              RoomCount(room)
            }
          });
        });
      }
  
      

    }
  });
  

  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === "join_room") {
      const userArr = users.find((user) => user.ws === ws);
      if (!userArr) {
        ws.close();
        return;
      }
      if (!userArr?.rooms.includes(parsedData.roomId)) {
        userArr?.rooms.push(parsedData.roomId);

        users.forEach((user) => {
          if (user.rooms.includes(parsedData.roomId) && user.ws !== ws) {
            user.ws.send(
              JSON.stringify({
                type: "newUser_joined",
                message: `${userArr?.userName} Joined`,
              })
            );
          }
        });

      RoomCount(parsedData.roomId)

      } else {
        ws.send(
          JSON.stringify({
            type: "user_joining",
            message: "you have already joined the room ",
          })
        );
      }
    }

    if (parsedData.type === "leave_room") {
      const currentUser = users.find((user) => user.ws === ws);
      if (!currentUser) {
        return;
      }
      if (currentUser?.rooms.includes(parsedData.roomId)) {
        users.forEach((user) => {
          if (user.rooms.includes(parsedData.roomId) && user.ws !== ws) {
            user.ws.send(
              JSON.stringify({
                type: "user_disconnected",
                message: `${currentUser?.userName} Left`,
              })
            );
          }
        });
        currentUser.rooms = currentUser?.rooms.filter(
          (x) => x !== parsedData.roomId
        );
        
        RoomCount(parsedData.roomId)
      }
    }
    if (parsedData.type === "get_total_users") {
        RoomCount(parsedData.roomId)
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
           userId:currentUser.userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          // Prevent sending back to sender
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            })
          );
        }
      });
    }
  });

  ws.on("error", (err) => {
  console.error("WebSocket Error:", err);
});

});
