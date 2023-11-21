const { userController } = require("../controllers");
const userRouter = require("express").Router();

userRouter.post("/checkin", userController.clockIn);
userRouter.post("/checkout", userController.clockOut);

module.exports = userRouter;
