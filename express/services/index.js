const PaymentService = require('./PaymentService');
const PaymentsLogService = require('./PaymentsLogService');
const FeeLogService = require('./FeeLogService');
const FeeService = require('./FeeService');
const UtilService = require('./UtilService');

module.exports = {
  paymentService: new PaymentService(),
  paymentsLogService: new PaymentsLogService(),
  feeLogService: new FeeLogService(),
  feeService: new FeeService(),
  utilService: UtilService
};
