class ClientObj {
    constructor ( clientName, contactName, phone, email, cuit="-", service=[], createdDate ) {
        this.clientName = clientName;
        this.contactName = contactName;
        this.phone = phone;
        this.email = email;
        this.cuit = cuit;
        // this.logo = logo;
        this.service = service;
        this.CreatedDate = createdDate
    };
    addService( serviceName, serviceDate, price=0, description=null ) {
        let serviceFinish = new Date(serviceDate)
        let endDate = serviceFinish.getFullYear(serviceFinish.getFullYear() + 1) + '-' + (serviceFinish.getMonth()+1).toString().padStart(2, '0') + '-' + serviceFinish.getDate().toString().padStart(2, '0');
        let newService = { name: serviceName, date: serviceDate, renew: endDate, price, description };
        this.service.push(newService);
    }
};
module.exports = ClientObj;