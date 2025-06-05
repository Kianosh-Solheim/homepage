# Web App Homepage

To build the project locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the bundle:
   ```bash
   npm run build
   ```

3. Start a local server (required for module scripts):
   ```bash
   npm start
   ```

   Then open [http://localhost:8080](http://localhost:8080) in your browser.

Opening `index.html` directly with the `file://` protocol may result in a blank
page because browsers restrict module loading from local files.

The `build` script uses [esbuild](https://esbuild.github.io/) to bundle `App.js` while leaving `react` and `react-dom` as external dependencies.

## Deploying to GitHub Pages

1. Build the project and commit the `bundle.js`, `index.html`, and `CNAME` files.
2. Push the repository to GitHub.
3. In the repository Settings > Pages, select **Deploy from a branch** and choose the `gh-pages` branch (root) as the source. Then save the settings.
4. Add `solheim.online` as the custom domain in the same Pages settings. GitHub will automatically create the `CNAME` file if it does not exist.
5. Update your DNS provider to point the domain to GitHub Pages by adding A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
6. Optionally, enable the included GitHub Actions workflow to automatically build and deploy the site to the `gh-pages` branch whenever you push to `main`. Keep the Pages source set to **Deploy from a branch** (not "GitHub Actions") so GitHub does not trigger its built-in deployment workflow.
3. In the repository Settings > Pages, choose the `main` branch (root) as the source and save.
4. Add `solheim.online` as the custom domain in the same Pages settings. GitHub will automatically create the `CNAME` file if it does not exist.
5. Update your DNS provider to point the domain to GitHub Pages by adding A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
6. Optionally, enable the included GitHub Actions workflow to automatically build and deploy the site whenever you push to `main`.

After DNS changes propagate, visiting [https://solheim.online](https://solheim.online) should load the site.
