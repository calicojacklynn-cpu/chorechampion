'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
  type OnApproveData,
  type CreateSubscriptionActions
} from '@paypal/react-paypal-js';
import { useToast } from '@/hooks/use-toast';

const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID_HERE"; // IMPORTANT: Replace with your actual client ID

type PayPalButtonsProps = {
  onSubscriptionApproved: () => void;
  disabled?: boolean;
}

export function PayPalSubscribeButton({ onSubscriptionApproved, disabled = false }: PayPalButtonsProps) {
  const { toast } = useToast();

  if (disabled) {
    return (
       <div className="w-full h-10 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground opacity-50 cursor-not-allowed">
        Already Subscribed
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
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, intent: 'subscription', vault: true }}>
      <PayPalButtons
        style={{ layout: 'horizontal', label: 'subscribe', color: 'blue', shape: 'rect' }}
        disabled={disabled}
        createSubscription={async (data: Record<string, unknown>, actions: CreateSubscriptionActions) => {
          // IMPORTANT: This function should call your backend server.
          // Your server would then call the PayPal Subscriptions API to create a subscription.
          // https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
          // It must return the subscription ID.
          
          toast({
            title: "Creating Subscription...",
            description: "Connecting to backend... (This is a simulation)",
          });
          
          // --- SIMULATION ---
          // In a real app, you would make a fetch call here:
          // const response = await fetch('/api/paypal/create-subscription', { method: 'POST' });
          // const order = await response.json();
          // return order.id;

          // For now, we'll use a placeholder plan ID. This must be created in your PayPal developer dashboard.
          const planId = "YOUR_PAYPAL_PLAN_ID_HERE"; 
          if (planId === "YOUR_PAYPAL_PLAN_ID_HERE") {
             toast({
                variant: 'destructive',
                title: "PayPal Plan Not Configured",
                description: "A developer must set the PayPal Plan ID in PayPalButtons.tsx.",
            });
            // This will prevent the PayPal modal from opening
            return Promise.reject(new Error("PayPal Plan ID not configured."));
          }
          return actions.subscription.create({
            plan_id: planId
          });
        }}
        onApprove={async (data: OnApproveData) => {
          // IMPORTANT: This function is called after the user approves the payment on PayPal's site.
          // You should send the subscriptionID to your server to verify and activate the subscription.
          console.log('PayPal subscription approved:', data);

          // --- SIMULATION ---
          // In a real app, you would make a fetch call here:
          // await fetch('/api/paypal/approve-subscription', { 
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ subscriptionID: data.subscriptionID })
          // });
          
          onSubscriptionApproved(); // Update the UI state
          return Promise.resolve();
        }}
        onError={(err) => {
          console.error("PayPal button error:", err);
          toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "An error occurred. If you are developing, ensure your Client and Plan IDs are correct.",
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
