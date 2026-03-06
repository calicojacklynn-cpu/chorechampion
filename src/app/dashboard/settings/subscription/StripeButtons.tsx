'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useFirebaseApp } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// IMPORTANT: Replace with your actual publishable key.
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_STRIPE_KEY_HERE";

type StripeButtonsProps = {
  disabled?: boolean;
}

export function StripeUpgradeButton({ disabled = false }: StripeButtonsProps) {
  const { toast } = useToast();
  const app = useFirebaseApp();
  const functions = getFunctions(app);
  const [isLoading, setIsLoading] = useState(false);

  // Reference to our backend Cloud Function
  const createStripeCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');

  const handleUpgrade = async () => {
    if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY === "pk_test_YOUR_STRIPE_KEY_HERE") {
      toast({
        variant: "destructive",
        title: "Stripe Not Configured",
        description: "Please provide a valid Stripe publishable key in StripeButtons.tsx.",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Opening Checkout...",
      description: "Redirecting you to Stripe's secure payment page.",
    });

    try {
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error("Stripe failed to load.");

      // Call the backend function to create a checkout session
      const response: any = await createStripeCheckoutSession();
      const sessionId = response.data.sessionId;

      if (!sessionId) {
        throw new Error("Failed to create a checkout session from the server.");
      }

      // Redirect the user to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upgrade Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (disabled) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Already on Premium
      </Button>
    );
  }

  return (
    <Button 
      className="w-full" 
      onClick={handleUpgrade} 
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Upgrade to Premium"
      )}
    </Button>
  );
}
