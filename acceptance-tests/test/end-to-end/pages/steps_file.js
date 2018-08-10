'use strict';
const BARATConstants = require('../tests/BARAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
const faker = require('faker');

const ChequePayername = faker.name.firstName();
const PostalOrderPayername = faker.name.firstName();
const CashPayername = faker.name.firstName();
const AllPayPayername = faker.name.firstName();
const CardPayername = faker.name.firstName();
const EditPayername = faker.name.firstName();
// faker.random.number({ min: 100000, max: 1000000 });
const BgcNumber = '354678';
const addContext = require('mochawesome/addContext');

const ctxObject = { test: { context: 'Acceptance Tests' } };
const ctxJson = { title: 'Test Context', value: 'Some Test Context' };

addContext(ctxObject, ctxJson);

module.exports = () => actor({
  // done
  login(email, password) {
    this.waitForElement('#username', BARATConstants.thirtySecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.waitForElement({ css: '[type="submit"]' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '[type="submit"]' });
    this.wait(BARATConstants.fiveSecondWaitTime);
  },
  // done
  paymentTypeCheque() {
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(1) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(1) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' });
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypePostalOrder() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(2) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(2) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('Postal order number');
    this.fillField('Payer name', PostalOrderPayername);
    this.fillField('Amount', '550');
    this.fillField('Postal order number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' });
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypeCash() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(3) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(3) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', CashPayername);
    this.fillField('Amount', '550');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' });
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypeAllPay() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(4) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(4) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('AllPay transaction ID');
    this.fillField('Payer name', AllPayPayername);
    this.fillField('Amount', '550');
    this.fillField('AllPay transaction ID', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' });
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  paymentTypeCard() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' });
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  editPayerNameAmountAndAuthorizationCode() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForElement({ css: 'td.bar-paymentlogs-td:nth-child(1) > a:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'td.bar-paymentlogs-td:nth-child(1) > a:nth-child(1)' });
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Authorization Code', '123456');
    this.waitForElement('.button-view', BARATConstants.tenSecondWaitTime);
    this.click('Save changes');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  deletePaymentInformation() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.waitForElement({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '.select-all > div:nth-child(1) > input:nth-child(2)' });
    this.click('Delete');
    this.see('Check and submit');
  },
  // done
  checkAddPaymentInstructionPage() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.see('Payment Type');
    this.waitForElement({ css: '[type="radio"]' }, BARATConstants.thirtySecondWaitTime);
    this.see('Cheque');
    this.see('Cash');
    this.see('Postal Order');
    this.see('AllPay');
    this.see('Card');
    this.see('Payer name');
    this.see('Amount');
    this.seeElement('.button.button-view:disabled');
  },
  // done
  feeclerkChequePaymentType() {
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(1) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(1) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' }, BARATConstants.tenSecondWaitTime);
    this.click({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' });
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkPostalOrderPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(2) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(2) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('Postal order number');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', PostalOrderPayername);
    this.fillField('Amount', '550');
    this.fillField('Postal order number', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' }, BARATConstants.tenSecondWaitTime);
    this.click({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' });
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(PostalOrderPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkCashPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(3) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(3) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', CashPayername);
    this.fillField('Amount', '550');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' }, BARATConstants.tenSecondWaitTime);
    this.click({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' });
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CashPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkAllPayPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(4) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(4) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('AllPay transaction ID');
    this.fillField('Payer name', AllPayPayername);
    this.fillField('Amount', '550');
    this.fillField('AllPay transaction ID', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' }, BARATConstants.tenSecondWaitTime);
    this.click({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' });
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(AllPayPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkCardPaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(5) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.waitForElement({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' }, BARATConstants.tenSecondWaitTime);
    this.click({ css: '.fee-search > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > a:nth-child(1)' });
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
    this.waitForElement('#action', BARATConstants.fiveSecondWaitTime);
    this.selectOption('#action', 'Process');
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
    this.click('Check and submit');
    this.waitForText(CardPayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Submit');
    this.see('Check and submit');
  },
  // done
  feeclerkEditChequePaymentType() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForElement({ css: 'div.form-group__payment-type:nth-child(1) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: 'div.form-group__payment-type:nth-child(1) > label:nth-child(1) > div:nth-child(1) > input:nth-child(1)' });
    this.see('Cheque');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', ChequePayername);
    this.fillField('Amount', '550');
    this.fillField('Cheque number', '312323');
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Return to payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click({ css: 'tbody.bar-feelogs-th:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1)' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement({ css: 'a.button' }, BARATConstants.tenSecondWaitTime);
    this.click('Edit');
    this.waitForText('Edit Payment Instruction', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Cheque number', '123456');
    this.click('Save changes');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  SeniorFeeClerkCardPaymentType() {
    this.waitForText('Anish feeclerk', BARATConstants.tenSecondWaitTime);
    this.click('Anish feeclerk');
    this.waitForElement({ css: 'div.stats__card:nth-child(1) > app-card:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2)' }, BARATConstants.fiveSecondWaitTime);
    this.click({ css: 'div.stats__card:nth-child(1) > app-card:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2)' });
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Approve');
    this.waitForElement('#bgc-number', BARATConstants.fiveSecondWaitTime);
    this.fillField('#bgc-number', BgcNumber);
    this.click('Confirm');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSee(ChequePayername);
  },
  // done
  DeliveryManagerTransferToBAR() {
    this.waitForText('krishna Srfeeclerk', BARATConstants.thirtySecondWaitTime);
    this.click('krishna Srfeeclerk');

    this.waitForText('Payments to review', BARATConstants.fiveSecondWaitTime);
    this.waitForElement({ css: 'html body app-root main#content app-payment-summary-review div.content-wrapper div.grid-row div.column-two-thirds div.card-container.stats div.stats__card app-card div.card div.content p.card__label' }, BARATConstants.fiveSecondWaitTime);
    this.click({ css: 'html body app-root main#content app-payment-summary-review div.content-wrapper div.grid-row div.column-two-thirds div.card-container.stats div.stats__card app-card div.card div.content p.card__label' });
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.click('#payment-instruction-all');
    this.click({ css: 'div.text-right > button:nth-child(2)' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[2]/button[2]' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSee(ChequePayername);
    this.dontSeeCheckboxIsChecked('#payment-instruction-all');
  },
  feeClerkRevertPayment() {
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.see('Add payment information');
    this.click('Add payment information');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[1]/fieldset/div/div[5]/label/div/input' });
    this.see('Authorization Code');
    this.fillField('Payer name', CardPayername);
    this.fillField('Amount', '550');
    this.fillField('Authorization Code', '312323');
    this.click({ xpath: '//div/form/div[4]/div/div/div/button' });
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div/div/div/p/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.click({ xpath: '//div/div[3]/div/div/table/tbody[1]/tr/td[1]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.click({ xpath: '//div/div[2]/div[2]/button' });
    this.fillField('Case number', '654321');
    this.fillField('Search for a Fee', 'fees order 1.2');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.click({ xpath: '//div[5]/table/tbody/tr/td[4]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Save');
    //  this.click({xpath: '//div/div/form/div[11]/button'})
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/select' });
    this.waitForElement({ xpath: '//div/div[1]/div[2]/div/div/select' }, BARATConstants.thirtySecondWaitTime);
    this.wait(BARATConstants.twoSecondWaitTime);
    this.selectOption('//div/div[1]/div[2]/div/div/select', 'Process');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div/div[1]/div[2]/div/div/input' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click({ xpath: '//div[2]/div/ul[1]/li[3]/a' });
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see(CardPayername);

    this.click({ xpath: '//*[@id="check-and-submit-table"]/tbody/tr[1]/td[1]/a' });
    this.waitForText('Revert to Pending status', BARATConstants.fiveSecondWaitTime);
  },
  Logout() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Log-out');
    this.click('Log-out');
    this.wait(BARATConstants.fiveSecondWaitTime);
  }
});
