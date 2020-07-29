# Marvel test

<!-- TOC depthFrom:2 depthTo:3 -->

- [Subject](#Subject)

<!-- /TOC -->

## Subject

Design a small web application that displays as a who's who all Marvel characters (picture + name).

Marvel provides an API that can be requested to get all the characters [here](https://developer.marvel.com/).

The complete list of characters can not be displayed on the same page, it will be necessary add pagination.

## Architecture

They are 3 components in this project:

1) A scrapper to collect data about Marvel characters and stock these data on a MongoDB database.
2) An REST api server which is an HTTP interface for data in the MongoDB database
3) A front application which used the api-server to display the who's who Marvel

There are more information in the README of each components.

## How to launch the project

### Launch Api et front

To launch the api and the front you can use the docker-compose file at this root directory.
```bash
docker-compose build
docker-compose up -d
```

### Launch the scraper to fill the database

```bash
(cd marvel-scraper && docker build -t marvel-scraper .)
docker container run -itd --network=`basename $PWD`_default -e MONGO_URL='mongodb://mongo:27017/marvel' -e MARVEL_API_PRIVATE_KEY='YOUR_PRIVATE_KEY' -e MARVEL_API_PUBLIC_KEY='YOUR_PUBLIC_KEY' marvel-scraper
```

### display

Go to [here](http://localhost:3000)
