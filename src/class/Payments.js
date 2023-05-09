class PaymentObj {
    constructor ( paymentMethod, details, price, currency, date ) {
        this.paymentMethod = paymentMethod;
        this.details = details;
        this.price = price;
        this.currency = currency;
        this.date = date;
    };
};
module.exports = PaymentObj;