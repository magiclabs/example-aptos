# example-aptos-react

An example app showing how to use Magic SDK + Aptos Extension

**System Requirements:**

- Make sure you are using node version 18+ . If you don't have node or have an old version, check out [NVM](https://github.com/nvm-sh/nvm)
- Install `yarn` if you don't have it already, see [this guide](https://classic.yarnpkg.com/lang/en/docs/install)

## Setup

Install the package dependencies with `yarn`

```bash
$ yarn install
```

Copy `/.env.example` into a new file called `/.env`, and get or create a Public Key on your [Magic Dashboard](https://dashboard.magic.link/).

```env
VITE_MAGIC_API_KEY=
```

> Please Note: The app must be a **Magic Auth** app, _not_ a Magic Connect App!

Finally, run `dev` to start the server, and open the site in your browser!

```bash
$ yarn dev
```
