import { Router } from "express"
import { body, validationResult, matchedData } from "express-validator"

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
            .isAlpha()
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
    (req, res) => {
        const result = validationResult(req)
        if (!result.isEmpty) {
            return res.status(400).send({ errors: result.array() })
        }
        const data = matchedData(req)
        //DO something
    })