import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from "./routes/users";

mongoose
.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then(()=>{
    console.log('Connected MongoDB')
})
.catch((err) =>{
    console.log('Error: ', err)
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const PORT = 3001

app.use("/api/users", userRoutes)

app.listen(PORT, ()=>{
    console.log("Server running on localhost:3001")
})
