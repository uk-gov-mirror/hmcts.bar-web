const fees = require('./../../../data/fees_search_results_response');
const { feeService, utilService } = require('../../services');

class FeeController {
  async getIndex(req, res) {
    const [err, data] = await utilService.asyncTo(feeService.searchForFee(req.query));
    if (!err) {
      return res.json(data.body);
    }

    return res.json({ data: req.body, id: req.param.id });
  }

  async postAddFeeToCase(req, res) {
    const [err, data] = await utilService.asyncTo(feeService.addFeeToCase(req.params.id, req.body));
    if (!err) {
      return res.json({ data: data.body, id: req.params.id });
    }

    return res.json({ data: req.body, id: req.param.id });
  }

  getFees(req, res) {
    if (typeof req.query.code !== 'undefined') {
      const selectedFees = fees.filter(fee => {
        let status = false;

        if (fee.code.includes(req.query.code) || fee.code.includes(req.query.code.toUpperCase())) {
          status = true;
        } else if (typeof fee.current_version !== 'undefined' && Object.keys(fee.current_version).length > 0 && (fee.current_version.description.includes(req.query.code) || fee.current_version.description.toLowerCase().includes(req.query.code))) {
          status = true;
        }

        return status;
      });

      // if the code has been found
      return res.json({ found: true, fees: selectedFees });
    }

    return res.json({ found: true, fees });
  }
}

module.exports = FeeController;
