
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productname: {type: String, required: true},
    price: {type: String, required: true, unique: true},
    desc: {type: String, required: true},
    img: {type: String, required: true},
    profile: {type: String, required: true},
    service1: {type: String, required: true},
    service2: {type: String, required: true},
    service3: {type: String, required: true},
    service4: {type: String, required: true},
    service5: {type: String, required: true},
    company: {type: String, required: true},
    locationimg: {type: String, required: true},
    place: {type: String, required: true},
    location: {type: String, required: true},
    category: {type: String, required: true},
    date: {type: String, required: true},
    slot: {type: String, required: true},
    price: {type: Number, required: true},
    availableQty: {type: Number, required: true},
   
}, {timestamps: true} );

mongoose.models = {}
export default mongoose.model("Product", ProductSchema);
//export default mongoose.model.Product || mongoose.model("Product", ProductSchema);