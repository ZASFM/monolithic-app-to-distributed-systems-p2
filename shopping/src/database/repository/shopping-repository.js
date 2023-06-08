const mongoose = require('mongoose');
const { OrderModel, CartModel, WishlistModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

//Dealing with data base operations
class ShoppingRepository {

    async Orders(customerId) {

        const orders = await OrderModel.find({ customerId });

        return orders;

    }

    async Cart(customerId) {

        return CartModel.findOne({ customerId });

    }

    async ManageCart(customerId, product, qty, isRemove) {
        const cartItem = await CartModel.findOne({ customerId });

        if (cartItem) {
            if (isRemove) {
                //deleting the item from my cart where the id is equal to the product id
               const cartItems=_.filter(cartItem.items,(item)=>item.product._id!==product._id);
               cartItem.items=cartItems;
            } else {
                //finding the index if the product that i want to modify inside the items, cart.items is an array full of product objects
                const cartIndex = _.findIndex(cartItem.items, {
                    product: { _id: product._id }
                });
                if (cartIndex > -1) {
                    cartItem.items[cartIndex].unit = qty;
                } else {
                    cartItem.items.push({ product: { ...product }, unit: qty });
                }

                return await cartItem.save();
            }
        } else {
            return await CartModel.create({
                customerId,
                items: [{ product: { ...product }, unit: qty }]
            })
        }
    }

    async ManageWishlist(customerId, product_id, isRemove=false) {
        const wishlist = await WishlistModel.findOne({ customerId });

        //if wishlist exists perform nested elseif case, otherwise create a wishlist
        if (wishlist) {
            if (isRemove) {
                //if we want to remove product fro wishlist
                //deleting the item from my cart where the id is equal to the product id
               const wishlistItems=_.filter(wishlist.products,(item)=>item.product._id!==product._id);
               wishlist.items=wishlistItems;
            } else {
                //id we want to add products to the wishlist, checking if the wishlist with a certain customer id does or does not have the current product to add to the wishlist
                //finding the index if the product that i want to modify inside the items, cart.items is an array full of product objects
                const wishlistIndex = _.findIndex(wishlist.items, {
                    products: { _id: product._id }
                });
                if (cartIndex < 0) {
                    wishlist.products.push({_id:product_id});
                }
                return await wishlist.save();
            }
        } else {
            return await WishlistModel.create({
                customerId,
                products: [{_id:product_id}]
            })
        }
    }

    async CreateNewOrder(customerId, txnId) {

        //required to verify payment through TxnId

        const cart = await CartModel.findOne({ customerId: customerId })

        if (cart) {

            let amount = 0;

            let cartItems = cart.items;

            if (cartItems.length > 0) {
                //process Order

                cartItems.map(item => {
                    amount += parseInt(item.product.price) * parseInt(item.unit);
                });

                const orderId = uuidv4();

                const order = new OrderModel({
                    orderId,
                    customerId,
                    amount,
                    status: 'received',
                    items: cartItems
                })

                cart.items = [];

                const orderResult = await order.save();
                await cart.save();
                return orderResult;


            }



        }

        return {}
    }

}

module.exports = ShoppingRepository;