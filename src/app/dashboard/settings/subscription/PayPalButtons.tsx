'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
  type OnApproveData,
} from '@paypal/react-paypal-js';
import { useToast } from '@/hooks/use-toast';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useFirebaseApp } from '@/firebase';

// IMPORTANT: Replace with your actual client ID. This is for the frontend SDK.
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID_HERE"; 

type PayPalButtonsProps = {
  onPaymentApproved: () => void;
  disabled?: boolean;
}

export function PayPalUpgradeButton({ onPaymentApproved, disabled = false }: PayPalButtonsProps) {
  const { toast } = useToast();
  const app = useFirebaseApp();
  const functions = getFunctions(app);

  // References to our backend Cloud Functions
  const createPaypalOrder = httpsCallable(functions, 'createPaypalOrder');
  const capturePaypalOrder = httpsCallable(functions, 'capturePaypalOrder');

  if (disabled) {
    return (
       <div className="w-full h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground opacity-50 cursor-not-allowed">
        Already on Premium
      </div>
    );
  }

  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === "YOUR_PAYPAL_CLIENT_ID_HERE") {
    return (
        <div className="w-full h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground opacity-50 cursor-not-allowed">
            PayPal Not Configured
        </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, intent: 'capture' }}>
      <PayPalButtons
        style={{ layout: 'horizontal', label: 'buynow', color: 'blue', shape: 'rect' }}
        disabled={disabled}
        // This function is called when the user clicks the PayPal button.
        // It calls our secure backend Cloud Function to create the order.
        createOrder={async () => {
          toast({
            title: "Connecting to PayPal...",
            description: "Please wait while we create your secure order.",
          });
          try {
            const response: any = await createPaypalOrder();
            const orderId = response.data.orderId;
            if (!orderId) {
                throw new Error("Failed to get Order ID from server.");
            }
            return orderId;
          } catch (error: any) {
             toast({
              variant: "destructive",
              title: "Order Creation Failed",
              description: error.message || "Could not connect to the server. Please try again.",
            });
            // Re-throw to stop the PayPal flow
            throw error;
          }
        }}
        // This function is called after the user approves the payment on PayPal's site.
        // It calls our secure backend Cloud Function to "capture" the funds.
        onApprove={async (data: OnApproveData) => {
           toast({
            title: "Processing Payment...",
            description: "Please wait while we confirm your transaction.",
          });
          try {
            await capturePaypalOrder({ orderId: data.orderID });
            // The backend function updates the database. This call updates the UI.
            onPaymentApproved(); 
          } catch(error: any) {
            toast({
              variant: "destructive",
              title: "Payment Capture Failed",
              description: error.message || "There was an issue finalizing your payment.",
            });
             // Re-throw to inform PayPal of the failure
            throw error;
          }
        }}
        onError={(err) => {
          console.error("PayPal button error:", err);
          toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "An error occurred with PayPal. Please check the developer console.",
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
