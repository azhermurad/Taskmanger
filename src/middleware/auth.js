const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // CHECK THE TOKEN EITHER IT IS VALIDE OR NOT 
        const decoded = jwt.verify(token, "mernstack")
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'unauthorize try again' });
    };
};


module.exports = auth;
