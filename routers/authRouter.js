const { authController } = require("../controllers");
const authRouter = require("express").Router();

authRouter.post("/", authController.login);

module.exports = authRouter;
