const path = require('path');

const getHome = (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '../views/home.html'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHome
};
