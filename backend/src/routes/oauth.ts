import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const router = express.Router();

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CALLBACK_URL = "http%3A//localhost:3001/api/google/callback";
const GOOGLE_OAUTH_SCOPES = [
  "https%3A//www.googleapis.com/auth/userinfo.email",

  "https%3A//www.googleapis.com/auth/userinfo.profile",
];

const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL as string;

router.get("/loginGoogle", async (req: Request, res: Response) => {
  const state = "some_state";
  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

router.get("/google/callback", async (req: Request, res: Response) => {
  //   console.log(req.query); // In ra tham số query từ URL (chứa mã ủy quyền)
  const { code } = req.query; // Lấy mã ủy quyền từ tham số query

  const data = {
    code, // Mã ủy quyền từ Google
    client_id: process.env.CLIENT_ID, // ID của ứng dụng client
    client_secret: GOOGLE_CLIENT_SECRET, // Bí mật client
    redirect_uri: "http://localhost:3001/api/google/callback", // URL callback của bạn
    grant_type: "authorization_code", // Loại yêu cầu là "authorization_code"
  };

  // Gửi yêu cầu POST tới Google để trao đổi mã ủy quyền lấy access token
  const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Cấu hình header cho yêu cầu POST
    },
    body: JSON.stringify(data), // Chuyển đối tượng data thành chuỗi JSON
  });

  const access_token_data = await response.json(); // Phân tích JSON từ phản hồi

  //   console.log(access_token_data); // In ra dữ liệu phản hồi từ Google

  // Bạn có thể sử dụng access_token_data.access_token để truy cập vào API của Google
  // Hoặc thực hiện các bước tiếp theo (như lưu token vào cơ sở dữ liệu, v.v.)

  // Trích xuất id_token từ dữ liệu trả về
  const { id_token } = access_token_data;
  //   console.log(id_token);
  // Xác minh và trích xuất thông tin trong id_token
  const token_info_response = await fetch(
    `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
  );

  // Trả về kết quả với thông tin của mã thông báo
  const token_info = await token_info_response.json();
  //   res.status(token_info_response.status).json(token_info);
  const { email, given_name, family_name } = token_info;

  let user = await User.findOne({ email });
  let isOK = false
  if (!user) {
    user = await User.create({
      email,
      firstName: given_name,
      lastName: family_name,
      password: token_info_response.toString(),
      role: "user",
      status: "done"
    });

    isOK = !!user && !!user.id;
    console.log(user)

    }else {
        isOK = await bcrypt.compare(token_info_response.toString(), user.password)
        if(!isOK){
            res.status(400).json({
                message: "Invalid Credentials"
            })
        }
    }

    if(isOK){
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "1d" }
        );

        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENT === "production",
          maxAge: 86400000,
        });    
        res.redirect("http://localhost:5173/");
    }
});

export default router;
