# Changelog

## 0.2.0

- Reservation → **Get Summary**: bookings, nights, revenue, payout, average nightly rate, occupancy and cancellations for a period, grouped by month, listing or channel; **As Of** compares with what was on the books on the same day last year.
- Reservation → Accept Request, Decline Request, Create (direct, website or owner booking).
- New resources: Guest (get, search) and Payout (get many).
- Trigger: Payout Completed, Channel Degraded, Channel Sync Failed. Reservations now carry `listingName`.

## 0.1.0

- Repull node: reservations (get, get many), conversations (get many, get messages, send message), reviews (get many, reply), properties (get many), calendar (get, update). Cursor pagination with Return All.
- Repull Trigger: registers a Repull webhook on activation, verifies `X-Repull-Signature`, removes the webhook on deactivation.
