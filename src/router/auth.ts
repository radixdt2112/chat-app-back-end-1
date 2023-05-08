import express, { Request, Response, Router } from 'express'
import passport from 'passport'
import { createUser } from '../services/userServices'

const GoogleStrategy = require('passport-google-oidc')

const router: Router = express.Router()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env['GOOGLE_CLIENT_ID'],
            clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
            callbackURL: process.env.SERVER_URL
                ? 'https://chat-application-back-end.vercel.app/api/auth/oauth2/redirect'
                : '/api/auth/oauth2/redirect',
            scope: ['profile', 'email']
        },
        async function verify(issuer: any, profile: any, cb: any) {
            console.log('Profile Name : ', profile.displayName)
            console.log('Email :', profile.emails[0].value)

            const result = await createUser(
                profile.displayName,
                profile.emails[0].value
            )

            return cb(null, result)
        }
    )
)

passport.serializeUser(function (user: any, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name })
    })
})

passport.deserializeUser(function (user: any, cb) {
    process.nextTick(function () {
        return cb(null, user)
    })
})

router.get('/login/google', passport.authenticate('google'))

router.get(
    '/oauth2/redirect',
    passport.authenticate('google'),
    (req: Request, res: Response) => {
        const url = new URL(
            process.env.CLIENT_URL
                ? process.env.CLIENT_URL + 'loader'
                : 'http:localhost:3000/loader'
        )

        if (req.user) {
            for (const [key, value] of Object.entries(req.user)) {
                url.searchParams.append(key, value)
            }
        } else {
        }
        res.redirect(url.href)
    }
)

export default router
