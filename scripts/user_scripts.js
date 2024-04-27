const mongoose = require("mongoose");

const User = require("../model/user");

async function grantAccess(email) {
    try {
        const startDate = new Date();

        //validity is in days
        const expiryDate =
            startDate.getTime() + 90 * 24 * 60 * 60 * 1000; //90 days

        const newPlan = {
            plan: new mongoose.Types.ObjectId("65f5d06d896356522d087e8b"),
            order: new mongoose.Types.ObjectId("6602ea5056c98052d615f130"),
            startDate: startDate.getTime(),
            expiryDate: expiryDate,
        };
        await User.updateOne(
            {
                email: email,
            },
            {
                $push: { plans: newPlan },
            }
        );
        console.log(`Access Granted to ${email}`)
    } catch (error) {
        console.log(`Fail for ${email} `, error.message)
    }
}

module.exports = { grantAccess }