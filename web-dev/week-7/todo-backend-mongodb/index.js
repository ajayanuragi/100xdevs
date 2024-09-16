const express = require("express");
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require("./db");
const { jwt, auth, JWT_SECRET } = require("./auth");
const app = express();


mongoose.connect("change this ");
app.use(express.json());

app.post("/signup", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password: password,
        name: name
    });

    res.json({
        message: "You are signed up"
    })
});
app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await UserModel.findOne({
        email: email,
        password: password
    })

    if (user) {
        const token = jwt.sign({
            id: user._id
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
app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    });
});

app.get("/", function (req, res) {
    res.send("hello there")
})


app.listen(3000);
