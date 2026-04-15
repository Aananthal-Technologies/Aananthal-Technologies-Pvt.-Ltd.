const path = require('path');

const getHome = (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '../views/home.html'));
    } catch (error) {
        next(error);
    }
};

const getProducts = (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '../views/products.html'));
    } catch (error) {
        next(error);
    }
};

const getServices = (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '../views/services.html'));
    } catch (error) {
        next(error);
    }
};

const getContact = (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '../views/contact.html'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHome,
    getProducts,
    getServices,
    getContact
};
