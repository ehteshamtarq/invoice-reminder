const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Invoice schema
const invoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
   status: { 
    type: String, 
    enum: ['due', 'pending', 'paid'], 
    required: true 
  },
  description: { type: String },
});

// Define the User schema
const userSchema = new Schema({
  _id: { type: String, required: true }, // Email as the ID
  username: { type: String, required: true },
  invoices: [invoiceSchema], // Array of invoice details
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
