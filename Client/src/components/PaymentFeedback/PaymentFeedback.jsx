import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
import OrderDetailsPageUser from "../UserOrder/UserOrder";

const backendUrl = import.meta.env.VITE_BACKEND;

const PaymentFeedback = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [feedback, setFeedback] = useState(null);

  const params = new URLSearchParams(location.search);
  const collectionStatus = params.get("collection_status");
  const totalPrice = params.get("totalPrice");
  const paymentId = params.get("payment_id");
  useEffect(() => {
    const fetchFeedback = async () => {
      if (collectionStatus === "approved") {
        try {
          const response = await axios.get(
            `${backendUrl}/user/feedBack?userId=${user.id}&totalPrice=${totalPrice}`
          );
          setFeedback(response.data);
        } catch (error) {
          console.error("Error al obtener feedback del pago:", error.message);
        }
      }
    };

    fetchFeedback();
  }, [collectionStatus, totalPrice, user?.id, backendUrl]);

  return (
    <div>
      {feedback ? (
        <div>
          <h1>Estado del Pago: {feedback.status}</h1>
          <p>ID de Pago: {paymentId}</p>
          <p>ID de Orden: {feedback.order.id}</p>
          {console.log(feedback.order.id)}
          <OrderDetailsPageUser props={feedback.order.id} />
        </div>
      ) : (
        <p>Cargando feedback del pago...</p>
      )}
    </div>
  );
};

export default PaymentFeedback;
