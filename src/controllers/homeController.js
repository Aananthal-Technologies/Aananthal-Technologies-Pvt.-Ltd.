const renderView = (view) => (_req, res, next) => {
    try {
        res.render(view);
    } catch (error) {
        next(error);
    }
};

const getHome      = renderView('home');
const getProducts  = renderView('products');
const getServices  = renderView('services');
const getContact   = renderView('contact');
const getAbout     = renderView('about');
const getBlog      = renderView('blog');
const getChangelog = renderView('changelog');
const getPrivacy   = renderView('privacy');
const getTerms     = renderView('terms');

module.exports = {
    getHome, getProducts, getServices, getContact,
    getAbout, getBlog, getChangelog, getPrivacy, getTerms
};
