const {Router}  = require('express');
const router = Router();
const { 
    renderPaymentForm,
    createNewPayment,
    renderEditPayment,
    updatePayment,
    deletePayment
    } = require('../controllers/payments.controller')
const { isAuthenticated } = require('../helpers/auth');

// Nuevo Pago
router.get('/payments/add/:id/:ids',isAuthenticated, renderPaymentForm)
router.post('/payments/new-payment/:id/:ids', isAuthenticated, createNewPayment)

// Editar Pago
router.get('/payments/edit/:id/:ids/:idp', isAuthenticated, renderEditPayment)
router.put('/payments/edit/:id/:ids/:idp', isAuthenticated, updatePayment)

// Borrar Pago
router.delete('/payments/delete/:id/:ids/:idp', isAuthenticated, deletePayment)

module.exports = router