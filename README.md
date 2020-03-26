Composer
========

[![Netlify Status](https://api.netlify.com/api/v1/badges/984c4ed0-0f4f-4380-bde2-6d83cf72e74d/deploy-status)](https://app.netlify.com/sites/composer/deploys)

# What is it?
A tool to create synced behaviours for robots and other programmable devices.

Here's you can do with the tool:

- [ ] Create sounds and actions with a timeline-based editor
- [ ] Add all the details about the pins and connections of a generic component,
with special care for _sounds_, _motors_ and _lights_.
- [ ] Generate a script of interpretable instructions for your device
- [ ] Generate code for Arduino (maybe)

# What tech is used?
It's (for now) a web app based on React, all client-side based. The website is deployed in CI with Netlify.

# Develop

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
