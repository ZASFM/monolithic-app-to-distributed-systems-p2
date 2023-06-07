const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");
const { SHOPPING_SERVICE }=require('../config/index');
const { SubscribeMessage, PublishMessage } = require("../utils");

module.exports = (app,channel) => {
  const service = new CustomerService();

  //my customer services is only publishing an event not subscribing
  //SubscribeMessage(channel,service);

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //when deleting pfofile communicating to the shopping service that some user has deleted its profile:
  app.delete("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data,payload } = await service.DeleteProfile( _id );
      //upon deleting me account message the shopping service about the account delete and the event theat triggered
      PublishMessage(channel,SHOPPING_SERVICE, JSON.stringify(payload));
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //these two routes wont be necesary for this services, will store them inside the shopping servicee
/*   app.get("/shoping-details", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetShopingDetails(_id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }); */
};
