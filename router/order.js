require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const axios = require("axios");
var hash = require("hash.js");

const { firebaseTokenVerifier, userAuthLookup } = require("../utils/middleware")

const Plan = require("../model/plan");
const Order = require("../model/order");
const User = require("../model/user");


router.get("/:plan", firebaseTokenVerifier, userAuthLookup, async (req, res) => {
  try {
    const planId = req.params.plan;
    const userId = req.decodedToken.uid;
    const planObj = await Plan.find({ _id: planId }).exec();
    if (planObj.length != 1) {
      return;
    }
    const orderObj = await Order.create({
      plan: planId,
      user: userId,
    });

    const requestData = btoa(
      JSON.stringify({
        merchantId: process.env.MERCHANT_ID,
        merchantTransactionId: orderObj._id,
        merchantUserId: userId,
        amount: planObj[0].price,
        redirectUrl: "https://learn.projectascend.in/dashboard/my-profile",
        redirectMode: "REDIRECT",
        callbackUrl: "https://project-ascend-backend.vercel.app/orders/callback",
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      })
    );

    let data = JSON.stringify({
      request: requestData,
    });

    let CHECKSUM =
      hash
        .sha256()
        .update(requestData + "/pg/v1/pay" + process.env.PAY_SALT)
        .digest("hex") +
      "###" +
      process.env.PAY_SALT_KEY;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      headers: {
        "X-VERIFY": CHECKSUM,
        "Content-Type": "application/json",
      },
      data: data,
    };

    let response = await axios.request(config)

    // res.status(200).json(response.data);
    // console.log(response);
    res.redirect(301, response?.data?.data?.instrumentResponse?.redirectInfo?.url)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  };
});

router.post("/callback", async (req, res) => {
  try {
    let CHECKSUM =
      hash
        .sha256()
        .update(req.body.response + process.env.PAY_SALT)
        .digest("hex") +
      "###" +
      process.env.PAY_SALT_KEY;
    if (CHECKSUM != req.get("X-VERIFY")) {
      return;
    }
    const transaction = JSON.parse(atob(req.body.response));
    const order = (
      await Order.find({ _id: transaction.data.merchantTransactionId }).populate(
        "plan"
      )
    )[0];

    if (
      transaction.code == "PAYMENT_SUCCESS" &&
      transaction.data.amount == order.plan.price
    ) {
      const res = await Order.updateOne(
        { _id: transaction.data.merchantTransactionId },
        { status: "Completed", paymentCallbackData: transaction }
      );

      const startDate = new Date();

      //validity is in days
      const expiryDate =
        startDate.getTime() + order.plan.validity * 24 * 60 * 60 * 1000;

      if (res.acknowledged) {
        const newPlan = {
          plan: new mongoose.Types.ObjectId(order.plan._id),
          order: new mongoose.Types.ObjectId(order._id),
          startDate: startDate.getTime(),
          expiryDate: expiryDate,
        };
        await User.updateOne(
          {
            uid: order.user,
          },
          {
            $push: { plans: newPlan },
          }
        );
      }
    } else if (transaction.code == "PAYMENT_ERROR") {
      const res = await Order.updateOne(
        { _id: transaction.data.merchantTransactionId },
        { status: "Cancelled", paymentCallbackData: transaction }
      );
    }

    res.status(200);
    return;
  } catch (error) {

  }
});

module.exports = router;