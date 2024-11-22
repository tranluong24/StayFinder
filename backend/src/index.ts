import express, {Request, Response} from 'express'
import cors from 'cors'
import "dotenv/config"
import mongose from 'mongoose'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import cookieParser from 'cookie-parser'
import path from 'path'

mongose
.connect(process.env.MONGODB_CONNECTION_STRING as string) 
.then(()=>{
    console.log('Connected Database: ',
        process.env.MONGODB_CONNECTION_STRING
    )
})
.catch((err)=>{
    console.log('Error: ',err)
})


const  app = express()
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

const PORT = 3001
//Thu muc dist frontend chua cac file static gui truc tiep den client khi duoc yeu cau
app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)


app.listen(PORT, () =>{
    console.log("Listening on localhost:3001")
})