# PixiTales-support

## Synchronise the privacy policy

`privacy.html` is generated from the `register.privacy` content in the PixiTales
app locale files. From this repository, run:

```powershell
node scripts/sync-privacy.js
```

You can optionally provide a locale directory and output filename:

```powershell
node scripts/sync-privacy.js ../pixitales-front/locales ./privacy.html
```
