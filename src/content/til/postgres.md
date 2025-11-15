---
title: Docker error
date: 2025-11-12
---

## Issue


I was running a simple PostgreSQL setup using Docker Compose but it kept failing when I try to connect with it. 


``` dockerfile
version: '3.8'
services:
  postgres:
    image: postgres:13.5
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres:

```

``` bash
psql postgres://user:password@localhost:5432/postgres
psql: error: connection to server at "localhost" (::1), port 5432 failed: 
FATAL:  role "user" does not exist

```



At first glance, it looked like a misconfigured user or missing database.
But the real issue was that Docker wasn't actually serving the Postgres container on port 5432, because that port was already in use.

Listing all Postgres processes revealed that a local Postgres instance (installed via Homebrew) was already running

``` bash
ps aux | grep postgres
mycomputer         543   0.0  0.0 34442648    752   ??  S    Mon06PM   0:00.40 /usr/local/opt/postgresql@14/bin/postgres -D /usr/local/var/postgresql@14
```


So every time I ran psql, I was connecting to the host’s Postgres (v14) instead of the container’s Postgres (v13.5).

## Fix

I simply stopped the local Postgres service:

``` bash
brew services stop postgresql@14
docker-compose down --volumes && docker-compose up

```


This time, the container successfully bound to port 5432, and the connection worked as expected.



If another Postgres instance is already running, stop it or map your container to a different port (e.g., 5433:5432).