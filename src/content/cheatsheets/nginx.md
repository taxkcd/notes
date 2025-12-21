
---
title: Nginx Cheatsheet
date: 2025-11-14
---


``` bash
# Run your local app with NGINX:
docker run --name nginx --hostname ng1 -p 80:80 \
    -v /Users/mycomputer/Desktop/dev/my_repos/Web-Development/html:/usr/share/nginx/html \
    -d nginx


# run three docker apps and start nginx
docker run --hostname nodeapp1 --name nodeapp1 -d nodeapp2
docker run --hostname nodeapp3 --name nodeapp3 -d nodeapp2
docker run --hostname nodeapp2 --name nodeapp2 -d nodeapp2
docker run --name nginx --hostname ng1 -p 80:8080 -v /Users/mycomputer/dev/nginx/nginx.conf:/etc/nginx/nginx.conf nginx


#create a network    
docker network connect backendnet nodeapp1
docker network connect backendnet nodeapp2
docker network connect backendnet nodeapp3
docker network connect backendnet nginx

# run load balance
docker run -p 2222:9999 -e APPID=2222  -d nodeapp
docker run -p 3333:9999 -e APPID=3333  -d nodeapp
docker run -p 4444:9999 -e APPID=4444  -d nodeapp
docker run -p 5555:9999 -e APPID=5555  -d nodeapp

# stop and start nginx
nginx -s stop
nginx

# reload nginx
nginx -s reload

```