#!/bin/bash
echo "B1 /health"
curl -s http://localhost:4000/health
echo -e "\nB2 /api/v1/products length"
curl -s http://localhost:4000/api/v1/products | jq '.data | length'
echo -e "\nB3 /api/v1/categories length"
curl -s http://localhost:4000/api/v1/categories | jq '.data | length'
echo -e "\nB4 /api/v1/banners length"
curl -s http://localhost:4000/api/v1/banners | jq '.data | length'
echo -e "\nB5 products?search=milk length"
curl -s "http://localhost:4000/api/v1/products?search=milk" | jq '.data | length'
echo -e "\nB6 products?search=xyz123 empty array"
curl -s "http://localhost:4000/api/v1/products?search=xyz123" | jq '.'
echo -e "\nB8 /products/fake123"
curl -s http://localhost:4000/api/v1/products/fake123 | jq '.'
