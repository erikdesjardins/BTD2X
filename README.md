# BetterThanDesktop2x ![](/src/images/icon32.png)

Opinionated, small, fast extension for reddit.

## Goals

- No observable loading
  - pervasive use of `MutationObserver` (to inject UI before first paint)
  - native controls (right-click menu, etc.)
- Simplicity
  - minimal options
  - no cross-module dependencies
- Resilience to reddit (and subreddits) changing CSS or markup
  - no CSS / significant additional UI (use plaintext and native controls)
  - don't rely on URL for post type
  - don't rely on posts being available on load
  - don't rely on posts being made available in any consistent way
