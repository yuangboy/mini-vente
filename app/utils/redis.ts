import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";


const RedisClient=()=>{
    if(process.env.NEXT_PUBLIC_REDIS_URL) return new Redis(process.env.NEXT_PUBLIC_REDIS_URL);
    throw new Error("Redis URL not found");
}

export default RedisClient;

