const express = require("express");
const router = express.Router();

const { firebaseTokenVerifier, userAuthLookup, authorizationProvider } = require("../utils/middleware");
const { Category, Resource } = require("../model/course");
const Plan = require("../model/plan");


// router.get("/:courseid", firebaseTokenVerifier, userAuthLookup, async (req, res) => {
//     try {
//         const { courseid } = req.params;
//         const courseData = await Category.findById(courseid);

//         if (!courseData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             course: courseData,
//             message: "Course data fetched",
//         });
//     } catch (error) {
//         console.error("Error fetching course by ID", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// GET : Retrieve all courses
router.get("/", async (req, res) => {
    try {
      const courseData = await Category.find()
        .populate({
          path: 'sections',
          populate: {
            path: 'topics',
            populate: {
              path: 'resource',
            },
          },
        });
  
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

router.get("/:planid",firebaseTokenVerifier, userAuthLookup,authorizationProvider('COURSE'), async (req, res) => {
    try {
        const {planid} = req.params
        const planData = await Plan.find({_id:planid}).populate(
            {
              path: "course", // Populate the `course` field which references `Category`
              select: "-__v",
              populate: {
                path: "sections", // Populating nested fields if necessary
                select: "-__v",
                populate: {
                  path: "topics",
                  select: "-__v",
                  populate: {
                    path: "resource",
                    select: "-__v"
                  }
                }
              }
            },); 

            if (!planData || planData.length === 0) {
                return res.status(404).json({
                  success: false,
                  message: "No course data found for the given Plan ID",
                });
              }
        // if(!resourceData)
        // {
        //     res.status(404).json({
        //         success: false,
        //         message: "Resource not found",
        //     });
        // }
        res.status(200).json({
            success: true,
            course: planData,
            message: "All course data fetched",
        });
    } catch (error) {
        console.error("Error fetching all courses", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})







module.exports = router;
