const jwtManager = require('../jwt/jwtManager');

class Uaa {
    checkToken(req, res, next) {

        if (req.url === '/api/v1/auth/login' || req.url === '/api/v1/auth/signup') {
            next();
            return;
        }
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: 'auth_error' });
        } else {
            const data = jwtManager.verify(token);
            console.log(data);
            if (!data) {
                return res.json({ status: 'auth_error' });
            }
            req._id = data._id;
            req.fullname = data.fullname

            next();
        }
    }
}

module.exports = new Uaa();