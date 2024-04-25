import dotenv from 'dotenv';
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI(
   {apiKey: process.env.OPENAI_API_KEY}
);

const generateImage = async(req, res) => {
  
   const { description } = req.body;
   if(!description){
      res.status(400);
      res.json({
         status: "error",
         description: true, 
         message:"Please enter input Field"
      });
   }else{
      try {
         const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: description,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
         });
         const image_url = response.data[0].b64_json;
         
         res.status(200);
         res.json({
            status: "image",
            image:image_url,
            message:"Submit successfully"
         });   
      } catch (error) {
         console.error(error);
         throw new Error((error?.response && error?.response.data && error?.response.data.message)||"Leap generated image failed");
      }
   }
};


export { generateImage };