const express = require('express');
const router = express.Router();
const Plan = require('../model/plan'); 


//GET retrieve all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST create a new plan
router.post('/', async (req, res) => {
    try {
      // Extract plan details from the request body
      const { name, description, price, validity, test, questions, media } = req.body;
  
      // Create a new plan instance
      const newPlan = new Plan({
        name,
        description,
        price,
        validity,
        test,
        questions,
        media,
      });
  
      // Save the new plan to the database
      const savedPlan = await newPlan.save();
  
      // Send the saved plan as the response
      res.status(201).json(savedPlan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;