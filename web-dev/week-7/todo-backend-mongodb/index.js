const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserModel, TodoModel } = require("./db");
const { jwt, auth, JWT_SECRET } = require("./auth");
const {z} = require("zod");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URI)
app.use(express.json());

app.post("/signup", async function (req, res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30),
        name: z.string().min(3).max(100),
    })

    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            message : "Incorrect format",
            error : parsedData.error
        })
        return;
    }
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    try {
        const hashpassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            email: email,
            password: hashpassword,
            name: name
        });
    } catch (e) {
        res.status(400).send({
            message: "User already exist with this email"
        })
        return;

    }

    res.json({
        message: "You are signed up"
    })
});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    });
    if (!response) {
        res.status(403).json({
            message: "User does not exist in our db"
        });
        return;

    }
    const passwordMatch = await bcrypt.compare(password, response.password)

    if (passwordMatch) {
        const token = jwt.sign({
            id: response._id
        }, JWT_SECRET)
        res.json({
            message: token
        })

    } else {
        res.status(403).json({
            message: "Incorrect correndetials"
        })
    }
})
app.post("/todo", auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId: userId
    });

    res.json({
        todos
    });
});

app.get("/", function (req, res) {
    res.send("hello there")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
