import React, { useState, useEffect, createContext } from "react";
import { Login } from "./views/login/login";
import Home from "./views/home/home";
const backendUrl = import.meta.env.VITE_BACKEND;

import About from "./components/About/about";
import Cart from "./components/Cart/Cart";
import Detail from "./components/Detail/Detail";
import Dashboard from "./views/admin/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import Checkout from "./components/Checkout/Checkout";

import { Route, Routes, Navigate } from "react-router-dom";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sesion = async () => {
    try {
      const data = await fetch(`${backendUrl}/user/protected`, {
        credentials: "include",
      });
      if (data.ok) {
        setUser(await data.json());
      } else {
        return;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    sesion(); // Llamada inicial a la sesión

    const handleBeforeUnload = () => sesion();
    const handleLoad = () => sesion();

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar sesion={sesion} onSearch={setSearchTerm} />
        <Routes>
          <Route
            path="/"
            element={<Home sesion={sesion} searchTerm={searchTerm} />}
          />
          {user ? (
            <>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </>
          ) : (
            <Route path="/cart" element={<Login sesion={sesion} />} />
          )}
          {user && user.rol === "Admin" ? (
            <Route path="/admin/*" element={<Dashboard />} />
          ) : (
            <Route path="/cart" element={<Navigate to="/login" />} />
          )}
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login sesion={sesion} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
