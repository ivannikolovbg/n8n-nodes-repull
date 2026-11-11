# n8n-nodes-repull

n8n nodes for [Repull](https://repull.dev): automate your **Airbnb, Booking.com and Vrbo** accounts (reservations, guest messages, reviews and calendars) through one API.

Repull connects to the host's **own** channel accounts through an official, hosted connect flow. It also works next to an existing property management system, so you can automate guest messaging without changing your setup.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Trigger](#trigger) · [Example workflows](#example-workflows) · [Resources](#resources)

## Installation

In n8n, go to **Settings → Community Nodes → Install** and enter `n8n-nodes-repull`.
See the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

1. Sign up at [repull.dev](https://repull.dev) (free plan, no credit card).
2. Connect your Airbnb, Booking.com or Vrbo account in the Repull dashboard.
3. Create an API key at [repull.dev/dashboard](https://repull.dev/dashboard).
4. In n8n, create a **Repull API** credential and paste the key. n8n tests it by listing your connections.

## Operations

| Resource | Operations |
|---|---|
| Reservation | Get, Get Many (filter by platform, status, listing, check-in dates, updated since), **Get Summary** (bookings, nights, revenue, payout, average nightly rate, occupancy and cancellations for a period; group by month, listing or channel; As Of for a like-for-like comparison with last year), Accept Request, Decline Request, Create (direct, website or owner booking) |
| Guest | Get, Get Many (search by name, email or phone) |
| Payout | Get Many (payouts and other channel transactions) |
| Conversation | Get Many, Get Messages, Send Message |
| Review | Get Many (filter by platform, listing, answered/unanswered), Reply |
| Property | Get Many |
| Calendar | Get (availability and nightly prices for a date range), Update (open/block dates, price, minimum/maximum nights) |

"Get Many" operations support **Return All**, which follows Repull's cursor pagination for you.

**Notes**
- **Send Message** goes out on the channel the conversation is on (Airbnb, Booking.com, Vrbo, email or website chat).
- **Review → Reply:** Airbnb review replies need a *full access* Airbnb connection; read-only and messaging connections can read reviews but not reply. Booking.com and Vrbo replies are in testing.
- **Calendar → Update** writes to Repull and pushes the change to every connected channel in the same step.

The Repull node can also be used as a tool by n8n's AI Agent.

## Trigger

**Repull Trigger** starts a workflow when something happens in your connected accounts:
reservation created, updated or cancelled; message received; review created or responded;
inquiry or booking request created; alteration requested; calendar updated; payout completed;
channel degraded or sync failed; account disconnected. Reservation events carry the listing name.

When you activate the workflow, the trigger registers a webhook with Repull. It verifies the
`X-Repull-Signature` HMAC on every delivery and rejects anything unsigned or older than 5 minutes.
Deactivating the workflow removes the webhook.

## Example workflows

**New Airbnb message → Slack**
Repull Trigger (*Message Received*) → Slack (*Send Message*: `{{ $json.data.from.name }}: {{ $json.data.body }}`).

**New reservation → Google Sheets**
Repull Trigger (*Reservation Created*) → Google Sheets (*Append Row*: guest name, check-in, check-out, platform, total).

**Review received → AI-drafted reply for approval**
Repull Trigger (*Review Created*) → AI Agent (draft a reply in your house style) → Slack/email for approval → Repull (*Review → Reply*).

## Compatibility

Tested with n8n 2.41.

## Resources

- [Repull API docs](https://repull.dev/docs)
- [Webhook event types](https://repull.dev/docs/webhook-event-types)
- [Verify webhook signatures](https://repull.dev/docs/verify-webhook-signatures)
- [n8n community nodes](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
