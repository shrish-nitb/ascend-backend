const express = require("express");
const router = express.Router();
const { getAuth, firebaseApp } = require("../helper/firebase");
const { getUser } = require("../helper/database");

router.use("/user", async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  decodedToken = await verifyToken(accessToken);
  req.decodedToken = decodedToken;
  next();
});

router.get("/user", async (req, res) => {
  try {
    const user = await getUser(req.decodedToken.uid);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/user", async (req, res) => {
  try {
    user = await signup(req.decodedToken.uid);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

async function signup(uid) {
  try {
    const user = getUser(uid);
    if (!user) {
      const newUser = await User.create({
        uid: decodedToken.uid,
        name: decodedToken.name,
        email: decodedToken.email,
        receipt: {},
      });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = router;
