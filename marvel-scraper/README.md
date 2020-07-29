# Marvel-scraper

Process to scrap data from [Marvel-api](https://developer.marvel.com/).

## Installation

```bash
nvm i
npm install
```

## Configuration

Key | Default | Unit | Comment |
---: | --- | --- | --- |
`MONGO_URL` | mongodb://localhost:27017/marvel | `string` | marvel MongoDB Connection string
`MARVEL_API_URL` | http://gateway.marvel.com/v1/public/ | `string`| Url of the marvel api
`MARVEL_API_PRIVATE_KEY` | | `string` | the private key on marvel api
`MARVEL_API_PUBLIC_KEY` | | `string` | the public key on marvel api

## Run
```bash
npm start
```

## Tests

```bash
# Run the mocha tests only
npm run mocha

# Run the eslint only
npm run eslint

# Run the coverage without eslint
npm run mocha

# Run all the tests
npm test
```
