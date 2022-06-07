const onlyUsers = async (req, res, next) => {
    if (req.session.isAdmin) {
        return res.status(401).send({ err: "You are not authorized to perform this action" })
    }
    next()
}

module.exports = onlyUsers