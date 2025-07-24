import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("⚡ Database connected successfully");
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

export default connectDB;