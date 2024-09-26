const { Router } = require('express');
const { userModel, courseModel } = require('../db')
const { z } = require('zod');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config');
const { userMiddleware } = require('../middleware/user');
const { purchaseModel } = require('../db')
const userRouter = Router();


userRouter.post("/signin", async function (req, res) {
    const signInSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
    });
    try {
        const { email, password } = signInSchema.parse(req.body);

        const user = await userModel.findOne({
            email
        })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !(isMatch)) {
            return res.status(401).json({
                message: "Wrong Creds"
            })
        } else {

            const token = jwt.sign({
                id: user._id
            }, JWT_USER_SECRET)

            return res.json({
                message: token
            })
        }

    } catch (e) {
        console.error(e.message);
        return res.status(401).json({
            message: "Wrong Creds"
        })
    }


});

userRouter.post("/signup", async function (req, res) {

    const signupSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
        firstName: z.string().min(1),
        lastName: z.string(),
    });
    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        const hashPassword = await bcrypt.hash(password, 5);

        await userModel.create({
            email,
            password: hashPassword,
            firstName,
            lastName
        });

        return res.json({
            message: "success"
        })

    } catch (e) {
        console.error(e.message);
        return res.status(400).json({
            message: "Signup Failed"
        });
    }

});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId,
    })

    let purchasedCourseIds = [];

    for (let i = 0; i < purchases.length; i++) {
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    return res.json({
        purchases,
        coursesData
    })

});

module.exports = {
    userRouter: userRouter
}