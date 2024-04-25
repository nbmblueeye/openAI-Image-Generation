
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

type Props = {
  form:any,
  status: boolean,
  setShowPapal:(status:boolean) => void,
  setForm: (state:any) => void,
}

const PaypalModal = ({status, setShowPapal, setForm}:Props) => {

  const [feedback, setFeedback] = useState({
    message: "",
    error:"",
  });
 
  const createOrder = async() => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: {
              id: uuidv4(),
              value: "0.50",
              currencyCode: "USD"
            },
        }),
      });
      const orderData = await response.json();
      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);
      
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onApprove = async(data:any, actions:any) => {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      const orderData = await response.json();
      const errorDetail = orderData?.details?.[0];
      if(errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart();
      } else if(errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else if(!orderData.purchase_units) {
        throw new Error(JSON.stringify(orderData));
      } else {
        //const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0] || orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
        //console.log("Capture result", orderData, JSON.stringify(orderData, null, 2), );
        if(orderData.status == "COMPLETED"){
          setFeedback({...feedback, ...{message: "Thank you, Please go back to generate a Image", error:""}});
          setForm((prevState:any) => ({...prevState, paymentId:orderData.id}));
        }
      }
      } catch (error) {
        if(error){
          let err = JSON.stringify(error)
          setFeedback({...feedback, ...{message: "", err } });
        }
        console.error(error);
      }
  }
 

  return (
    <div className={`fixed left-0 right-0 top-0 bottom-0 bg-[#00000033] ${status ? "flex":"hidden"} justify-center items-center z-40`}>
      <div className="bg-white w-[500px] max-h-[95%] p-10 rounded z-50 relative block overflow-y-scroll">
        <button className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 absolute top-2 right-2" 
        onClick={() => {setShowPapal(false); setFeedback({ message: "", error:""});}}>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
        <p className='font-sans font-normal text-base mb-8'>
          You have to pay <span className='font-semibold text-lg text-blue-400'>0.5$</span> for each Image generation
        </p>
        {
          feedback.message &&
          <p className='font-sans font-normal text-base mb-8 text-green-400'>
            {feedback.message}
          </p>
        }
        {
          feedback.error &&
          <p className='font-sans font-normal text-base mb-8 text-red-400'>
            {feedback.error}
          </p>
        }
        <PayPalScriptProvider options={{clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID}}>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  )
}

export default PaypalModal
