const {Router}  = require('express');
const router = Router();
const { 
    renderClientForm,
    createNewClient,
    renderClients,
    renderClient,
    renderEditForm,
    updateClient,
    deleteClient
} = require('../controllers/clients.controller')
const { isAuthenticated } = require('../helpers/auth');

// Nuevo Cliente
router.get('/clients/add',isAuthenticated, renderClientForm)
router.post('/clients/new-client', isAuthenticated, createNewClient)

// Ver Clientes
router.get('/clients', isAuthenticated, renderClients)
// Ver Cliente
router.get('/client/:id', isAuthenticated, renderClient)

// Editar Cliente
router.get('/clients/edit/:id', isAuthenticated, renderEditForm)
router.put('/clients/edit/:id', isAuthenticated, updateClient)

// Borrar Cliente
router.delete('/clients/delete/:id', isAuthenticated, deleteClient)

module.exports = router