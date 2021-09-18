# CasualChat

[![Maintainability](https://api.codeclimate.com/v1/badges/d6159650fd2b10389860/maintainability)](https://codeclimate.com/github/Facebook-Developer-Circle-Moscow/CasualChat/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d6159650fd2b10389860/test_coverage)](https://codeclimate.com/github/Facebook-Developer-Circle-Moscow/CasualChat/test_coverage)
[![Build Status](https://travis-ci.com/Facebook-Developer-Circle-Moscow/CasualChat.svg?branch=main)](https://travis-ci.com/Facebook-Developer-Circle-Moscow/CasualChat)

## You should generate some data locally

### server.crt server.key
```
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
```

### docker-mongodb.yml

```yml
version: '3.8'
services:
  database:
    image: mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=
      - MONGO_INITDB_ROOT_PASSWORD=
    ports:
      - 27017:27017
    volumes:
      - mongodb:/data/db
volumes:
  mongodb:
```

### config/config.secret.json

```JavaScript
{
  "domain": "https://localhost:7602",
  "session": { // Secret for express session
    "secret": ""
  },
  "mongodb": { // Access keys for MongoDB from docker-mongodb.yml
    "host": "localhost:27017",
    "username": "",
    "password": "",
    "database": ""
  },
  "facebook": { // Access keys for Facebook API
    "clientID": "",
    "clientSecret": ""
  },
  "google": { // Access keys for Google API
    "key": "",
    "secret": ""
  },
  "twitter": { // Access keys for Twitter API
    "key": "",
    "secret": ""
  },
  "yandex": { // Access keys for Yandex API
    "clientID": "",
    "clientSecret": ""
  },
  "vk": { // Access keys for VK API
    "clientID": "",
    "clientSecret": ""
  },
  "github": { // Access keys for GitHub API
    "clientID": "",
    "clientSecret": ""
  }
}
```