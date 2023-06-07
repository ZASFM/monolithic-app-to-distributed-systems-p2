const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    customerId: { type: String },
    items: [
        {   
            product: {
                _id: { type: String, require: true},
                name: { type: String },
                img:{type:String},
                //when i need these I would make an rpc request to the products service and ask for more details
                //desc: { type: String },
                //banner: { type: String },
                //type: { type: String },
                unit: { type: Number },
                //price: { type: Number },
                //suplier: { type: String },
                price:{type:String}
            } ,
            unit: { type: Number, require: true} 
        }
    ]
});

module.exports =  mongoose.model('cart', CartSchema);