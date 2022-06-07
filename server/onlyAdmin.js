const onlyAdmin = async (req, res, next) => {
    if (req.session.isAdmin) {
        next()
    } else {
        res.status(401).send({ err: "You are not authorized to perform this action" })
    }
}

module.exports = onlyAdmin