const Resource = require('../models/resource');
const User = require('../models/users')

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', "You must be logged in to view this page")
        return res.redirect('/users/login')
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { index } = req.params;
    const resource = await Resource.findById(index);
    if (!resource['author'].equals(req.user._id) && (req.user.username !== "admin")) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/resource/${index}`);
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {

    if (!req.user || req.user.username !== "admin") {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/`);
    }
    next();
}