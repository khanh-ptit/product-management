const mongoose = require("mongoose")

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Succesfully connected")
    } catch (error) {
        console.log("Connect error")
    }
}