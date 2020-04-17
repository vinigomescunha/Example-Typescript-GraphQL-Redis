

# Example RSA Encrypted as Bearer Graphql Redis Nodejs

verifying private rsa as bearer token

Nodejs - https://nodejs.org/
Redis - https://redis.io/
Docker Redis - https://hub.docker.com/r/bitnami/redis/
Graphql - https://www.npmjs.com/package/graphql
Typescript - https://www.typescriptlang.org/

# Dependencies
```
├── Docker
├── Docker Compose
├── Make
├── Nodejs
```

# How To

1. verify dependencies to install

2. make install

3. make test

# Structure

 ```
├── docker-compose.yaml - Docker Compose definitions @see https://docs.docker.com/compose/
├── Dockerfile - Docker build nodejs @see https://docs.docker.com/engine/reference/builder/
├── generate_rsa.sh - generate rsa keygens
├── Makefile - make target @see https://www.gnu.org/software/make/
├── node-docker - node on docker instance
│   ├── package.json - @see https://docs.npmjs.com/files/package.json
│   ├── Databases 
│   ├── Middleware 
│   ├── src 
│   │   └── index.ts
│   └── tsconfig.json - @see https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
├── node-test - node to run test
│   ├── package.json - npm @see https://docs.npmjs.com/files/package.json
│   ├── src
│   │   └── request.ts
│   └── tsconfig.json - @see https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
├── README.md
├── redis-data - folder with redis data will generated by generate_rsa.sh
└── rsa - folder to rsa certificate will generated by generate_rsa.sh
```

# help

Redis Commands:

https://redis.io/commands

Docker Compose review:

https://docs.docker.com/compose/reference/overview/

Make manual:

https://www.gnu.org/software/make/manual/

