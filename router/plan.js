const express = require('express');
const router = express.Router();
const Plan = require('../model/plan'); 

//GET : retrieve all plans
router.get('/', async (req, res) => {
  try {
    //use listPlans db utils here
    const plans = await Plan.find().populate('test', '-sections.questions -sections._id');
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;