# example-aptos
An example app showing how to use Magic SDK + Aptos Extension

# Setup
Make sure you are using node version 14.18+ . If you don't have node or have an old version, check out [NVM](https://github.com/nvm-sh/nvm)

Install yarn if you don't have it already, see [this guide](https://classic.yarnpkg.com/lang/en/docs/install)

Install the package dependencies using `yarn install`

Copy `/.env.example` into a new file called `/.env`, and get or create a Public Key on your Magic Dashboard (https://dashboard.magic.link/). Please Note: The app must be a Magic Auth app, _not_ a Magic Connect App!

Finally, run `yarn dev` to start the server, and open the site in your browser!
