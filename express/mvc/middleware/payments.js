// https://github.com/chriso/validator.js
const httpStatusCodes = require('http-status-codes');
const isInt = require('validator/lib/isInt');
const isAlpha = require('validator/lib/isAlpha');
const matches = require('validator/lib/matches');

module.exports = {
  addPaymentMiddleware(req, res, next) {
    return next();
  },

  validateStatusType(req, res, next) {
    if (req.query.hasOwnProperty('status') && (!matches(req.query.status, /[a-zA-Z]/) && !isAlpha(req.query.status))) {
      const { status } = req.query;
      return res.status(httpStatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Please ensure you add the right parameters.', status });
    }

    if (req.query.hasOwnProperty('format') && (req.query.format !== 'csv' && req.query.format !== 'json')) {
      return res.status(httpStatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Invalid parameters for format.' });
    }

    return next();
  },

  validateIdForPayment(req, res, next) {
    if (req.params.hasOwnProperty('id')) {
      if (!isInt(req.params.id)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'ID must be a number' });
      }
    }

    return next();
  },

  validateRequestBodyForStatusChange(req, res, next) {
    if (req.params.hasOwnProperty('id')) {
      if (!isInt(req.params.id)) {
        return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'ID must be a number' });
      }
    }

    if (!req.body.hasOwnProperty('action') || !req.body.hasOwnProperty('status')) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({ success: false, message: 'Please ensure you send the correct parameters.' });
    }

    return next();
  }
};
