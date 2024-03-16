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

// POST create a new plan
// router.post('/', async (req, res) => {
//     try {
//       const { name, description, price, validity, test, practice, media } = req.body;
  
//       const newPlan = new Plan({
//         name,
//         description,
//         price,
//         validity,
//         test,
//         practice,
//         media,
//       });
  
//       const savedPlan = await newPlan.save();
      
//       res.status(201).json(savedPlan);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

module.exports = router;