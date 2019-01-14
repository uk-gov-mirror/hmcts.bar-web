export class PaymentStatus {
  static list = [
    { label: 'Draft', code: 'D' },
    { label: 'Pending', code: 'P' },
    { label: 'Pending Review', code: 'PA' },
    { label: 'Validated', code: 'V' },
    { label: 'Pending Approval', code: 'A' },
    { label: 'Approved', code: 'TTB' },
    { label: 'Completed', code: 'C' },
    { label: 'Rejected', code: 'REJ' },
    { label: 'Rejected by DM', code: 'RDM' }
  ];

  // make this redundant - gradually
  static APPROVED = 'A';
  static COMPLETED = 'C';
  static DRAFT = 'D'; // TODO: This needs to be changed to Recorded (REC)
  static PENDING = 'P';
  static PENDINGAPPROVAL = 'PA'; // TODO: This need to be changed to Pending Review (PR)
  static REJECTED = 'REJ';
  static REJECTEDBYDM = 'RDM';
  static TRANSFERREDTOBAR = 'TTB';
  static VALIDATED = 'V';

  static  getPayment(value: string) {
    const paymentStatus = PaymentStatus.list.filter(item => item.label === value || item.code === value);
    if (paymentStatus.length > 0) {
      return paymentStatus[0];
    }
  }

  static getAllCodes() {
    return this.list.map(item => {
      return item.code;
    });
  }

  static getAllLabels() {
    return this.list.map(item => {
      return item.code;
    });
  }

}
