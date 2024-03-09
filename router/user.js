const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/firebase");
const { getUser } = require("../utils/database");
const User = require("../model/user");

router.use("/", async (req, res, next) => {
  let token = req.header("Authorization");
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }
  decodedToken = await verifyToken(token);
  req.decodedToken = decodedToken;
  next();
});

router.get("/", async (req, res) => {
  try {
    const user = await getUser(req.decodedToken.uid);
    res.status(200).json(user[0]);
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
      return newUser;
    } else {
      return user[0];
    }
  } catch (error) {
    throw error;
  }
}

module.exports = router;
