# Marvel-scraper

REST API to expose Marvel characters.

## Installation

```bash
nvm i
npm install
```

## API
### Auth
All endpoints under /api are protected with a token

### Endpoints
#### characters
This is the endpoint to get Marvel characters
query params:

Name | Description | Required | Default value |
---: | --- | --- | --- |
offset | number of skipped results | false | 0 |
limit  | result limit  | false | 20 |
picture_size  | size of the picture [small, medium, large, xlarge]  | false | xlarg


## Configuration

Key | Default | Unit | Comment |
---: | --- | --- | --- |
`PORT` | 8080 |  | Configuration path
`AUTHORIZED_TOKENS` | `dummy` |  | Authorized tokens for this service
`MONGO_URL` | 'mongodb://localhost:27017/marvel' | `string` | marvel MongoDB Connection string


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
