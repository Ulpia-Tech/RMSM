# Reltio Permissions Management

## Steps in order to start local client server:

1. npm install at client level (installing dependancies)
2. npm start (Open [http://localhost:3000](http://localhost:3000) to view it in the browser.)


### `npm test`

Runs all jest tests.
In order to test adapter verification process, simply create 2 folders "right-permissions-files"/"wrong-permissions-files" including sample json files.


### `npm run cypress:dev`

Opens cypress developer panel.
Note: you must have localhost instance running


### `npm run cypress`

Runs all cypress tests in a headless way, this might be integrated into CI/CD 


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Deployment configuration

When deploying the app on a server if the hosting isn't configured for React beforehand you need to add a .htaccess file with configuration to route all URLs to index.html in order to work with react-router. A .htaccess file is provided in the deployment folder.