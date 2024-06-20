
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: Number, required: true},
    orderId: {type: String, required: true},
    paymentInfo: {type: String, default:''},
    products: {type: Object, required: true},
    address: {type: String, required:true},
    transactionid: {type: String, default:""},
    email: {type: String, required:true},
    amount: {type: Number, required:true},
    status:{type: String, default:'initiated', required:true}, 
    
    
    status: {type: String, default: 'Pending' , required:true},
}, {timestamps: true} );

mongoose.models = {}
export default mongoose.model("Order", OrderSchema);
//export default mongoose.model.Appointment || mongoose.model("Appointment", AppointmentSchema);
