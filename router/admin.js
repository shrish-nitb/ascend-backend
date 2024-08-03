const express = require("express");
const router = express.Router();
const { reattempt } = require("../utils/database");

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware")

router.patch("reattempt/:uid/:mockid", async(req, res) => {
    try{
      
    } catch (error){
  
    }
});