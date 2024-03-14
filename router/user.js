const express = require("express");
const router = express.Router();
const User = require("../model/user");
const { getUser } = require("../utils/database");

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware")


router.get("/", firebaseTokenVerifier, userAuthLookup, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/", firebaseTokenVerifier, async (req, res) => {
  try {
    let user = await getUser(req.decodedToken.uid);
    if (!user) {
      user = await signup(req.decodedToken);
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

async function signup(decodedToken) {
  try {
    const newUser = await User.create({
      uid: decodedToken.uid,
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}

module.exports = router;
