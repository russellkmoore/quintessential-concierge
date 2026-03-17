# Quintessential Concierge and Home Services

Single-page website running on Cloudflare Workers with a Resend-powered contact form.

## Project Structure

```
quintessential/
├── public/
│   ├── index.html    ← The full single-page site
│   └── logo.png      ← Brand logo
├── src/
│   └── index.js      ← Cloudflare Worker (contact form API)
├── wrangler.toml     ← Cloudflare config
└── package.json
```

## Setup & Deployment

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A [Cloudflare](https://dash.cloudflare.com/) account
- A [Resend](https://resend.com/) account with a verified sending domain

### 2. Install dependencies
```bash
npm install
```

### 3. Update configuration

Edit `wrangler.toml` and update:
- `CONTACT_EMAIL` → Nancy's email address (where inquiries are sent)
- `FROM_EMAIL` → The verified sender address in Resend

Edit `public/index.html` and update:
- Contact email, phone number, and service area in the contact section
- Footer copyright year if needed

### 4. Set the Resend API key as a secret
```bash
npx wrangler secret put RESEND_API_KEY
```
Paste the API key from Resend when prompted.

### 5. Local development
```bash
npm run dev
```
Visit `http://localhost:8787`

> **Note:** The contact form won't work locally unless you also set the RESEND_API_KEY in a `.dev.vars` file:
> ```
> RESEND_API_KEY=re_xxxxxxxxxxxx
> ```

### 6. Deploy
```bash
npm run deploy
```

### 7. Custom domain (optional)
In the Cloudflare dashboard, go to **Workers & Pages → quintessential-concierge → Settings → Domains & Routes** and add your custom domain.

## Customization Notes

- **Colors** are defined as CSS variables at the top of the HTML (`--navy`, `--gold`, etc.)
- **Services** can be added/removed by editing the service cards in the HTML
- **Fonts** are Playfair Display (headings) and Libre Franklin (body), loaded from Google Fonts
