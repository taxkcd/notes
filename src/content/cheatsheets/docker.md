---
title: Docker Cheatsheet
date: 2025-11-14
---


## Docker Commands

### i. Basics

``` bash
# Listing and Managing Images
docker images
# Viewing Container Information
docker inspect network

# Opens an interactive bash session inside the `s1` container.
docker exec -it s1 bash

# Displays logs for the `nginx` container
docker logs nginx


# Disconnects the `s1` container from the `bridge` network.
docker network disconnect bridge s1

#Lists all available Docker networks.
docker network ls


# Displays the current hostname.
docker hostname     
# Shows the IP address of the current machine.
docker hostname -i  
# Sends an HTTP request to the `s1` container
curl http://s1  

```

### i. Building/Running
``` bash
# Builds a new Docker image from the Dockerfile in the current directory and names it nodeapp.
docker build . -t nodeapp            
# Runs the nodeapp2 container in detached mode, mapping port 8080 on the host to 8080 in the container.
docker run -p 8080:8080 -d nodeapp2                      
# Assigns the hostname testnode to the running container.
docker run -p 8081:8080 --hostname testnode -d nodeapp2  

#Runs an Apache HTTP server on port 80
docker run -p 80:80 -d httpd

# Runs the `nodeapp` container with the specified `APPID` environment variable.
docker run -p 3333:9999 -e APPID=3333 -d nodeapp

# ref: The Primagen Developer Productivity Course
# Runs a temporary `nvim-computer` container with root access
docker run --rm -it --user root nvim-computer bash
```
### iii. Stopping/Removing
```bash
# Lists all running Docker containers.
docker ps
#Stops containers with IDs `12` and `32`. Only the first two characters are needed.
docker stop 12 32
#Removes the specified stopped containers.
docker rm 12 32  

# Removes the `nodeapp` image
docker rmi nodeapp
# Forcefully removes the `nodeapp` image
docker rmi -f nodeapp`

```






### iv. Custom Network, Admin Rights
``` bash
# Runs a new container named `s1` on the `backend` network with admin rights (`NET_ADMIN` capability).
docker run --name s1 --network backend --cap-add=NET_ADMIN -d nhttpd

# Adds a rule to send all traffic in the network to `10.0.1.3`.
ip route add 10.0.0.0/24 via 10.0.1.3
```



## Resources

- [farhanashrafdev/TheUltimateDevOpsBible-ZeroToHero/cheatsheets/docker.md](https://github.com/farhanashrafdev/TheUltimateDevOpsBible-ZeroToHero/blob/main/CheatSheets/docker.md)