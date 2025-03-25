
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExisitingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;
    const shapes = messages?.map((shape: { message: string }) => {
      // one more thing to notice is that in chat application we are sending textual data means but in excelidraw application we will send json data even its a string that get stored in database but it will not look like "hii mayank" it willl be like "{type:"rec" ,x:1,y:1,width:10,height:20}"
      //but actually i should make new schema that will have like rec shape cirecle shape this is beacsue if in my previosu logic soemone or its get stored strign than it will throw run time exception
      const messageData = JSON.parse(shape.message);
      return messageData.shape;
    });
    return shapes;
  }