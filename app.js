import express, { Router } from 'express'
import { router } from './routes/router.js'
import { connectDB } from './config/db.js'
import passport from 'passport'
import session from 'express-session'
import { fileURLToPath } from "url"
import path from "path"


const app = express()
const PORT = process.env.PORT || 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: true }))

await connectDB()

app.use(session({
    secret: "Phuong the dev",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use((req, res, next) => {
    res.locals.user = req.user || null; // Nếu có user, truyền vào EJS
    next();
});

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Listen on http://localhost:${PORT}`);
})