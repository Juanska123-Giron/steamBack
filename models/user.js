import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    payments_cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentCard",
        required: false,
      },
    ],

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
      type: Number, // In JavaScript you use Number instead of Int
      required: true,
    },
    //
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds automatically the createdAt and updatedAt fields
  }
);

// Middleware to encrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify the password
userSchema.methods.verifyPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
