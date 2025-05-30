# Alauda Frontend Plugin Template

## Local Development Guide

1. Run `yarn install` to install dependencies.
2. Run `yarn nx serve deploy-instance` or `yarn nx serve service` to start the local development server for either the "UI plugin for deploying the Operator instance" or the "UI plugin for Operator functionality". The server runs on `localhost:5000`.
3. Navigate to the `alauda-fe` project directory and start the project that integrates the plugin. Once started, the product page will automatically load the plugin running on port 5000, allowing you to debug as needed.
4. Alternatively, you can open `http://localhost:5000` in your browser to debug the plugin page directly.

## Code Structure Explanation

1. The `apps/deploy-instance` and `apps/service` projects correspond to the UI plugins for the Operator instance deployment form and the functionality UI, respectively.
2. The plugin is built using the Webpack Module Federation mechanism. The `module-federation.config.js` file is used to configure the plugin module exports.
3. The `console-plugin.json` file configures how the ACP host project loads the plugin. Please refer to the corresponding version of the ACP documentation to see the supported plugin types and configuration properties.

## Building the Image

1. Run `yarn nx build deploy-instance` or `yarn nx build service` to compile the plugin code. The build output is located in `./dist/apps`.
2. Build the Docker image, and during the build, copy all contents from the `./dist/apps` directory to the `/frontend-plugins` directory in the image (you can use the `Dockerfile` provided in the repository).

## Configuring the Image in the Operator

- **Deployment Instance UI**  
  `cpaas.io/frontend-plugin-deploy-instance-image: <namespace/name:tag>`

- **Function UI**
  - Single: `cpaas.io/frontend-plugin-service-image: <namespace/name:tag>`
  - Multi-module: `cpaas.io/frontend-plugin-service-image-<subpath>: <namespace/name:tag>`

**Example**:

```yaml
metadata:
  annotations:
    cpaas.io/frontend-plugin-deploy-instance-image: frontend/plugin:v1.0.0
    cpaas.io/frontend-plugin-service-image: frontend/plugin:v1.0.0
```
