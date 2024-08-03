const express = require("express");
const router = express.Router();
const { getUser, addPhone, signup } = require("../utils/database");

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware")


router.get("/", firebaseTokenVerifier, userAuthLookup, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/", firebaseTokenVerifier, async (req, res) => {
  try {
    let user = await getUser(req.decodedToken.uid);
    if (!user) {
      user = await signup(req.decodedToken);
    } else {
      if(user.phone == 0){
        user = await addPhone(req.decodedToken, req.body.phone)
      } else if(user.phone != req.body.phone) {
        throw new Error("Phone Number does not exists")
      }
    }
    res.status(200).json(user);
  } catch (error) {  
    console.error(error);   
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
