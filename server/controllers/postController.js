import ImageAI from '../models/Image.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const getPosts = async(req, res) => {
 
    try {
        let images = await ImageAI.find().sort({_id:-1}).limit(60);
      
        res.status(200);
        res.json({
           status: "success",
           data: images
        })
    } catch (error) {
        console.log(error);
    }
};

const addPost = async(req, res) => {
    const { paymentId, description , image} = req.body;
    if(!description){
        res.status(400);
        res.json({
           status: "error", 
           description: !description ? true:false, 
           message:"Please enter input Field"
        });
     }else{
        let bufferObj = Buffer.from(image.replace(/^data:.+;base64,/,""), 'base64');
        const fileName = new Date().getTime();
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
            }
        });

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: `${paymentId}_${fileName}.png`,
            Body: bufferObj,
            ContentEndCoding:"base64",
            ACL: "public-read",
        });
        
        try {
            const response = await s3.send(command);
            if(response){
                try {
                    let updateImage = await ImageAI.findOne({paymentId: paymentId});
                    updateImage.description = description,
                    updateImage.image = `https://nbmblueeyeopenai.s3.ap-southeast-1.amazonaws.com/${paymentId}_${fileName}.png`
                    await updateImage.save();
                    res.status(200);
                    res.json({
                        status:"saving",
                        description: false, 
                        image:updateImage.image,
                        message:"Saving image is successful",
                    });
                    
                } catch (error) {
                    console.log(error);
                    throw new Error("Saving image to MongoDB failed");
                }
            }
        } catch (err) {
            console.error(err);
            throw new Error("Saving image to AWS failed");
        }
    }
};

const getPost = async(req, res) => {
    const {id} = req.params;
    if(id){
        try {
           let image = await ImageAI.findById(id);
           res.status(200);
           res.json({
            data: image,
           }) 
        } catch (error) {
            console.log(error);
            throw new Error("Cannot find post");
        }
    }
}

export { getPosts, addPost, getPost };