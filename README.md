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

The `build` script uses [esbuild](https://esbuild.github.io/) to bundle `App.js` while leaving `react` and `react-dom` as external dependencies.
