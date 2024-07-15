import React from "react";
import Navbar from "../Navbar/Navbar.jsx";
import "./Mainpage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "../Table/Table.jsx";
import { useSnackbar } from "notistack";

const Mainpage = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-invoice");
  };

  const sendReminderDue = async () => {
    setLoading(true);

    const userinfo = {
      _id: user.email,
      username: user.name,
    };

    try {
      const response = await axios.post(
        "https://invoice-reminder.onrender.com/due-invoices",
        userinfo
      );
      if (response.status === 200) {
        enqueueSnackbar("Reminder Sent to Due Invoices", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failure", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failure", { variant: "success" });
    } finally {
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  useEffect(() => {
    // Function to fetch invoices from backend
    const fetchInvoices = async () => {
      try {
        const response = await axios.post("https://invoice-reminder.onrender.com/invoices", {
          _id: user.email,
        }); // Replace with actual _id
        const { invoices } = response.data;

        console.log(invoices);

        if (invoices.length > 0) {
          // Store invoices in localStorage
          localStorage.setItem("invoices", JSON.stringify(invoices));
          setInvoices(invoices);
        } else {
          setError("NO INVOICE RECORD FOUND");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setError("Error fetching invoices. Please try again later.");
      } finally {
        setLoading(false); // Update loading state after request completes
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <Navbar />
      <button className="create" onClick={handleClick}>
        Create Invoice
      </button>

      {!loading && (
        <button className="create" onClick={sendReminderDue}>
          Send Reminder To Due Invoices
        </button>
      )}

      {loading && <CircularProgress />}

      {loading && (
        <div>
          <CircularProgress />
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && <Table invoices={invoices} />}
    </div>
  );
};

export default Mainpage;
