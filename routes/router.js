import { Router } from "express"
import { body, validationResult, matchedData } from "express-validator"
import { User } from "../schemas/user.js"
import bcrypt from "bcryptjs";
import "../config/local-strategy.js"
import passport from "passport"
import { Message } from "../schemas/message.js"
import { fetchMessages } from "../controllers/fetchMessages.js"

export const router = new Router()

router.get('/', fetchMessages, (req, res) => {
    const member = req.user?.member || false
    res.render('index', {
        title: "Homepage",
        member: member
    })
})

router.get('/login', (req, res) => {
    const err = req.query.error
    res.render('login', {
        title: "Login Page",
        err: err
    })
})

router.post('/login',
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
)

// Passport 0.5 dùng callback-based, từ 0.6 dùng promise-based
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) return next(err);
            res.redirect("/");
        });
    });
});

router.get('/signup', (req, res) => {
    res.render('signup', {
        title: "Sign-up"
    })
})

router.post('/signup',
    [
        body('fullname')
            .notEmpty().withMessage('Must not be empty')
            .isAlpha('en-US', { ignore: ' ' })
            .withMessage("Name must only contain alphabet letters."),
        body('email')
            .notEmpty().withMessage('Must not be empty')
            .isEmail().withMessage('Must be a valid email'),
        body('password')
            .notEmpty().withMessage('Must not be empty')
            .isLength({ min: 6 }).withMessage('Password must have more than 6 characters'),
        body('confirmPassword')
            .notEmpty().withMessage('Must not be empty')
            .custom((value, { req }) => {
                return value === req.body.password;
            }).withMessage("Does not match password"),
    ],
    async (req, res) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() })
        }
        const { fullname, email, password } = matchedData(req)
        //DO something
        const isAdmin = req.body.admin ? true : false
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ fullname, email, password: hashedPassword, admin: isAdmin, member: false })
        try {
            const savedUser = await newUser.save()
            return res.status(201).redirect('/')
        } catch (error) {
            console.log(error);
            return res.sendStatus(400)
        }
    })

router.get('/join-club', (req, res) => {
    if (!req.user) {
        return res.redirect("/login?error=You must login first")
    }
    res.render("join", {
        title: "Join Club"
    })
})

router.post('/join-club', async (req, res) => {
    const secretMessage = "Best Club"
    if (!req.user) {
        return res.status(401).send("You must be logged in to join the club.");
    }
    const { passcode } = req.body
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).send("User not found")
        }
        if (passcode === secretMessage) {
            req.user.member = true
            await req.user.save()
            return res.redirect('/')
        } else {
            return res.send("Incorrect passcode. Try again.")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error.")

    }
})

router.get('/create-message', (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    res.render("new-message", {
        title: "Create a message"
    })
})

router.post('/create-message', async (req, res) => {
    const { title, message } = req.body
    const newMessage = new Message({ title, message, author: req.user._id })
    try {
        const savedUser = await newMessage.save()
        return res.redirect("/")
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
})

router.post('/messages/:id/delete', async (req, res) => {
    try {
        if (!req.user.admin) {
            return res.status(403).send("Forbidden: You don't have permission to delete messages.");
        }
        await Message.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error")
    }
})