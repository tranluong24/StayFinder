import express, {Request, Response} from 'express'
import cors from 'cors'
import "dotenv/config"

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get("/api/test", async(req: Request, res: Response)=>{
    res.json({message:"Hello from Express !"})
})

app.listen(3001, ()=>{
    console.log("Server running on localhost:3001")
})
