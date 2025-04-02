import { Router } from "express"
import { body, validationResult, matchedData } from "express-validator"
import { User } from "../schemas/user.js"

export const router = new Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: "Homepage"
    })
})

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
        const newUser = new User({ fullname, email, password, admin: isAdmin })
        try {
            const savedUser = await newUser.save()
            return res.status(201).send(savedUser)
        } catch (error) {
            console.log(error);
            return res.sendStatus(400)
        }
    })