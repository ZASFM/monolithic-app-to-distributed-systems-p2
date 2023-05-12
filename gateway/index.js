const express=require('express');
const app=express();
const cors=require('cors');
const proxy=require('express-http-proxy')

app.use(express.json());
app.use(cors());

//redirecting to shopping
app.use('/shopping',proxy('http://localhost:8003'));
//redirecting to customer 
app.use('/customer',proxy('http://localhost:8003'));
//redirecting to root layer (products)
app.use('/',proxy('http://localhost:8002'));


app.listen(8000,()=>{
   console.log(`Gateway to ${8000}`);
})