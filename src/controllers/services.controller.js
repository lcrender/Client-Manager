const ClientDb = require('../models/ClientDb');
const prices = require('../config/prices');
const ServicesObj = require('../class/Services');
const servicesCtrl = {};

servicesCtrl.renderServiceForm = async (req,res) => {
    try {
        let client = await ClientDb.findById(req.params.id).lean();
        res.render('services/new-service', {client});
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render service form');
        res.redirect('/clients');
    };
};
servicesCtrl.createNewService = async (req,res) => {
    try {
        const {
            hosting,
            hostingFrom,
            domain,
            otherDomainPrice,
            domainDetails,
            domainFrom,
            otherService,
            description,
            price,
            otherServiceFrom
        } = req.body;
        let hostPrice = 0;
        let domainPrice = 0;       
        if (hosting !== "No Hosting") {
            switch(hosting) {
                case "Hosting L":
                    hostPrice = prices.hostingl;
                break;
                case "Hosting Vip":
                   hostPrice = prices.hostingVip;
                break;
            };
            let serviceFinish = new Date(hostingFrom)
            serviceFinish.setFullYear(serviceFinish.getFullYear() + 1);
            let endDate = serviceFinish.getFullYear() + '-' + (serviceFinish.getMonth()+1).toString().padStart(2, '0') + '-' + serviceFinish.getDate().toString().padStart(2, '0');
            let newService = new ServicesObj(hosting, hostingFrom, endDate, hostPrice)
            let client = await ClientDb.findById(req.params.id);
            if (client.user != req.user.id) {
                req.flash('error_msg', 'Client not Authorized')
                return res.redirect('/clients');
            };
            client.service.push(newService);
            await client.save();
        };

        if (domain !== "No Domain") {
            switch(domain) {
                case ".COM":
                    domainPrice = prices.domainCom;
                break;
                case ".COM.AR":
                    domainPrice = prices.domainComAr;
                break;
                case "Other Domain":
                    domainPrice = otherDomainPrice;
                break;
            }
            let domainFinish = new Date(domainFrom)
            domainFinish.setFullYear(domainFinish.getFullYear() + 1);
            let domainEndDate = domainFinish.getFullYear() + '-' + (domainFinish.getMonth()+1).toString().padStart(2, '0') + '-' + domainFinish.getDate().toString().padStart(2, '0');
            let newDomain = new ServicesObj(domain, domainFrom, domainEndDate, domainPrice, domainDetails)
            let client = await ClientDb.findById(req.params.id);
            if (client.user != req.user.id) {
                req.flash('error_msg', 'Client not Authorized')
                return res.redirect('/clients');
            };
            client.service.push(newDomain);
            await client.save();
        };

        if (otherService !== "No") {
            let otherServiceFinish = new Date(otherServiceFrom)
            otherServiceFinish.setFullYear(otherServiceFinish.getFullYear() + 1);
            let otherServiceEndDate = otherServiceFinish.getFullYear() + '-' + (otherServiceFinish.getMonth()+1).toString().padStart(2, '0') + '-' + otherServiceFinish.getDate().toString().padStart(2, '0');
            let newService = new ServicesObj(otherService, otherServiceFrom, otherServiceEndDate, price, description)
            let client = await ClientDb.findById(req.params.id);
            if (client.user != req.user.id) {
                req.flash('error_msg', 'Client not Authorized')
                return res.redirect('/clients');
            };
            client.service.push(newService);
            await client.save();
        };
        req.flash('success_msg', 'New service created');
        res.redirect('/client/' + req.params.id);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to create new service');
        res.redirect('/clients');
    };
};
servicesCtrl.renderEditService = async (req, res) => {
    try {
        let client = await ClientDb.findById({_id: req.params.id}).lean();
        let service = await ClientDb.findOne({ _id: req.params.id, 'service._id': req.params.ids }).select('service.$').lean();
        if (client.user != req.user.id) {
            req.flash('error_msg', 'Client not Authorized')
            return res.redirect('/clients');
        };
        let editService = service.service[0]
        res.render('services/edit-service', {client, editService});
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render service edit form');
        res.redirect('/clients');
    };
};
servicesCtrl.updateService = async (req, res) => {
    try {
        const {from, renew, price} = req.body;
        const updateFields = {};
        if (from) {
        updateFields['service.$.date'] = from;
        };
        if (renew) {
        updateFields['service.$.renew'] = renew;
        };
        if (price) {
        updateFields['service.$.price'] = price;
        };
        // Actualizar el documento solo si hay campos para actualizar
        if (Object.keys(updateFields).length > 0) {
        let updateService = await ClientDb.updateOne(
            { _id: req.params.id, 'service._id': req.params.ids },
            { $set: updateFields }
        );
        }
        req.flash('success_msg', 'Service Update Successfully')
        res.redirect('/client/' + req.params.id);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to update service');
        res.redirect('/client' + req.params.id);
    };
};
servicesCtrl.deleteService = async (req, res) => {
    try {
        await ClientDb.updateOne(
            { _id: req.params.id },
            { $pull: { service: { _id: req.params.ids } } }
          );
        req.flash('success_msg', 'Service Deleted Successfully')
        res.redirect('/client/' + req.params.id);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to delete service');
        res.redirect('/clients');
    };
};
module.exports = servicesCtrl;