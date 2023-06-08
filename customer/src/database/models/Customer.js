const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address:[
        { type: Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    //here we dont longer need to have wishlist, cart and orders, since they get handled by shopping service
},{
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports =  mongoose.model('customer', CustomerSchema);