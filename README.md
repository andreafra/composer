Composer
========

[![Netlify Status](https://api.netlify.com/api/v1/badges/984c4ed0-0f4f-4380-bde2-6d83cf72e74d/deploy-status)](https://app.netlify.com/sites/composer/deploys)

# What is it?
A tool to create synchronized behaviours for robots and other programmable devices, using a visual timeline-based editor.
You can see a live version of it at [composer.netlify.app](https://composer.netlify.app).

Here's you can do with the tool:

- [x] Create sounds and actions with a timeline-based editor
- [x] Tune the details about the pins and connections of a generic component,
such as _speakers_, _motors_ and _lights_.
- [x] Generate a JSON of your sequence.
- [x] Generate an Arduino Sketch

# What tech is used?
It's a web app based on React + Redux, all client-side based. The website is deployed in CI with Netlify.

# Develop

## Available Scripts

In order to compile this project, you need to install [NodeJS](https://nodejs.org) and [Yarn](https://yarnpkg.com/getting-started/install).

Then clone this directory with:

`git clone https://github.com/QUB3X/project-composer.git`

and

`cd project-composer`

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
