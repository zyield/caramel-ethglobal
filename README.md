# Caramel decentralized ENS blogging

This dApp is self-contained and the only depedencies are Infura (for ipfs gateway)
and Alchemy for JSON-RPC calls.

You need to setup the following in your .env

```
REACT_APP_ALCHEMY_API_KEY=
REACT_APP_INFURA_USERNAME=
REACT_APP_INFURA_SECRET=

# kovan
REACT_APP_EPNS_CORE_ADDRESS_KOVAN=0x97d7c5f14b8fe94ef2b4ba589379f5ec992197da
REACT_APP_DAI_ADDRESS_KOVAN=0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD

# goerli
REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_GOERLI=0x4b1488b7a6b320d2d721406204abc3eeaa9ad329
REACT_APP_EPNS_CORE_ADDRESS_GOERLI=0xd4E3ceC407cD36d9e3767cD189ccCaFBF549202C
REACT_APP_DAI_ADDRESS_GOERLI=0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60

# mainnet
REACT_APP_ENS_PUBLIC_RESOLVER_ADDRESS_MAINNET=0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41
REACT_APP_EPNS_CORE_ADDRESS_MAINNET=0x66329Fdd4042928BfCAB60b179e1538D56eeeeeE
REACT_APP_DAI_ADDRESS_MAINNET=0x6B175474E89094C44Da98b954EedeAC495271d0F
```

The dApp is fully functional in Goerli, sans the .eth.limo | .eth.link access. The ENS domains 
in testnet are not resolved using those two services. Kovan, even though deprecated, is the only
test net available for EPNS. Note that ENS does not work in Kovan, we only used Kovan to test out
the EPNS implementation.

## Start the app

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
