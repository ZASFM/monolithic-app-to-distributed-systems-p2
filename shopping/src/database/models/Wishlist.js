const mongoose=require('mongoose');

const WishlistSchema=mongoose.Schema({
   customerId:{
      type:String
   },
   //wishlist only contains is of the products inside it
   products:[
      {
         _id:{
            type:String,
            required:true
         }
      }
   ]
})

module.exports=mongoose.model('Wishlist',WishlistSchema);