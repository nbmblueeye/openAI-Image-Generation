import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import postRoute from "./routes/postRoute.js";
import openApiRoute from "./routes/openApiRoute.js";
import openAIDbConn from "./config/db.js";

import { handleCaptureOrder, handleOrder } from "./controllers/paypalController.js";

const app = express();
const port = process.env.PORT || 3000;
openAIDbConn();
  
// host static files
app.use(express.static("client"));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false }));

//OpenAI routes
app.use("/api/v1/openai", openApiRoute);
app.use("/api/v1/post", postRoute);

//Paypal routes
app.post("/api/orders", handleOrder);  
app.post("/api/orders/:orderID/capture", handleCaptureOrder);
    
app.listen(port, () => {
    console.log("Server running on port " + port);
});

