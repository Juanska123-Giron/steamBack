import mongoose from "mongoose";
const carritoSchema = mongoose.Schema({
    usuario:{
        type: Schema.Types.ObjectID,
        ref: 'Usuario',
        required: true
    },
    items: [
        {
          producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',
            required: true
          },
          cantidaad: {
            type: Number,
            required: true,
            min: 1
          }
        }
      ],
},{
    timestamps: true
})
const Carrito = mongoose.model("Carrito", carritoSchema);
export default Carrito;