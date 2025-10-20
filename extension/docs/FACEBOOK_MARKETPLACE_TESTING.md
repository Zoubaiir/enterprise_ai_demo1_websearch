Facebook Marketplace manual test checklist

1. Build the extension

   ```bash
   cd extension
   npm run build
   ```

2. Load unpacked extension in Chrome/Edge

   - Open chrome://extensions
   - Enable Developer mode
   - Load unpacked and select the `extension` folder (manifest.json at root)

3. Open a Marketplace listing page

   - Visit a Facebook Marketplace item URL, e.g. https://www.facebook.com/marketplace/item/...
   - The content script should run and attempt to extract data.

4. Observe extraction & evaluation

   - The page console (F12) should show logs like `Facebook extractor: sent listing for evaluation`.
   - The overlay inserted by the content script should appear (top-right) with verdict/score when evaluation completes.

5. Verify stored pre-extracted listing

   - In the extension background console or via the popup, inspect `chrome.storage.local.get('preextracted_listings')` and confirm the URL key exists and contains fields (title, price, images).

6. Troubleshooting

   - If nothing appears, open DevTools on the page and look for console errors from the content script.
   - Check the match patterns in manifest.json for facebook domains.
   - If UI changes on Facebook break selectors, adapt `facebook.extractor.ts` heuristics (prefer JSON-LD, then meta, then DOM queries).

Notes

- The extraction is best-effort and may miss fields depending on how Facebook renders the page for your account/region.
- We intentionally persist the pre-extracted listing to `chrome.storage.local` so the background pipeline can use it.

