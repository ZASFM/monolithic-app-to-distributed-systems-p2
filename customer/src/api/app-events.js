const CustomerService=require('../services/customer-service');

module.exports=(app)=>{
   const service=new CustomerService();
   app.use('/app-events',(req,res,next)=>{
      const {payload}=req.body;
      service.SubscribeEvents(payload);
      console.log('Event recieved shopping service');
      return res.status(200).json(payload);
   })
}