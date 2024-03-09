const express = require("express");
const router = express.Router();
const { verifyToken } = require("../helper/firebase");
const { getUser } = require("../helper/database");
const User = require("../model/user");

router.use("/", async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  decodedToken = await verifyToken(accessToken);
  req.decodedToken = decodedToken;
  next();
});

router.get("/", async (req, res) => {
  try {
    const user = await getUser(req.decodedToken.uid);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    user = await signup(req.decodedToken);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

async function signup(decodedToken) {
  try {
    const user = await getUser(decodedToken.uid);
    if (user.length == 0) {
      const newUser = await User.create({
        uid: decodedToken.uid,
        name: decodedToken.name,
        email: decodedToken.email,
      });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = router;
