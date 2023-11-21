const db = require("../config/db.js");
const { getDistance } = require("geolib");
const moment = require("moment");

async function clockIn(req, res) {
  try {
    console.log("req query", req.query);

    const ltUms = -6.27499;
    const lgUms = 106.829999;
    const maxDistance = 200;

    const userId = parseInt(req.query.userId);
    const lg = parseFloat(req.query.longtitude);
    const lt = parseFloat(req.query.latitude);
    const iPAdress = req.query.iPAdress;

    console.log("lg nih", lg);
    console.log("lgt nih", lt);

    const today = moment().format("YYYY-MM-DD");

    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log(currentTime);

    const [existAttedance] = await db.promise().query(
      `SELECT * FROM m_employe_attedance 
       WHERE m_user_id = ${userId} AND DATE(createdAt) = '${today}'`
    );

    console.log("exist attedance", existAttedance);

    if (existAttedance.length)
      return res
        .status(400)
        .send({ message: "You've already clocked in today" });

    if (!lg || !lt)
      return res.status(400).send({ message: "Your location was not found" });

    const distance = getDistance(
      { latitude: lt, longitude: lg },
      { latitude: ltUms, longitude: lgUms }
    );

    console.log("Distance:", distance, "meters");

    if (distance > maxDistance)
      return res
        .status(400)
        .send({ message: "Your distance must not be 200 meters" });

    await db
      .promise()
      .query(
        `INSERT INTO m_employe_attedance(m_user_id, time_in, createdAt, lat, lng, ip_adress) VALUES(?, ?, ?, ?, ?, ?)`,
        [userId, currentTime, currentTime, lt, lg, iPAdress]
      );

    return res.status(200).send({
      message: "Attedance in Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

async function clockOut(req, res) {
  try {
    console.log("req query", req.query);

    const ltUms = -6.27499;
    const lgUms = 106.829999;
    const maxDistance = 200;

    const userId = parseInt(req.query.userId);
    const lg = parseFloat(req.query.longtitude);
    const lt = parseFloat(req.query.latitude);
    const iPAdress = req.query.iPAdress;

    console.log("lg nih", lg);
    console.log("lgt nih", lt);

    const today = moment().format("YYYY-MM-DD");

    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log(currentTime);

    const [existAttedance] = await db.promise().query(
      `SELECT * FROM m_employe_attedance 
       WHERE m_user_id = ${userId} AND DATE(createdAt) = '${today}'`
    );

    console.log("exist attedance", existAttedance);

    if (!existAttedance.length)
      return res
        .status(400)
        .send({ message: "You haven't recorded your attendance today" });

    if (!lg || !lt)
      return res.status(400).send({ message: "Your location was not found" });

    const distance = getDistance(
      { latitude: lt, longitude: lg },
      { latitude: ltUms, longitude: lgUms }
    );

    console.log("Distance:", distance, "meters");

    if (distance > maxDistance)
      return res
        .status(400)
        .send({ message: "Your distance must not be 200 meters" });

    await db.promise().query(
      `UPDATE m_employe_attedance
            SET 
              time_out = ?,
              updatedAt = ?,
              lat_out = ?,
              lng_out = ?,
              ip_adress_out = ?
            WHERE m_user_id = ? AND DATE(createdAt) = ?`,
      [currentTime, currentTime, lt, lg, iPAdress, userId, today]
    );

    return res.status(200).send({
      message: "Attedance out Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

module.exports = { clockIn, clockOut };
