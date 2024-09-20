import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    // Id_UserCard: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'UserCard',
    //     required: true,
    // },

    // Id_library: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Library',
    //     required: true,
    // },

    user_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    cellphone_number: {
      type: Number, // En JavaScript se usa Number en lugar de  'int'
      required: true,
    },
    //Se puede usar como otra tabla para los códigos del país
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
  }
);

// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar la contraseña
userSchema.methods.verifyPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
