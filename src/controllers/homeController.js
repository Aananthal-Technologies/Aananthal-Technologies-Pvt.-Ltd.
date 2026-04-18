const path = require('path');

const sendView = (view) => (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, `../views/${view}.html`));
    } catch (error) {
        next(error);
    }
};

const getHome      = sendView('home');
const getProducts  = sendView('products');
const getServices  = sendView('services');
const getContact   = sendView('contact');
const getAbout     = sendView('about');
const getBlog      = sendView('blog');
const getChangelog = sendView('changelog');
const getPrivacy   = sendView('privacy');
const getTerms     = sendView('terms');

module.exports = {
    getHome, getProducts, getServices, getContact,
    getAbout, getBlog, getChangelog, getPrivacy, getTerms
};
