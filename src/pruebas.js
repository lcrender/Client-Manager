paymentsCtl.createNewPayment = async (req,res) => {
    try {
        let client = await ClientDb.findById({_id: req.params.id}).lean();
        let service = await ClientDb.findOne({ _id: req.params.id, 'service._id': req.params.ids }).select('service.$').lean();
        if (client.user != req.user.id) {
            req.flash('error_msg', 'Client not Authorized')
            return res.redirect('/clients');
        };
        let { paymentMethod, details, price, currency } = req.body;
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        if (price == "" || price == "undefined" || price == null) {
            price = service.service[0].price
        };
        
        const newPayment = new PaymentsObj(
            paymentMethod, 
            details, 
            price, 
            currency, 
            formattedDate 
          );
          console.log(client.service[0].payments)
          client.service[0].payments.push(newPayment);
          console.log(client.service[0].payments)
          await client.service[0].payments.save();
 
    req.flash('success_msg', 'New payment created');
    res.redirect('/client/' + req.params.id);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to create new payment');
        res.redirect('/clients');
    };
};