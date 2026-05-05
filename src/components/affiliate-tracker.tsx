'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackReferralAction } from '@/app/actions';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    const coupon = searchParams.get('coupon');

    if (ref) {
      localStorage.setItem('affiliate_ref', ref);
      console.log('Affiliate referral tracked:', ref);
      
      // Track click in database
      const lastTracked = sessionStorage.getItem(`tracked_${ref}`);
      if (!lastTracked) {
        trackReferralAction(ref).then(res => {
          if (res.success) sessionStorage.setItem(`tracked_${ref}`, 'true');
        });
      }
    }

    if (coupon) {
      localStorage.setItem('applied_coupon', coupon);
      console.log('Coupon tracked:', coupon);
    }
  }, [searchParams]);

  return null;
}
