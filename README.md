# GitHub Pages Shop Template (Upgraded)

Files:
- index.html
- style.css
- script.js

## Quick deploy to GitHub Pages
1. Create a new GitHub repository.
2. Upload these files to the repository root.
3. In Settings → Pages set branch to `main` and folder `/ (root)`.
4. Your site will be available at `https://yourusername.github.io/repo-name`.

## Google Apps Script webhook (save orders to Google Sheet)
1. Create a new Google Sheet.
2. Extensions → Apps Script → paste this code and deploy as Web App (Execute as: Me, Who has access: Anyone):

```javascript
function doPost(e){
  var ss = SpreadsheetApp.openById("PASTE_SHEET_ID_HERE");
  var sheet = ss.getSheets()[0];
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.customer.name, data.customer.email, data.total, JSON.stringify(data)]);
  return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy → New deployment → Web app. Copy the Web App URL and paste into `ORDER_ENDPOINT` in `script.js`.

## Stripe Checkout (redirect)
1. In Stripe dashboard create a Payment Link (Test Mode).
2. Paste Payment Link URL into `STRIPE_PAYMENT_LINK` in `script.js`.
3. On checkout users will be redirected to Stripe Checkout.

## Notes
- This is a static demo. For production, use server-side order processing and secure payment integration.
- Customize `PRODUCTS` in `script.js` to add your items or load from an external JSON.

Enjoy!