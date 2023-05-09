class ServiceObj {
    constructor (serviceName, serviceDate, endDate, price, description=null, payments=[]) {
        this.name = serviceName;
        this.date = serviceDate;
        this.renew = endDate;
        this.price = price;
        this.description = description;
        this.payments = payments;
    };
};
module.exports = ServiceObj;