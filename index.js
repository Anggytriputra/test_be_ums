const express = require("express");
// const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./config/db.js");
const authRouter = require("./routers/authRouter.js");
const userRouter = require("./routers/userRouter.js");

const app = express();
// app.use(cors());
app.use(express.json());

// db.connect((err) => {
//   if (err) return console.log(err);
//   console.log(`succes connect to mysql`);
// });

// const { userRouter } = require("./routers");
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
