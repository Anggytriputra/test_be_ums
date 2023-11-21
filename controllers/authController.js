const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    console.log("req body", req.body);
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).send({ message: "Please Complete Your Data" });

    const [userExist] = await db
      .promise()
      .query(`SELECT * FROM m_users WHERE username= '${username}'`);

    if (userExist.length === 0)
      return res.status(400).send({ message: "User not found" });

    console.log("userexist", userExist);

    const isValid = await bcrypt.compare(password, userExist[0].password);

    if (!isValid) return res.status(400).send({ message: "Wrong password" });

    let payload = { id: userExist[0].id };
    const token = jwt.sign(payload, "auth", { expiresIn: "24h" });

    return res.status(200).send({ message: "Login Success", token });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

module.exports = { login };
