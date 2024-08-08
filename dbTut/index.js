const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";
const bodyParser = require("body-parser")

mongoose.connect(
    "mongodb+srv://utsav:utsav%402001@cluster0.gpcslsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
);

const UserProfileSchema = mongoose.model("UserTest", {
    name: String,
    username: String,
    password: String,
});

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

async function userExists(username, password) {
    try {
        const data = await UserProfileSchema.findOne({ username: username });
        if (data) return true;
        else return false
    } catch (err) {
        console.error(err);
        return false; // Handle errors appropriately
    }
}

app.post('/signup', function (req, res) {
    console.log(req.body)
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    const userDetails = new UserProfileSchema({
        name: name,
        username: username,
        password: password
    });

    userDetails.save().then(doc => {
        res.send(doc)
    })
        .catch(err => console.log(err))
})

app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!userExists(username, password)) {
        console.log('from sigup' + userExists(username, password))
        return res.status(403).json({
            msg: "User doesnt exist in our in memory db",
        });
    }

    var token = jwt.sign({ username: username }, jwtPassword);
    return res.json({
        token,
    });
});

app.get("/users", async function (req, res) {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, jwtPassword);
        const username = decoded.username;

        const users = await UserProfileSchema.find({ username: { $ne: username } });

        return res.status(200).json(users);
    } catch (err) {
        return res.status(403).json({
            msg: "Invalid token",
        });
    }
});

app.listen(3000, () => {
    console.log("server is started")
});