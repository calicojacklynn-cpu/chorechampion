'use client';

import { Button } from '@/components/ui/button';

// Direct link for the five child upgrade provided by the user
const UPGRADE_URL = "https://buy.stripe.com/4gM14p8XV0R30hs2Hg7Re00";

type StripeButtonsProps = {
  disabled?: boolean;
}

export function StripeUpgradeButton({ disabled = false }: StripeButtonsProps) {
  const handleUpgrade = () => {
    // Redirect directly to the Stripe checkout link
    window.location.href = UPGRADE_URL;
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
    >
      Upgrade to Premium
    </Button>
  );
}
