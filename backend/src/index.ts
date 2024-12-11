import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-booking";
import oauthRoutes from "./routes/oauth"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Connected Database: ", process.env.MONGODB_CONNECTION_STRING);
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const PORT = 3001;
//Thu muc dist frontend chua cac file static gui truc tiep den client khi duoc yeu cau
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api", oauthRoutes)

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
app.listen(PORT, () => {
  console.log("Listening on localhost:3001");
});
