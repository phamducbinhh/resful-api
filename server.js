import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./router/seedRoutes.js";
import productRouter from "./router/productRoutes.js";
import userRouter from "./router/userRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import uploadRouter from "./router/uploadRoutes.js";

// kết nối với mongo db
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
//express.json()là một phương thức được tích hợp sẵn để nhận ra Đối tượng Yêu cầu đến là một Đối tượng JSON . Phương thức này được gọi là phần mềm trung gian trong ứng dụng của bạn bằng cách sử dụng mã:app.use(express.json());
app.use(express.json());
//express.urlencoded()là một phương thức được xây dựng sẵn để nhận ra Đối tượng Yêu cầu đến dưới dạng chuỗi hoặc mảng . Phương thức này được gọi là phần mềm trung gian trong ứng dụng của bạn bằng cách sử dụng mã:app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
//api khi thanh toán bằng paypal
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
//api upload image
app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
//gộp các api vào 1 component productRouter
app.use("/api/products", productRouter);
//api user/login
app.use("/api/users", userRouter);
//api thanh toán đặt hàng
app.use("/api/orders", orderRouter);
//xử lý lỗi trong nodejs server
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
