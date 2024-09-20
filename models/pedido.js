import mongoose from "mongoose";
const pedidoSchema = mongoose.Schema({
    //para filtrar pedidos por usuario
    usuario:{
        type: Schema.Types.ObjectID,
        ref: 'Usuario'
    },
    /*Acá no se define como un array porque un pedido se 
    asocia a una sola dirección*/
    direccion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Direccion'
    },
    pago:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pago'
    },
    carrito:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito'
    },
    resumen:{
        type: String,
        required: true,
        trim: true,
    },
    //Pendiente, confirmado, enviado, entregado, cancelado, devuelto, reembolsado
    estado:{
        type: String,
        required: true,
        trim: true,
        default: 'Pendiente'
    }

},{
    timestamps: true
})
const Pedido = mongoose.model("Pedido", pedidoSchema);
export default Pedido;