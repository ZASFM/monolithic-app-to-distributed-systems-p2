const { ShoppingRepository } = require("../database");
const { FormateData, RPCRequest } = require("../utils");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }


  //cart

  async AddToCartItem(customerId, product_id, qty) {
    //grab product details from product service through rpc
    const cartResponse = await RPCRequest('PRODUCTS_RPC', {
      type: 'VIEW PRODUCT',
      data: product_id
    })
    try {
      if (cartResponse && cartResponse._id) {
        const data = await this.repository.ManageCart(customerId, product, qty);
        return data;
      }
    } catch (err) {
      throw new Error('Product data does not exists');
    }
  }

  async RemoveCartItem(customerId, product_id) {
    return this.repository.ManageCart(customerId, { _id: product_id }, 0, true);
  }

  async GetCart(_id) {
    try {
      return this.repository.Cart(_id);
    } catch (err) {
      console.log(err);
    }
  }

  //wishlist

  async AddToWishlist(customer_id, product_id) {
    return this.repository.ManageWishlist(customer_id, product_id);
  }

  async GetWishList(customer_id,) {
    //perform rpc call to get product details before deliver to the client
    const { products } = await this.repository.GetWishlistByCustomerId(customer_id);
    if (Array.isArray(products)) {
      const ids = products.map(product => product._id);

      const productResponse = await RPCRequest('PRODUCT_SERVICE', {
        type: 'VIEW PRODUCTS',
        data: ids
      });

      if (productResponse) {
        return productResponse;
      }
    }
    return {};
  }

  async RemoveFromWishlist(customer_id, product_id) {
    return this.repository.ManageWishlist(customer_id, product_id);
  }

  //orders

  async createOrder(_id, txnNumber) {

    // Verify the txn number with payment logs

    try {
      return await this.repository.CreateNewOrder(_id, txnNumber);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrder(orderId) {
    try {
      const orders = await this.repository.Orders('', orderId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId, '');
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
      return FormateData(cartResult);
    } catch (err) {
      console.log(err);
    }
  }

  async SubscribeEvents(payload) {

    //parsing because when I publish i do it this way: service.SubscribeEvents(data.content.toString());
    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false);
        break;
      case 'REMOVE_FROM_CART':
        this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }

  }

  async deleteProfilesData(userId){
    return await this.repository.deleteProfileData(userId);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { type, data } = payload;
    switch (type) {
      case 'DELETE PROFILE':
        await this.deleteProfilesData(data.userId);
        break;
      default:
        break;
    }
  }


  /*   async GetOrderPayload(userId, order, event) {
      if (order) {
        const payload = {
          event,
          data: { userId, order }
        }
        return FormateData(payload);
      }
      return FormateData({ message: 'Error order available' })
    } */

}

module.exports = ShoppingService;
