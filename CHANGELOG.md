# Changelog

## 0.1.0

- Repull node: reservations (get, get many), conversations (get many, get messages, send message), reviews (get many, reply), properties (get many), calendar (get, update). Cursor pagination with Return All.
- Repull Trigger: registers a Repull webhook on activation, verifies `X-Repull-Signature`, removes the webhook on deactivation.
