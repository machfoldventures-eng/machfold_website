# Machfold Ventures Website

This repository contains the localized, production-ready static assets for the Machfold Ventures website.

## Architectural Summary
- **No CDN Dependency**: All core dependencies, modules, fonts, and assets have been localized into `/assets` under appropriate category folders.
- **Dynamic Routing**: Built as an optimized Single Page Application utilizing hydrated React module preloads.
- **Formspree Endpoint**: The contact form is dynamically bound to `https://formspree.io` directly, stripping any third-party proof-of-work wrapping.
- **URL Suffix Rewriter**: Integrated clean URL rewriter in the document heads corrects browser history states for static environments.

## Deployment Details
- **Hosting Target**: Cloudflare Pages.
- **Supporting Configurations**:
  - `_headers`: Defines secure headers including CSP (Content-Security-Policy).
  - `_redirects`: Resolves Clean URLs and canonical domain settings.
  - `sitemap.xml` & `robots.txt`: Hand-crafted to accurately map the localized pages.
