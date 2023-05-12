const ProductService = require('../services/product-service');
const UserAuth = require('./middlewares/auth');
const { PublishCustomerEvent, PublishShoppingEvent } = require('../utils');
const { request } = require('express');

module.exports = (app) => {

    const service = new ProductService();

    app.post('/product/create', async (req, res, next) => {

        try {
            const { name, desc, type, unit, price, available, suplier, banner } = req.body;
            // validation
            const { data } = await service.CreateProduct({ name, desc, type, unit, price, available, suplier, banner });
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/category/:type', async (req, res, next) => {

        const type = req.params.type;

        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/:id', async (req, res, next) => {

        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/ids', async (req, res, next) => {

        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);

        } catch (err) {
            next(err)
        }

    });

    app.put('/wishlist', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            //getting the payload to send to customemr service:
            const { data } = await service.GetProductPayload(_id, { productId: req.body.id }, 'ADD_TO_WISHLIST');
            PublishCustomerEvent(data);
            return res.status(200).json(data.data.product);
        } catch (err) {

        }
    });

    app.delete('/wishlist/:id', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductPayload(_id, { productId}, 'REMOVE_FROM_WISHLIST');
            return res.status(200).json(data.data.product);
        } catch (err) {
            next(err)
        }
    });


    app.put('/cart', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetProductPayload(_id, { productId:req.body._id, qty:req.body.qty}, 'ADD_TO_CART');
            PublishCustomerEvent(data);
            PublishShoppingEvent(data);
            const payload={
                product:data.data.product,
                qty:data.data.qty
            }
            return res.status(200).json(payload);

        } catch (err) {
            next(err)
        }
    });

    app.delete('/cart/:id', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const productId=req.params.id;

        try {
            const { data } = await service.GetProductPayload(_id, { productId}, 'REMOVE_FROM_CART');
            const payload={
                product:data.data.product,
                qty:data.data.qty
            }
            return res.status(200).json(payload);
        } catch (err) {
            next(err)
        }
    });

    //get Top products and category
    app.get('/', async (req, res, next) => {
        //check validation
        try {
            const { data } = await service.GetProducts();
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }

    });

}