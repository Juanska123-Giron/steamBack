import mongoose from "mongoose";
import bcrypt from "bcrypt";
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    token:{
        type: String,
    },
    confirmado:{
        type: Boolean,
        default: false,
    },
    //pedidos se define como un array [] de objetos, pues, un usuario puede tener uno o varios
    pedido: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
      }],
    //carrito: [carritoSchema]
},{
    timestamps: true
});
usuarioSchema.pre('save', async function(next){
    if (!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;