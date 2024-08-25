const express = require("express");
const router = express.Router();
const { userAll, reportAll, changeRole, reattempt, viewTest, createTest, removeTest, updateQuestion, createPlan, removePlan, updatePlan, createAlgo, removeAlgo, createTopic, removeTopic, updateTopic, updateAlgo, algoAll, testAll, viewQue } = require("../utils/database");

router.get("/users", async (req, res) => {
    try {
        const userList = await userAll();
        res.status(200).json({ users: userList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/user/:uid", async (req, res) => {
    try {
        const reportList = await reportAll(req.params.uid);
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

router.post("/mock", async (req, res) => {
    try {
        const {planId, testObj} = req.body;
        const testId = await createTest(planId, testObj)
        if(testId){
            res.status(200).json({ testId: testId, message: "Test created Successfully"});
        } else {
            res.status(500).json({ message: "Some unknown error occured" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete("/test/:testId", async (req, res) => {
    try {
        const {testId} = req.params;
        const isDeleted = await removeTest(testId)
        if(isDeleted){
            res.status(200).json({message: "Test deleted Successfully"});
        } else {
            res.status(500).json({ message: "Some unknown error occured" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/plan", async (req, res) => {
    try {
        const planData = req.body.plan;
        const plan = await createPlan(planData);
        if(plan){
            res.status(200).json({message: "Plan made successfully"});
        } else {
            throw new Error("Some unknown error occured"); 
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete("/plan/:planId", async (req, res) => {
    try {
        const {planId} = req.params;
        const isRemoved = await removePlan(planId);
        if(isRemoved){
            res.status(200).json({message: "Plan removed successfully"});
        } else {
            throw new Error("Some unknown error occured"); 
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.put("/plan/:planId", async (req, res) => {
    try {
        const {planId} = req.params;
        const planData = req.body.plan;
        const plan = await updatePlan(planId, planData);
        if(plan){
            res.status(200).json({message: "Plan updated successfully"});
        } else {
            throw new Error("Some unknown error occured"); 
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.put("/question/:questionId", async (req, res) => {
    try {
        const questionId = req.params.questionId
        const questionObj = req.body.question
        const isUpdated = await updateQuestion(questionId, questionObj)
        if(isUpdated){
            res.status(200).json({message: "Question/Answer updated successfully"});
        } else {
            throw new Error("Some unknown error occured");     
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/algo", async (req, res) => {
    try {
       const {algo} = req.body;
       const isCreated = await createAlgo(algo)
       if(isCreated){
          res.status(200).json({message: "Algo creation successful"});
       } else {
          throw new Error("Some unknown error occured");     
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete("/algo/:algId", async (req, res) => {
    try {
       const {algId} = req.params
       const isDeleted = await removeAlgo(algId)
       if(isDeleted){
          res.status(200).json({message: "Algo deleted successfully"});
       } else {
          throw new Error("Some unknown error occured");     
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/algo/:algId/topic", async (req, res) => {
    try {
       const {topic} = req.body;
       const {algId} = req.params;
       const isCreated = await createTopic(algId, topic)
       if(isCreated){
          res.status(200).json({message: "Topic creation successful"});
       } else {
          throw new Error("Some unknown error occured");     
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete("/algo/:algId/topic/:tpcId", async (req, res) => {
    try {
       const {algId, tpcId} = req.params
       const isDeleted = await removeTopic(algId, tpcId)
       if(isDeleted){
          res.status(200).json({message: "Topic deleted successfully"});
       } else {
          throw new Error("Some unknown error occured");     
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.put("/topic/:tpcId", async (req, res) => {
    try {
       const {tpcId} = req.params
       const {topic} = req.body
       const isUpdated = await updateTopic(tpcId, topic)
       if(isUpdated){
          res.status(200).json({message: "Topic updated successfully"});
       } else {
          throw new Error("Some unknown error occured");     
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.put("/algo/:algId", async (req, res) => {
    try {
       const {algId} = req.params
       const {algo} = req.body
       const isUpdated = await updateAlgo(algId, algo)
       if(isUpdated){
          res.status(200).json({message: "Algo updated successfully"});
       } else {
          throw new Error("Some unknown error occured");     
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/algos", async (req, res) => {
    try {
        const list  = await algoAll()
        res.status(200).json({algos: list});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/tests", async (req, res) => {
    try {
        const list  = await testAll()
        res.status(200).json({tests: list});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get("/question/:queId", async (req, res) => {
    try {
        const {queId} = req.params
        const que  = await viewQue(queId)
        res.status(200).json({question: que})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;