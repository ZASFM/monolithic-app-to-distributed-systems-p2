const express=require('express');
const app=express();

app.use(express.json());
app.use('/',(req,res,next)=>{
   res.send('from products')
});

app.listen(8002,()=>{
   console.log(`products to ${8002}`);
})