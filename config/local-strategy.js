import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../schemas/user.js";

const localStrategy = new Strategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const findUser = await User.findOne({ email })
            if (!findUser) {
                // throw new Error('User not found')
                return done(null, false, { message: "User not found" })
            }
            const match = await bcrypt.compare(password, findUser.password)
            if (!match) {
                // throw new Error('Invalid Credential')
                return done(null, false, { message: "Invalid credentials" })
            }
            return done(null, findUser)
        } catch (error) {
            return done(error)
        }
    })
passport.use(localStrategy)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id)
        if (!findUser) throw new Error("User notfound")
        done(null, findUser)
    } catch (error) {
        done(error)
    }
})

export default passport