const SQL = require('../dbconfig')
const onlyUsers = require('../onlyUsers')
const onlyAdmin = require('../onlyAdmin')
const onlyLoggedUsers = require('../onlyLoggedUsers')
const router = require('express').Router()

//middleware
router.use(onlyLoggedUsers)

//only users

// get feed as user
router.get('/user', onlyUsers, async (req, res) => {
    const userId = req.session.userId
    try {
        const vacations = await SQL(`SELECT vacations.*,
                                 SUM( CASE WHEN followvacations.user_id = ${userId} THEN 1 ELSE 0 END) AS isUserFollow,
                                 SUM( CASE WHEN followvacations.vacation_id IS NOT NULL THEN 1 ELSE 0 END) AS follows
                                 FROM vacations
                                 LEFT JOIN followvacations ON followvacations.vacation_id = vacations.id
                                 GROUP BY vacations.id
                                 ORDER BY isUserFollow DESC`)
        res.send(vacations)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// follow
router.put('/follow/:vacationId', onlyUsers, async (req, res) => {
    const { userId } = req.session
    const { vacationId } = req.params
    //validate vacationid
    try {
        const vacation = await SQL(`SELECT * FROM users WHERE id = '${vacationId}'`)
        if (!vacation.length) {
            return res.status(400).send({ err: "Vacation not found" })
        }

        const result = await SQL(`SELECT * FROM followvacations
                                    WHERE vacation_id = ${vacationId}
                                    AND user_id = ${userId}`)
        if (!result.length) {
            await SQL(`INSERT INTO  followvacations(user_id, vacation_id)
                       VALUES(${userId},${vacationId})`)
        }
        return res.status(201).send({ msg: "Follow added" })

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// unfollow
router.put('/unfollow/:vacationId', onlyUsers, async (req, res) => {
    const { userId } = req.session
    const { vacationId } = req.params
    //validate vacationid
    try {
        const vacation = await SQL(`SELECT * FROM vacations WHERE id = ${vacationId}`)
        if (!vacation.length) {
            return res.status(400).send({ err: "Vacation not found" })
        }

        await SQL(`DELETE FROM followvacations  
                   WHERE vacation_id = ${vacationId} AND user_id = ${userId}`)
        return res.status(201).send({ msg: "Follow deleted" })

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//=================
//only Admin

// get feed as admin
router.get('/admin', onlyAdmin, async (req, res) => {
    try {
        const vacations = await SQL(`SELECT vacations.*,
                                SUM(CASE WHEN followvacations.vacation_id IS NOT NULL THEN 1 ELSE 0 END) 
                                AS follows FROM vacations
                                LEFT JOIN followvacations ON followvacations.vacation_id = vacations.id
                                GROUP BY vacations.id`)

        res.send(vacations)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// get only vacations with followers with an extra column of number of followers
router.get('/vacations_with_follows', onlyAdmin, async (req, res) => {
    try {
        const vacations = await SQL(`SELECT vacations.id, vacations.destination, vacations.start, vacations.end,
                                     count(vacation_id) AS followers
                                     FROM vacations
                                     INNER JOIN followvacations ON vacations.id = followvacations.vacation_id
                                     GROUP BY vacation_id`)
        res.send(vacations)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//add new vacation
router.post('/new', onlyAdmin, async (req, res) => {
    const { destination, description, img_src, start, end, price } = req.body

    if (!destination || !description || !img_src || !start || !end || !(price > 0)) {
        return res.status(400).send({ err: "Wrong / missing some info" })
    }
    try {
        await SQL(`INSERT INTO vacations(destination, description, img_src, start, end, price)
                   VALUES("${destination}", "${description}", "${img_src}", "${start}", "${end}", ${price})`)
        res.status(201).send({ msg: "Vacation added" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//get vacation by id
router.get('/:vacationId', onlyAdmin, async (req, res) => {
    const { vacationId } = req.params
    if (!vacationId > 0) {
        return res.status(400).send({ err: "Wrong / missing some info" })
    }
    try {
        const vacation = await SQL(`SELECT * FROM vacations WHERE id = '${vacationId}'`)
        if (!vacation.length) {
            return res.status(400).send({ err: "Vacation not found" })
        }
        res.send(vacation[0])
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//update vacation
router.put('/:vacationId', onlyAdmin, async (req, res) => {
    const { vacationId } = req.params
    const { destination, description, img_src, start, end, price } = req.body
    if (!destination || !description || !img_src || !start || !end || !price > 0) {
        return res.status(400).send({ err: "Wrong / missing some info" })
    }

    try {
        const vacation = await SQL(`SELECT * FROM vacations WHERE id = '${vacationId}'`)
        if (!vacation.length) {
            return res.status(400).send({ err: "Vacation not found" })
        }
        await SQL(`UPDATE vacations SET
                   destination="${destination}",
                   description= "${description}",
                   img_src="${img_src}",
                   start="${start}",
                   end="${end}",
                   price=${price}
                   WHERE id=${vacationId}`)
        res.send({ msg: "Vacation updated" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

//delete vacation
router.delete('/:vacationid', onlyAdmin, async (req, res) => {
    const { vacationid } = req.params
    try {
        const vacation = await SQL(`SELECT * FROM vacations
                                    WHERE id = ${vacationid}`)
        if (!vacation.length) {
            return res.status(400).send({ err: "vacation not found" })
        }

        //delete the followers to the vacation
        await SQL(`DELETE FROM followvacations WHERE vacation_id = ${vacationid}`)

        //delete vacation
        await SQL(`DELETE FROM vacations WHERE id = ${vacationid}`)
        res.status(201).send({ msg: "Vacation deleted" })

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router