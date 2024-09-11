const express = require("express");
const app = express();
const users = [];



function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}
function findUser(username, password) {
    let user = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            return user = users[i];
        }
        else {
            return user;
        }
    }
}


app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello there")
})

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
    let foundUser = findUser(username, password);
    if (foundUser) {
        const token = generateToken();
        foundUser.token = token;
        res.json({
            message: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users);
});




app.listen(3000);