import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <BrowserRouter>

            <AuthProvider>

                <App />

            </AuthProvider>

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />

        </BrowserRouter>

    </React.StrictMode>
);