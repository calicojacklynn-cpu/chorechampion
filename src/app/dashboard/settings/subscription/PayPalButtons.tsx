'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
  type OnApproveData,
  type CreateOrderActions,
  type OnApproveActions,
} from '@paypal/react-paypal-js';
import { useToast } from '@/hooks/use-toast';

const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID_HERE"; // IMPORTANT: Replace with your actual client ID

type PayPalButtonsProps = {
  onPaymentApproved: () => void;
  disabled?: boolean;
}

export function PayPalUpgradeButton({ onPaymentApproved, disabled = false }: PayPalButtonsProps) {
  const { toast } = useToast();

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
        createOrder={async (data: Record<string, unknown>, actions: CreateOrderActions) => {
          // IMPORTANT: This function can call your backend server to create an order.
          // Your server would then call the PayPal Orders API.
          // https://developer.paypal.com/docs/api/orders/v2/#orders_create
          // For this simulation, we'll create the order on the client side.
          
          toast({
            title: "Creating Order...",
            description: "Please complete the payment in the PayPal window.",
          });

          const order = await actions.order.create({
            purchase_units: [
              {
                description: 'Chore Champion Premium Plan (One-Time Payment)',
                amount: {
                  value: '4.99', // The price for the one-time upgrade
                  currency_code: 'USD',
                },
              },
            ],
          });
          return order; // Return the order ID
        }}
        onApprove={async (data: OnApproveData, actions: OnApproveActions) => {
          // IMPORTANT: This function is called after the user approves the payment on PayPal's site.
          // You should capture the transaction and send the orderID to your server for verification.
          console.log('PayPal payment approved. Order ID:', data.orderID);

          // --- SIMULATION ---
          // In a real app, you would make a fetch call here to capture the payment:
          // await fetch('/api/paypal/capture-order', { 
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ orderID: data.orderID })
          // });
          
          onPaymentApproved(); // Update the UI state
          return Promise.resolve();
        }}
        onError={(err) => {
          console.error("PayPal button error:", err);
          toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "An error occurred. If you are a developer, please check your Client ID.",
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
