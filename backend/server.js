const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const {readdirSync} = require("fs")
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// routes
readdirSync("./routes").map((r)=> app.use("/",require("./routes/" + r)))

// database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(()=>console.log("DB Connection Successfully"))
.catch((err)=>{
    console.log(err)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () =>{
    console.log("server is listening..")
})