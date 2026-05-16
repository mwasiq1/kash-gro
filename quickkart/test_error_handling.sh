#!/bin/bash
echo "B14 Malformed JSON"
curl -s -i -X POST -H "Content-Type: application/json" -d '{malformed json' http://localhost:4000/api/v1/orders
echo -e "\n\nB15 Missing required fields (empty JSON)"
curl -s -i -X POST -H "Content-Type: application/json" -d '{}' http://localhost:4000/api/v1/orders
echo -e "\n\nB16 Unauthorized request"
# well actually orders requires auth, so empty json might trigger 401 first
# Let's test admin products
curl -s -i -X POST -H "Content-Type: application/json" -d '{}' http://localhost:4000/api/v1/admin/products
echo -e "\n\nB17 Empty body"
curl -s -i -X POST -H "Content-Type: application/json" -d '' http://localhost:4000/api/v1/orders
