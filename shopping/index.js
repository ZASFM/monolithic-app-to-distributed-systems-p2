const express=require('express');
const app=express();

app.use(express.json());
app.use('/',(req,res,next)=>{
   res.send('from shopping')
});

app.listen(8003,()=>{
   console.log(`shopping to ${8003}`);
})