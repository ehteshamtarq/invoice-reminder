import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./Component/Login/Login.jsx";
import Mainpage from "./Component/Mainpage/Mainpage.jsx";
import Loading from "./Component/Loading/Loading.jsx";
import CreateInvoice from "./Component/CreateInvoice/CreateInvoice.jsx";
import ViewInvoice from "./Component/ViewInvoice/ViewInvoice.jsx"

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <div >
      <BrowserRouter>
        {" "}
        <Routes>
          <Route
            path="/"
            element={
              isLoading ? (
                <Loading />
              ) : isAuthenticated ? (
                <Mainpage />
              ) : (
                <Login />
              )
            }
          />

          <Route path="/create-invoice" element={<CreateInvoice />} />

          <Route path="/invoice/:slug" element={<ViewInvoice />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
