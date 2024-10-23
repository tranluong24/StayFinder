import express, {Request, Response} from 'express'
import cors from 'cors'
import "dotenv/config"
import mongose from 'mongoose'


mongose
.connect(process.env.MONGO_CONNECTION_STRING as string) 
.then(()=>{
    console.log('Connected MongoDB')
})
.catch((err)=>{
    console.log('Error: ',err)
})


const  app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const PORT = 3001

app.get("/api/test", async(req: Request, res:  Response)=>{
    res.json({message: "Hello from Express endpoint !"})
})

app.listen(PORT, () =>{
    console.log("Listening on localhost:3001")
})