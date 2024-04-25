import mongoose from "mongoose";
import colors from "colors";

const openAIDbConn = async () => {
    try {
        let conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB " + conn.connection.host.cyan.underline);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default openAIDbConn;