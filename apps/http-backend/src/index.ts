import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { createUserSchema,SiginSchema,createRoomSchema} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cors())

app.post("/Signup", async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      status:false,
      message: "Incorrect inputs",
    });
    return;
  }

  try {

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: parsedData.data?.password,
        name: parsedData.data?.name,
      },
    });

   
    res.json({
      status:true,
      message:"Account created successfully!",
      userId: user.id,
    });

  } catch (e) {
    res.status(411).json({
      status:false,
      message: "User already exists with this Email",
    });
    return;
  }
});

app.post("/Signin", async (req, res) => {
  const parsedData = SiginSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    res.json({
      status:false,
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    
    const user = await prismaClient.user.findFirst({
      where: {
        
        email: parsedData.data?.username,
        password: parsedData.data?.password,
      },
    });
    
  
    if (!user) {
      res.json({
        status:false,
        message: "password or email is wrong",
      });
      return;
    }
    const token = jwt.sign(
      {
        userId: user?.id,
        name:user?.name
      },
      JWT_SECRET
    );

    res.json({
      status:true,
      message:`Welcome back, ${user?.name}`,  
      token,
    });
  } catch (e:any) {
    
    res.json({
      status:false,
      message: e.message,
    });
    return;
  }
});

app.get("/data",middleware,async(req,res)=>{
  

  try{
    //@ts-ignore
    const id = req.userId
  const user = await prismaClient.user.findFirst({
    where:{
      id
    },
    select:{
      id:true,
      email:true,
      name:true,
      photo:true
    }
  })
  if(!user){
    res.json({
      status:false,
      message:"User does not exist"
    })
  }
  res.json({
    status:true,
    user
  })
  }
  catch(error:any){
    res.json({
      status:false,
      message:error.message
    })
  }
})


app.post("/room", middleware, async (req, res) => {
  const parsedData = createRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      status:false,
      message: "Incorrect inputs",
    });
    return;
  }

//@ts-ignore 
  const UserId = req.userId;
  try{
    const room = await prismaClient.room.create({
        data:{
            slug:parsedData.data?.name,
            adminId:UserId 
        }
      })
      res.json({
        status:true,
        message:"Room created successfully! 🚀 Invite others to join.",
        roomId: room.id,
      });
  }catch(e){
    res.status(411).json({
      status:false,
      message:"Room already exists with this name"
    })
    return
  }
});

app.get("/chats/:roomId",async (req,res)=>{
 try{
  const roomId=Number(req.params.roomId)
  const messages=await prismaClient.chat.findMany({
    where:{
      roomId:roomId
    },
    include:{
      user:{
        select:{
          name:true,
          photo:true
        }
      }
    },
    
    orderBy:{
      id:"desc"
    },
    take:100
  })
  res.json({
    messages
  })
 }
 catch(error){
  res.json({
    error
  })
  return
 }
})

//Here the slug means name of the room 
app.get("/room/:slug",middleware,async (req,res)=>{
  const slug=req.params.slug;
 try{
   
  const room=await prismaClient.room.findFirst({
    where:{
      slug
    },
    include:{
      admin:true
    }
  })
  if(!room){
    res.json({
      status:false,
      message:"No room with this name"
    })
    return;
  }
  
  res.json({
    status:"true",
    id:room.id,
    admin:room.admin.name,
    message:"Room found! You have successfully joined. 🎉"
  })
 }catch(error){
  res.json({
    status:"false",
     message:"Server Error"
  })
 }
})

app.listen(3002);
