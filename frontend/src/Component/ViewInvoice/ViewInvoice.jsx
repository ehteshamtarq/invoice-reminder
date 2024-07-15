import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import "./ViewInvoice.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [notPaid, setNotPaid]= useState(true)

  const storedData = localStorage.getItem("invoices");
  const invoicesData = JSON.parse(storedData);
  const invoiceExists = invoicesData.find(
    (invoice) => invoice.invoiceNumber === slug
  );
  console.log(invoiceExists);

  useEffect(() => {

    if (invoiceExists.status === 'paid'){
      setNotPaid(false);
    }

  }, []);

  const goBack = () => {
    navigate("/");
  };

  const payinvoice = async () => {
    setIsLoading(true);

    if (!user.name) {
      navigate("/");
    }

    const userinfo = {
      _id: user.email,
      invoiceNumber: invoiceExists.invoiceNumber,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/pay-invoice",
        userinfo
      );
      if (response.status === 200) {
        enqueueSnackbar("Invoice Mark as Paid", { variant: "success" });
      } else {
        enqueueSnackbar("Failure", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failure", { variant: "success" });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <>
      <Navbar />
      <button className="goback" type="button" onClick={goBack}>
        Back
      </button>

      {!isLoading  && notPaid && (
        <button
          className="goback"
          type="button"
          onClick={() => {
            payinvoice();
          }}
        >
          Mark As Paid
        </button>
      )}

      {isLoading && <CircularProgress />}

      <div className="viewInvoice">
        <p>Invoice Number: {invoiceExists.invoiceNumber}</p>
        <p>Name: {invoiceExists.name}</p>
        <p>Amount: {invoiceExists.amount}</p>
        <p>Due Date:{new Date(invoiceExists.dueDate).toLocaleDateString()}</p>
        <p>Email: {invoiceExists.email}</p>
        <p>Status: {invoiceExists.status}</p>
        <p>Description: {invoiceExists.description}</p>
      </div>
    </>
  );
};

export default ViewInvoice;
