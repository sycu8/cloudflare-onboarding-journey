# Content health

This file is a stub from the trust-and-privacy change. It is not the full owner / last-reviewed report from phase 6.

## Changed in this pass

- `/plans` and `/enterprise` no longer repeat a non-public matrix.
- `/status` shows live official incidents or an explicit failure message.
- Khmer views show an AI-translation notice.
- Personal name and phone numbers are gone from public copy. `npm run test:trust` checks that they stay gone.

## Still open

- Most lessons do not have an owner role or a `lastReviewed` date.
- Tutorial sync is still a manual script, not a schedule.
- Vietnamese QA rules from phase 5 are not wired into CI.
- Fact checks against an entitlements file are not wired into CI.

TODO(verify): Khmer notice wording, public contact mailbox, tutorial licence. See `REVIEW_NEEDED.md`.
