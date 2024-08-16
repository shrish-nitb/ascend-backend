const express = require("express");
const { replaceOne } = require("../model/report");
const router = express.Router();
const { usersAll, reportsAll, changeRole, reattempt, viewTest } = require("../utils/database");

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware")

router.patch("reattempt/:uid/:mockid", async (req, res) => {
    try {

    } catch (error) {

    }
});

router.get("/users", async (req, res) => {
    try {
        const userList = await usersAll();
        res.status(200).json({ users: userList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/user/:uid", async (req, res) => {
    try {
        const reportList = await reportsAll(req.params.uid);
        res.status(200).json({ user: reportList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.patch("/user/:uid", async (req, res) => {
    try {
        const { role } = req.body;
        const uid = req.params.uid;
        const newData = await changeRole(uid, role);
        if (newData) {
            res.status(200).json({ message: `${newData.name} is now ${newData.role}` })
        } else {
            throw new Error("Some unknown error occured")
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete("/user/:uid/test/:testId", async (req, res) => {
    try {
        const {uid, testId} = req.params;
        const isDeleted = await reattempt(testId, uid);
        if (isDeleted) {
            res.status(200).json({ message: "Test access granted" })
        } else {
            throw new Error("Some unknown error occured")
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/test/:testId", async (req, res) => {
    try {
        const test = await viewTest(req.params.testId);
        res.status(200).json({ test: test });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;