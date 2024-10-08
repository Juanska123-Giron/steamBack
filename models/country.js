import mongoose from "mongoose";

const countrySchema = mongoose.Schema(
  {
    country_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adding automatically the createdAt and updatedAt fields
  }
);

const Country = mongoose.model("Country", countrySchema);
export default Country;
