# Web App

This repository contains a small React single-page application that is deployed on GitHub Pages.

`bundle.js` is the compiled output from `App.js`. Whenever `App.js` changes you should rebuild the bundle:

```bash
npx esbuild App.js --bundle --outfile=bundle.js --format=esm --loader:.js=jsx
```

The site is served from the repository root. If you are using a custom domain, make sure the domain is listed in the `CNAME` file.
