
const onlyLoggedUsers = async (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.status(401).send({ err: "Sensetive content for logged users only, plesae log in" })
    }
}


module.exports = onlyLoggedUsers