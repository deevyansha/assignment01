const express = require('express');
const productRouter = express.Router();
const productController = require('./productController');

productRouter.post('/create', productController.createProduct);
productRouter.get('/all', productController.getAllProduct);
productRouter.get('/:id', productController.getProduct);
productRouter.put('/edit/:id', productController.editProduct);
productRouter.delete('/remove/:id', productController.removeProduct);
productRouter.post('/purchase/:id', productController.purchaseProduct);

module.exports = productRouter;
