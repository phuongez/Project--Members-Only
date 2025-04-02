import express, { Router } from 'express'
import { router } from './routes/router.js'
import { connectDB } from './config/db.js'


const app = express()
const PORT = process.env.PORT || 8080


app.use(express.urlencoded({ extended: true }))

await connectDB()

app.set('view engine', 'ejs')

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Listen on http://localhost:${PORT}`);
})