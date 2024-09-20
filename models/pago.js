import mongoose from "mongoose";
const pagoSchema = mongoose.Schema({
    //tipo de tarjeta
    tipo_tarjeta:{
        type: String,
        required: true,
        trim: true,
    },
    numero_tarjeta: {
        type: String,
        required: true,
        trim: true,
    },
    fecha_vencimiento:{
        type: Date,
        required: true,
    },
    nombre_en_tarjeta: {
        type: String,
        required: true,
        trim: true,
    }
},{
    timestamps: true
})
const Pago = mongoose.model("Pago", pagoSchema);
export default Pago;