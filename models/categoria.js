import mongoose from "mongoose";
const categoriaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
    }
},{
    timestamps: true
})
const Categoria = mongoose.model("Categoria", categoriaSchema);
export default Categoria;