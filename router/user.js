const express = require("express");
const router = express.Router();
const { getAuth, firebaseApp } = require("../helper/firebase");
const { getUser } = require("../helper/database");

router.get("/user", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  try {
    user = await isSignedIn(accessToken);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/user", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  try {
    user = await signup(accessToken);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

async function signup(accessToken) {
  try {
    const decodedToken = await verifyToken(accessToken);
    const user = getUser(decodedToken.uid);
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
