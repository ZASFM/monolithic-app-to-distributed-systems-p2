module.exports=(app)=>{
   app.use('/app-events',(req,res,next)=>{
      const {payload}=req.body;

      console.log('Event recieved shopping service');
      return res.status(200).json(payload);
   })
}