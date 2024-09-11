const express = require("express");
const jwt = require("jsonwebtoken")
const app = express();
const JWT_SECRET = "keepThisSecretSafe"
const users = [];

app.use(express.json());



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


app.get("/me", (req, res) => {
    const token = req.headers.token;
    //  jwt.verify -> to decode token
    const decodedInformation = jwt.verify(token, JWT_SECRET);
    const username = decodedInformation.username;

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
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