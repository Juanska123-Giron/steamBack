import mongoose from "mongoose";
const { schema } = mongoose;
const opinionSchema = mongoose.Schema({
    //para filtrar opiniones por usuario
    usuario:{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Usuario',
        required: true
    },
    producto:{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Producto',
        required: true
    },
    contenidoOpinion:{
        type: String,
        required: true,
        maxlength: 4000,
        trim: true,
    },
},{
    timestamps: true
})
const Opinion = mongoose.model("Opinion", opinionSchema);
export default Opinion;