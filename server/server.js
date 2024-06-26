import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import path from "path";
import postRoute from "./routes/postRoute.js";
import openApiRoute from "./routes/openApiRoute.js";
import openAIDbConn from "./config/db.js";

import { handleCaptureOrder, handleOrder } from "./controllers/paypalController.js";

const app = express();
const port = process.env.PORT || 3000;
openAIDbConn();
  
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false }));

//OpenAI routes
app.use("/api/v1/openai", openApiRoute);
app.use("/api/v1/post", postRoute);

//Paypal routes
app.post("/api/orders", handleOrder);  
app.post("/api/orders/:orderID/capture", handleCaptureOrder);

if(process.env.NODE_ENV === "production") {
    let __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "/client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
        res.send("Server connection");
    })
}else{
    app.get("/", (req, res) => {
        res.send('API is running....')
    })
}

app.listen(port, () => {
    console.log("Server running on port " + port);
});

