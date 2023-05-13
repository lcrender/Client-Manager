const ClientDb = require('../models/ClientDb');
// const prices = require('../config/prices');
const PaymentsObj = require('../class/Payments');
paymentsCtl = {}

paymentsCtl.renderPaymentForm = async (req, res) => {
    try {
        let client = await ClientDb.findById(req.params.id).lean();
        let service = await ClientDb.findOne({ _id: req.params.id, 'service._id': req.params.ids }).select('service.$').lean();
        service = service.service[0]
        res.render('payments/new-payment', {client, service});
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render payment form');
        res.redirect('/clients');
    };
};
paymentsCtl.createNewPayment = async (req, res) => {
    try {
      const client = await ClientDb.findById(req.params.id).lean();
      const service = await ClientDb.findOne({
        _id: req.params.id,
        'service._id': req.params.ids
      }).select('service').lean();

      const serviceIndex = client.service.findIndex((s) => s._id == req.params.ids);

      if (client.user != req.user.id) {
        req.flash('error_msg', 'Client not authorized')
        return res.redirect('/clients');
      };
      const { paymentMethod, details, price, currency } = req.body;
      // const date = new Date();
      // const day = date.getDate();
      // const month = date.getMonth() + 1;
      // const year = date.getFullYear();
      // const formattedDate = `${day}/${month}/${year}`;

      let paymentDate = new Date()
      //paymentDate.setFullYear(paymentDate.getFullYear());
      let formattedDate = paymentDate.getFullYear() + '-' + (paymentDate.getMonth()+1).toString().padStart(2, '0') + '-' + paymentDate.getDate().toString().padStart(2, '0');


      if (price == "" || price == "undefined" || price == null) {
        price = service.service[serviceIndex].price
      };
      const newPayment = new PaymentsObj(
        paymentMethod, 
        details, 
        price, 
        currency, 
        formattedDate 
      );
      client.service[serviceIndex].payments.push(newPayment);
      await ClientDb.findByIdAndUpdate(req.params.id, client);
      req.flash('success_msg', 'New payment created');
      res.redirect('/client/' + req.params.id);
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Failed to create new payment');
      res.redirect('/clients');
    };
  };

paymentsCtl.renderEditPayment = async (req,res) => {
    try {
        
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to render edit payment form');
        res.redirect('/clients');
    };
};
paymentsCtl.updatePayment = async (req,res) => {
    try {
      
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to update payment');
        res.redirect('/clients');
    };
};
paymentsCtl.deletePayment = async (req,res) => {
    try {
        await ClientDb.updateOne(
            { _id: req.params.id, "service._id": req.params.ids, "service.payments._id": req.params.idp },
            { $pull: { "service.$[].payments": { _id: req.params.idp } } }
        );
        req.flash('success_msg', 'Payment was deleted');
        res.redirect('/client/' + req.params.id);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to delete payment');
        res.redirect('/clients');
    };
};

module.exports = paymentsCtl;