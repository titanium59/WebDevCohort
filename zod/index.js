const express = require("express")
const zod = require("zod")
const app = express()

//zod schema that describes that array should be of numbers
const schema1 = zod.array(zod.number());

/*
zod schema that describes that input is an object that contains three key value pair and their respective types
const schema2 = zod.object({
    email: zod.string(),
    password: zod.string(),
    country: z.literal("IN").or(z.literal("US"))
})
*/

app.use(express.json())

app.get("/", (req, res) => {
    res.send("welcome")
})

app.post("/health-checkup", (req, res) => {
    const kidneys = req.body.kidneys

    //check or validate input using zod
    const response = schema1.safeParse(kidneys)
    if (!response.success) {
        res.status(411).json({
            msg: "input is invalid"
        })
    } else {
        res.send({
            response
        })
    }

})

app.listen(3000);