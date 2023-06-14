const { ValidateSignature } = require('../../utils');
const { AuthorizationError } = require('../../utils/errors/app-errors');

module.exports = async (req, res, next) => {
    try {
        const isAuthorized = await ValidateSignature(req);

        if (isAuthorized) {
            return next();
        }
        throw new AuthorizationError('Can not access details')
    } catch (err) {
        next(err)
    }
}