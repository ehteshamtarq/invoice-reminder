// server.js
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const User = require("./model.js");
const axios = require("axios");

app.use(bodyParser.json());
connectDB();
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());

app.post("/create-invoice", async (req, res) => {
  const { _id, username, invoice } = req.body;
  console.log(req.body);
  try {
    const currentDate = new Date();
    const dueDate = new Date(invoice.dueDate); // Assuming invoice.date is the due date
    invoice.status = currentDate > dueDate ? "due" : "pending";
    let user = await User.findById(_id);

    if (!user) {
      user = new User({
        _id: _id,
        username: username, // Set a default name or pass the name as a parameter
        invoices: [invoice],
      });
      await user.save();
      console.log("User created and invoice added successfully:", user);

      const zapierData = { username: "username", invoice: invoice };
      console.log(zapierData);
      console.log("zapier");
      const response = await axios.post(
        "https://hooks.zapier.com/hooks/catch/19461272/2222npf/",
        zapierData
      );
      console.log(response.status);

      if (response.status === "success") {
        console.log("Email sent successfully using zapier");
      } else {
        console.log("Error in sending Email");
      }

      return res.sendStatus(200);
    } else {
      user.invoices.push(invoice);
      await user.save();

      const zapierData = { username: username, invoice: invoice };
      console.log(zapierData);
      console.log("zapier");
      const response = await axios.post(
        "https://hooks.zapier.com/hooks/catch/19461272/2222npf/",
        zapierData
      );
      console.log(response.status);

      if (response.status === 200) {
        console.log("Email sent successfully using zapier");

        console.log("Invoice added successfully:", user);
        return res.sendStatus(200);
      }
    }
  } catch (error) {
    console.error("Error adding invoice:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the invoice" });
  }
});

app.post("/invoices", async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user || !user.invoices || user.invoices.length === 0) {
      return res.status(200).json({ invoices: [] });
    }

    const currentDate = new Date();
    user.invoices.forEach((invoice) => {
      if (invoice.date < currentDate && invoice.status === "pending") {
        invoice.status = "due";
      }
    });

    await user.save();

    return res.status(200).json({ invoices: user.invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching invoices" });
  }
});

app.post("/pay-invoice", async (req, res) => {
  const { _id, invoiceNumber } = req.body;

  try {
    // Find the user
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find the invoice
    const invoice = user.invoices.find(
      (inv) => inv.invoiceNumber === invoiceNumber
    );

    if (!invoice) {
      return res.status(404).send({ message: "Invoice not found" });
    }

    // Update the invoice status
    invoice.status = "paid";

    // Save the user document
    await user.save();

    res.send({ message: "Invoice status updated to paid", invoice });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

app.post("/due-invoices", async (req, res) => {
  const {_id,  username } = req.body;

  try {
    // Find the user by _id and filter invoices with status 'due'
    const user = await User.findById(_id);

    if (!user || !user.invoices || user.invoices.length === 0) {
      return res.status(200).json({ invoices: [] });
    }

    // Filter invoices with status 'due'
    const dueInvoices = user.invoices.filter(
      (invoice) => invoice.status === "due"
    );
    for (let dueInvoice of dueInvoices) {
      const zapierdata = {username: username, invoice: dueInvoice};
      try {
        const response = await axios.post("https://hooks.zapier.com/hooks/catch/19461272/2222npf/", zapierdata);
        console.log("Data sent successfully:", response.data);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }

    return res.status(200).json({ invoices: dueInvoices });
  } catch (error) {
    console.error("Error fetching due invoices:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching due invoices" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
