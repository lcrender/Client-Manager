const clientsCtrl = {};
const ClientObj = require('../class/Clients');
const ClientDb = require('../models/ClientDb');
const prices = require('../config/prices');

clientsCtrl.renderClientForm = (req, res) => {
    try {
        res.render('clients/new-client');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render new client form');
        res.redirect('/clients');
    };
};
clientsCtrl.createNewClient = async (req,res) => {
    try {
        // CREATE OBJ
        const {
                clientName, 
                contactName, 
                phone, 
                email, 
                cuit, 
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
            } = req.body
        let createdDate = new Date()
        const newClient = new ClientObj ( clientName, contactName, phone, email, cuit, [], createdDate )
        let hostPrice = 0
        let domainPrice = 0
        if (hosting !== "No Hosting") {
            switch(hosting) {
                case "Hosting L":
                   
                    hostPrice = prices.hostingl;
                break;
                case "Hosting Vip":
                   hostPrice = prices.hostingVip;
                break;
            };
            newClient.addService( hosting, hostingFrom, hostPrice );
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
            newClient.addService( domain, domainFrom, domainPrice, domainDetails );
        };
        if (otherService !== "No") {
            newClient.addService( otherService, otherServiceFrom, price, description  );
        };
       // MONGODB
        const newClientDb = new ClientDb ({
           clientName, 
           contactName, 
           phone, 
           email, 
           cuit, 
           service: newClient.service, 
           createdDate
        })
        newClientDb.user = req.user.id
        await newClientDb.save()
        req.flash('success_msg', 'Client Added Successfully')
        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to create new client');
        res.redirect('/clients');
    };
};
clientsCtrl.renderClients = async (req, res) => {
    try {
        const clientsList = await ClientDb.find({user: req.user.id}).sort({createdAt: 'desc'}).lean()
        res.render('clients/all-clients', {clientsList})
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render clients');
        res.redirect('/clients');
    };
};
clientsCtrl.renderClient = async (req, res) => {
    try {
        let client = await ClientDb.findById(req.params.id).lean();
        if (client.user != req.user.id) {
            req.flash('error_msg', 'Client not Authorized')
            return res.redirect('/clients');
        }
        client.service = client.service.map(obj => {
            obj.date = new Date(obj.date).toLocaleDateString();
            obj.renew = new Date(obj.renew).toLocaleDateString();
            return obj;
        });
        res.render('clients/view-client', {client});
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render client');
        res.redirect('/clients');
    };
};
clientsCtrl.renderEditForm = async (req, res) => {
    try {
        let client = await ClientDb.findById(req.params.id).lean();
        if (client.user != req.user.id) {
            req.flash('error_msg', 'Client not Authorized')
            return res.redirect('/clients');
        };
        client.service = client.service.map(obj => {
            obj.date = new Date(obj.date).toLocaleDateString();
            obj.renew = new Date(obj.renew).toLocaleDateString();
            return obj;
        });
        res.render('clients/edit-client', {client});
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render client edit form');
        res.redirect('/clients');
    };
};
clientsCtrl.updateClient = async (req, res) => {
    try {
        const {clientName, contactName, phone, email, cuit, createdDate, service} = req.body;
        await ClientDb.findByIdAndUpdate(req.params.id, {clientName, contactName, phone, email, cuit, createdDate, service }).lean(); 
        req.flash('success_msg', 'Client Update Successfully')
        res.redirect('/Clients');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to update client');
        res.redirect('/client/' + req.params.id);
    };
};
clientsCtrl.deleteClient = async (req, res) => {
    try {
        await ClientDb.findByIdAndDelete(req.params.id)
        req.flash('success_msg', 'Client Deleted Successfully')
        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to delete client');
        res.redirect('/clients');
    };
};

module.exports = clientsCtrl;