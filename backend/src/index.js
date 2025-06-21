import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "../.env"
})

connectDB()
.then(() => {
    app.on("error", (e) => {
        console.log("Mongoose Connection failed", e);
    })
    app.listen(process.env.PORT, () => {
        console.log("Mongoose Connected : ", process.env.PORT);
    });
})
.catch((e) => {
    console.log("Connection Error : ", e);
})




