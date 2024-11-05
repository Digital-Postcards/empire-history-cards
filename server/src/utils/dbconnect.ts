import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    var mongoose: any;
}
let cached = global.mongoose
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbconnect() {
    if (cached.conn) {
        console.log("MongoDB was already connected");
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = await mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("MongoDB is now connected");
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default dbconnect;