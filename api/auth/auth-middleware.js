
const User = require('../users/users-model')

function checkUsernameAndPassword(req, res, next) {
    if (!req.body.password || !req.body.username) {
        next({ message: 'username and password required', status: 404 })
    } else {
        next()
    }
}

async function checkUsernameFree(req, res, next) {
    try {
        const users = await User.findBy({ username: req.body.username })
        console.log('users: ', users);
        if (!users.length) {
            next()
        } else {
            next({ message: 'username taken', status: 401 });
        }
    } catch (err) {
        next(err)
    }
}

async function checkUsernameExists(req, res, next) {
    try {
        const [user] = await User.findBy({ username: req.body.username })
        if(!user) {
            next({ message: 'invalid credentials', status: 401 })
        } else {
            req.user = user
            next()
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkUsernameFree,
    checkUsernameAndPassword,
    checkUsernameExists
}