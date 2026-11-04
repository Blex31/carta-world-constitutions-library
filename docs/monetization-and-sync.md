# Personal library, CARTA Plus and advertising

## Personal library

The Neon Function exposes `GET /api/library/me` and `POST /api/library/me`. It stores bookmarks, highlights, notes, saved documents and profile preferences. The account owner is derived from the verified Neon Auth JWT subject. A request-supplied owner ID is never trusted. The browser keeps local-first items while signed out and can merge older local records after sign-in.

## CARTA Plus

CARTA Plus uses Stripe subscriptions. The default displayed prices are editable examples: US$2.99 per month and US$24.99 per year. They are not confirmed launch prices. Before launch, confirm currency, taxes, pricing, refund rules, cancellation and consumer disclosures.

1. An authenticated account requests a Checkout URL from `POST /api/billing/checkout`.
2. Stripe Checkout metadata includes the CARTA Auth user ID and plan key.
3. The browser returns with a Checkout session ID; `GET /api/billing/verify` verifies that the session belongs to the current user, verifies completion/payment and retrieves the attached subscription.
4. `POST /api/billing/webhook` validates the Stripe signature and synchronises subscription changes.
5. `GET /api/billing/status` reports Plus only for a server-stored `active` or `trialing` subscription in the current test/live environment.
6. `POST /api/billing/portal` creates the Stripe Billing Portal session.

Do not grant Plus from local storage or a successful redirect alone. Test renewal, failed payment, cancellation, duplicate webhooks, refunds and portal flows before live launch. Stripe secret keys and webhook secrets must be stored only in the Neon Function's server environment.

## Advertising

Web ads are optional and disabled by default in `public/ad-config.json`. To enable them, obtain an approved AdSense publisher account, configure the publisher client ID and approved ad-slot IDs, update the privacy/consent disclosures and set `enabled=true`. The web component suppresses ad markup when the API reports an active Plus entitlement.

This AdSense component does not serve Android/iOS native ads. A native app needs a separate AdMob integration and platform-compliant billing/restore flows. CARTA Plus must be synchronised to a server-verified entitlement after verifying a native purchase with the relevant store.

## Secrets and launch

The frontend must never contain `DATABASE_URL`, `NEON_AI_GATEWAY_TOKEN`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET`. Use the Neon Function's environment configuration and the host's secret management. See `.env.example` for variable names only.
