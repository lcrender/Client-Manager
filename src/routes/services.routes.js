const {Router}  = require('express');
const router = Router();
const { 
    renderServiceForm,
    createNewService,
    renderEditService,
    updateService,
    deleteService
    } = require('../controllers/services.controller')
const { isAuthenticated } = require('../helpers/auth');

// Nuevo Servicio
router.get('/services/add/:id',isAuthenticated, renderServiceForm)
router.post('/services/new-service/:id', isAuthenticated, createNewService)

// Editar Servicio
router.get('/services/edit/:id/:ids', isAuthenticated, renderEditService)
router.put('/services/edit/:id/:ids', isAuthenticated, updateService)

// Borrar Servicio
router.delete('/services/delete/:id/:ids', isAuthenticated, deleteService)

module.exports = router