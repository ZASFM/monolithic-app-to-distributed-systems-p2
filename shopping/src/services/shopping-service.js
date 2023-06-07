const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }


  //cart

  async AddToCartItem(customerId,product_id,qty){
    //grab product details from product service through rpc
    
    const cartResponse={};
    try{
       if(cartResponse && cartResponse._id){

       }
    }catch(err){
      throw new Error('Product data does not exists');
    }
  }

  async RemoveCartItem(customerId, product_id){}

  async GetCart(_id) {
    try {
      return this.repository.Cart(_id);
    } catch (err) {
      console.log(err);
    }
  }

  //orders

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try{
      const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
      return FormateData(cartResult);
    }catch(err){
      console.log(err);
    }
  }

  async SubscribeEvents(payload){

    //parsing because when I publish i do it this way: service.SubscribeEvents(data.content.toString());
    payload=JSON.parse(payload);
 
    const { event, data } =  payload;

    const { userId, product, qty } = data;

    switch(event){
        case 'ADD_TO_CART':
            this.ManageCart(userId,product, qty, false);
            break;
        case 'REMOVE_FROM_CART':
            this.ManageCart(userId,product,qty, true);
            break;
        default:
            break;
    }

  }

  async GetOrderPayload(userId,order,event){
    if(order){
       const payload={
         event,
         data:{userId,order}
       }
       return FormateData(payload);
    }
    return FormateData({message:'Error order available'})
 }

}

module.exports = ShoppingService;
