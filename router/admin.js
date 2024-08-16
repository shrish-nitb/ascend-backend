const express = require("express");
const router = express.Router();
const { usersAll, reportsAll } = require("../utils/database");

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware")

router.patch("reattempt/:uid/:mockid", async(req, res) => {
    try{
      
    } catch (error){
  
    }
});

router.get("/users", async(req, res) => {
    try{
        const userList  = await usersAll();
        res.status(200).json(userList);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
})

router.get("/user/:uid", async(req, res) => {
    try{
        const reportList  = await reportsAll(req.params.uid);
        res.status(200).json(reportList);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;