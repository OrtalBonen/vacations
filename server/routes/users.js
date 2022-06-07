const SQL = require('../dbconfig')
const onlyLoggedUsers = require('../onlyLoggedUsers')

const router = require('express').Router()

//register
router.post('/register', async (req, res) => {

    const { email, password, firstName, lastName } = req.body
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).send({ err: "Missing / wrong info" })
    }
    try {
        const user = await SQL(`SELECT email FROM users WHERE email='${email}'`)
        if (user.length) {
            return res.status(400).send({ err: "User already exist" })
        }
        await SQL(`INSERT INTO users(email, firstName, lastName, password)
                   VALUES("${email}", "${firstName}","${lastName}","${password}")`)
        res.status(201).send({ msg: `You have successfully registered, welcome ${firstName} ${lastName}` })

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await SQL(`SELECT * FROM users WHERE email='${email}'
                              AND password='${password}'`)
        if (!result.length) {
            return res.status(400).send({ err: "Wrong username and / or password" })
        }
        const user = result[0]
        req.session.userId = user.id

        if (user.isAdmin) {
            req.session.isAdmin = true
            //different maxAge to admin (24 hours)
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24
        }
        delete user.password
        user.loggedIn = true
        return res.send(user)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//logout
router.delete('/logout', onlyLoggedUsers, async (req, res) => {
    req.session.destroy()
    res.send({ msg: "Bye bye! it was nice to see you" })
})

//check if user login
router.get('/isLoggedIn', async (req, res) => {
    const user = {}
    let userId
    if (req.session) {
        userId = req.session.userId
    }
    if (!userId) {
        user.loggedIn = false
        return res.send(user)
    }

    try {
        const result = await SQL(`SELECT * FROM users WHERE id='${userId}'`)
        const user = result[0]
        user.loggedIn = true
        delete user.password
        return res.send(user)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router