#!/bin/bash
docker rm -f pg 2>/dev/null
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
sleep 5
docker exec pg createdb -U postgres booking
echo ""
echo "=== Checking status ==="
docker ps
