import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

const PayPalButton = ({amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{"client-id" : import.meta.env.VITE_PAYPAL_CLIENT_ID,
       currency: "USD",
       intent: "capture"
    }}>
        
        <PayPalButtons style={{layout: "vertical"}}
        createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units: [
                  {
                    amount: 
                    {
                      currency_code: "USD",
                      value: parseFloat(amount).toFixed(2)
                      
                    }
                  }
                ]
            })
        }}
        onApprove={(data, actions) => {
          console.log("PayPal Order ID:", data.orderID);
            return actions.order.capture().then(onSuccess)
        }}
        onError={onError} />
        </PayPalScriptProvider>
  )
}

export default PayPalButton