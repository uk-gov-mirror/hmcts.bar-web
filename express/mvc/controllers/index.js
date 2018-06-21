const PaymentsController = require('./PaymentsController');
const PaymentsLogController = require('./PaymentsLogController');
const FeeController = require('./FeeController');
const PaymentInstructionController = require('./PaymentInstructionController');
const PaymentsOverviewController = require('../controllers/PaymentsOverviewController');
const FeatureController = require('./FeatureController');

// --- services ---
const { response } = require('./../../services/UtilService');
const { feeService, paymentsLogService, utilService, featureService } = require('./../../services');

module.exports = {
  paymentsController: new PaymentsController({ response }),
  paymentsLogController: new PaymentsLogController({ paymentsLogService }),
  feesController: new FeeController({ feeService, utilService }),
  paymentInstructionController: new PaymentInstructionController(),
  paymentsOverviewController: new PaymentsOverviewController(),
  featureController: new FeatureController(featureService)
};
