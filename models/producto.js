import mongoose from "mongoose";
const { Schema } = mongoose;
const productoSchema = mongoose.Schema({
    nombre_producto: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
    },
    imagenPath: {
        type: String,
        required: true,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    opinion: [{
        type: Schema.Types.ObjectID,
        ref: 'Opinion',
        required: false
    }],
    proveedor:[{
        type: Schema.Types.ObjectID,
        ref: 'Proveedor',
        required: false
    }],
    categoria: [{
        type: Schema.Types.ObjectID,
        ref: 'Categoria',
        required: false
    }],
    oferta: [{
        type: Schema.Types.ObjectID,
        ref: 'Oferta',
        required : false
    }],
    fechaCreacion: {   
        type: Date,
        default: Date.now()
    },
    creadores: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Usuario',
    }]
    

},{
    timestamps: true
})
const Producto = mongoose.model("Producto", productoSchema);
export default Producto;