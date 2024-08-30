const express = require("express");
const router = express.Router();

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware");
const { Category, Resource } = require("../model/course");


router.get("/:courseid", firebaseTokenVerifier, userAuthLookup, async (req, res) => {
    try {
        const { courseid } = req.params;
        const courseData = await Category.findById(courseid);

        if (!courseData) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            course: courseData,
            message: "Course data fetched",
        });
    } catch (error) {
        console.error("Error fetching course by ID", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET : Retrieve all courses
router.get("/", async (req, res) => {
    try {
        const courseData = await Category.find(); // Find all courses, no ID passed here

        res.status(200).json({
            success: true,
            course: courseData,
            message: "All course data fetched",
        });
    } catch (error) {
        console.error("Error fetching all courses", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/resource/:resourceId", async (req, res) => {
    try {
        const {resourceId} = req.params
        const resourceData = await Resource.find({_id:resourceId}); 
        if(!resourceData)
        {
            res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }
        res.status(200).json({
            success: true,
            resource: resourceData,
            message: "All course data fetched",
        });
    } catch (error) {
        console.error("Error fetching all courses", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})





module.exports = router;
