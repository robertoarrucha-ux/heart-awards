# Security Specification for Latin American Leaders Awards

## 1. Data Invariants
- A `Partner` profile must be owned by the authenticated user.
- A `Coupon` must be linked to a valid `Partner`.
- `Votes` must be tied to a `Nominee` and an authenticated user.
- Only Admins can modify the `status` of a `Partner` or `Nominee` details.

## 2. The "Dirty Dozen" Payloads (Target: Partners)
1. **Identity Spoofing**: User A attempts to create a partner profile for User B.
2. **Privilege Escalation**: User attempts to set `status: 'active'` during creation.
3. **Shadow Field injection**: Adding `isAdmin: true` to the partner document.
4. **ID Poisoning**: Using a 2KB string as a partner ID.
5. **Timestamp Fraud**: Sending a client-side date instead of `serverTimestamp()`.
6. **Negative Counters**: Setting `clickCount: -100`.
7. **Type Mismatch**: Sending an array for `referralCode`.
8. **Orphaned Coupons**: Creating a coupon for a non-existent partner.
9. **Spam Registry**: Creating 10,000 partner profiles from one IP (Rate limiting - client side/rules).
10. **Admin Bypass**: Attempting to read all partner emails without being admin.
11. **Outcome Locking**: Attempting to change a `referralCode` after creation (Immutability).
12. **PII Leak**: Reading another user's PII without authorization.
