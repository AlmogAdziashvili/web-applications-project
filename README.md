## Requirements

* Operating System: MacOS or Linux
* [Node.js](https://nodejs.org/) (I recommend installing with [NVM](https://github.com/nvm-sh/nvm))
* [Homebrew](https://brew.sh) (to install MongoDB)

## Quick Start

#### Setup

```bash
npm install

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
```

Start the database
```bash
brew services start mongodb-community
```

#### for Development

Start the client
```bash
npm run start:client
```

Start the server
```bash
npm run start:server
```

Or run client and server together
```bash
npm start
```

#### for Production

```bash
npm run build
npm start:server
```