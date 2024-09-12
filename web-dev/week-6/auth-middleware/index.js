const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();
const JWT_SECRET = "keepThisSecretSafe"
const users = [];

app.use(express.json());

function auth(req, res, next) {
    let token = null;
    let decodeData = null;
    try {
        token = req.headers.token;
        decodeData = jwt.verify(token, JWT_SECRET);
    }
    catch (err) {
        console.log(err.message);
    }
    if (decodeData) {

        req.username = decodeData.username;
        next();
    } else {
        res.status(403).json({
            message: "Please login first"
        })
    }
}

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.username;
    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    })
    console.log(users)

});
app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.username;
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }
    if (foundUser) {
        //jwt.sign -> to generate token
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);

        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users);
});


app.get("/me", auth, (req, res) => {
    const currentUser = req.username;
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === currentUser) {
            foundUser = users[i];
        }
        if (foundUser) {
            res.json({
                username: foundUser.username,
                password: foundUser.password
            });
        } else {
            res.status(400).json({
                message: "Invalid token"
            });
        }
    }
})




app.listen(3000);