import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import * as React from "react";
import "./CreateInvoice.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSnackbar } from "notistack";
import axios from 'axios';


const CreateInvoice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    dueDate: "",
    name: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(()=>{
    if(!user.name){
      navigate('/')
    }
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user.name) {
      navigate("/");
    }
    const userinfo = {_id: user.email, username: user.name, invoice: formData};

    const { invoiceNumber, amount, dueDate, name,email, description } = formData;
    if (!invoiceNumber || !amount || !dueDate || !name || !email || !description) {
      enqueueSnackbar("All fields are required.", { variant: "error" });
      return;
    };

     try {
      const response = await axios.post('https://invoice-reminder.onrender.com/create-invoice', userinfo);
      if (response.status === 200) {
        enqueueSnackbar('Invoice sent successfully.', {variant: "success"});
      } else {
        enqueueSnackbar('Failed to create invoice.', {variant: 'error'});
      }
    } catch (error) {
      enqueueSnackbar('Failed to create invoice.', {variant: "success"});
    } finally {
      setIsLoading(false);
      setTimeout(() => {
      navigate('/');
    }, 2000);
    }


  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <button className="goback" type="button" onClick={goBack}>
        Back
      </button>

      <div className="form">
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Invoice Number:
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Amount:
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Due Date:
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          {!isLoading && <button type="submit">Submit</button>}
          {isLoading && <CircularProgress />}
        </form>
      </div>
    </>
  );
};

export default CreateInvoice;
