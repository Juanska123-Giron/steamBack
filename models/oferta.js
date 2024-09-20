import mongoose from "mongoose";
const ofertaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
    },
    descripcion:{
        type: String,
        required: true,
        trim: true,
    },
    porcentaje:{
        type: Number,
        required: true,
        trim: true,
        min: 0,
        max: 1
    }
},{
    timestamps: true
})
const Oferta = mongoose.model("Oferta", ofertaSchema);
export default Oferta;