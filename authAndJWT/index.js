const bodyParser = require("body-parser")
const express = require("express")
const jwt = require("jsonwebtoken")
const jwtPassword = "123456"

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

const users = [
    {
        username: "fkjdsaf",
        password: "daad"
    },
    {
        username: "fkjddfassaf",
        password: "ddsaaad"
    },
    {
        username: "utsav",
        password: "utsav"
    },

]

function userExists(username, password) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            return true
        }
    }
    return false;
}

app.post("/signin", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    console.log(req.body)

    if (!userExists(username, password)) {
        return res.status(403).json({
            msg: "User does not exist or wrong credentials"
        })
    }

    var token = jwt.sign({ username: username }, "shhhhh")

    return res.json({
        token
    })

})

app.get("/users", (req, res) => {
    const token = req.headers.authorization
    console.log(token)
    const decoded = jwt.verify(token, jwtPassword)
    console.log(decoded)
    try {
        const decoded = jwt.verify(token, jwtPassword)
        const username = decoded.username
    } catch (err) {
        return res.status(403).json({
            msg: "invalid token"
        })
    }

    res.json({
        users: users
    })

})



app.listen(3000)