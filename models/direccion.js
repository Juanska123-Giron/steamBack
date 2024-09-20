import mongoose from "mongoose";
const direccionSchema = mongoose.Schema({
    personaRecibe:{
        type: String,
        required: true,
        trim: true,
    },
    departamento:{
        type: String,
        required: true,
        trim: true,
    },
    municipio:{
        type: String,
        required: true,
        trim: true,
    },
    barrio:{
        type: String,
        required: true,
        trim: true,
    },
    /*Tipo de calle es el nombre para referirse a si 
    es avenida, calle, carrera, circunvalar, etc*/
    tipo_de_calle:{
        type: String,
        required: true,
        trim: true,
    },
    nomencaltura_calle:{
        type: String,
        required: true,
        trim: true,
    },
    numero_1:{
        type: String,
        required: false,
        trim: true,
    },
    numero_2:{
        type: String,
        required: false,
        trim: true,
    },
    //casa o trabajo, etc
    tipo_direccion:{
        type: String,
        required: true,
        trim: true,
    },
    referenciaAdicional:{
        type: String,
        required: false,
        trim: true,
    }  
},{
    timestamps: true
})
const Direccion = mongoose.model("Direccion", direccionSchema);
export default Direccion;