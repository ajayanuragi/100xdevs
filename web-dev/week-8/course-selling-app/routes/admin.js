const { Router } = require('express');
const adminRouter = Router();
const { adminModel, courseModel } = require('../db');
const { z } = require('zod');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../config');
const { adminMiddleware } = require('../middleware/admin');

adminRouter.post("/signup", async function (req, res) {
    const signupSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
        firstName: z.string().min(1),
        lastName: z.string(),
    });
    try {
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        const hashPassword = await bcrypt.hash(password, 5);

        await adminModel.create({
            email,
            password: hashPassword,
            firstName,
            lastName
        });

        return res.json({
            message: "Admin Created Succesfully"
        })

    } catch (e) {
        console.error(e.message);
        return res.status(401).json({
            message: "Signup Failed"
        });
    }



});

adminRouter.post("/signin", async function (req, res) {
    const signInSchema = z.object({
        email: z.string().email(),
        password: z.string().min(4),
    });
    try {
        const { email, password } = signInSchema.parse(req.body);

        const admin = await adminModel.findOne({
            email
        })
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!admin || !(isMatch)) {
            return res.status(401).json({
                message: "Wrong Creds"
            })
        } else {

            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_SECRET)

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

adminRouter.post("/courses", adminMiddleware, async function (req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId: adminId
    })
    return res.status(201).json({
        message: course._id
    })
});

adminRouter.get("/courses", adminMiddleware, async function (req, res) {
    const adminId = req.userId;
    const courses = await courseModel.find({
        creatorId: adminId
    })
    return res.json({
        courses
    })
});

adminRouter.put("/courses", adminMiddleware, async function (req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;
    try {
        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            title,
            description,
            imageUrl,
            price
        });
        console.log(course._id)

        return res.json({
            message: "Course Updated Succesfully",
            courseId: course._id
        })
    }
    catch (e) {
        console.error(e.message);
        return res.status(400).json({
            message: "Something went wrong"
        })
    }
});

module.exports = {
    adminRouter
}