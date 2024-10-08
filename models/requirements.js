import mongoose from "mongoose";

const requirementsSchema = mongoose.Schema({
  //Dropdown with options
  platform: {
    type: String,
    required: true,
  },

  processor: {
    type: String,
    required: true,
  },

  memory: {
    type: Number,
    required: true,
  },

  graphics: {
    type: String,
    required: true,
  },
  //GB of memori
  storage: {
    type: Number,
    required: true,
  },
});

const Requirements = mongoose.model("Requirements", requirementsSchema);

export default Requirements;
