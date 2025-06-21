import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({limit:"16Kb"}))
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.static("public"))
app.use(express.urlencoded({limit:"16Kb", extended:true}))
app.use(cookieParser())

app.get('/', (req, res) =>{
    res.send('Hello')
})

import router from './routes/user.route.js'

app.use('/api/v1/users', router)


export default app;

