# machfold_website

## Structure
```
machfold_website/
├── index.html           → machfold.in/          (Homepage)
├── contact-me/
│   └── index.html       → machfold.in/contact-me (Contact Page)
├── _redirects           → www.machfold.in → machfold.in (301)
├── wrangler.jsonc       → Cloudflare Pages config
├── robots.txt           → Search engine crawl rules
└── sitemap.xml          → Sitemap for Google indexing
```

## SEO Checklist
- [x] Google Analytics (G-V8S3KJ6M8V) on both pages
- [x] Canonical URLs set correctly on both pages
- [x] Open Graph + Twitter Card meta on both pages
- [x] Organization + ProfessionalService JSON-LD schema on homepage
- [x] ContactPage JSON-LD schema on contact page
- [x] robots.txt with sitemap reference
- [x] sitemap.xml submitted
- [x] www → machfold.in 301 redirect
- [x] robots meta tag with full indexing directives

## After Deploying — Do These
1. **Google Search Console** → https://search.google.com/search-console
   - Add property: machfold.in
   - Verify via the existing TXT record already in your DNS
   - Submit sitemap: https://machfold.in/sitemap.xml

2. **Google Business Profile** → https://business.google.com
   - Free listing, helps local/branded search

3. **Validate Schema** → https://search.google.com/test/rich-results
   - Paste machfold.in and confirm schemas are detected
