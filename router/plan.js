const express = require('express');
const router = express.Router();
const Plan = require('../model/plan'); 

//GET : retrieve all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({}, "-__v").populate([
      {
        path: "test",
        select: "-sections.questions -sections._id -__v"
      },
      {
        path: "algo",
        select: "-__v",
        populate: {
          path: "topics",
          select: "-__v"
        }
      }
    ])
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;