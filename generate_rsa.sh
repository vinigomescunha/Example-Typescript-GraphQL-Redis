#!/bin/bash
# generate passphrase to rsa 
mkdir ./rsa/

# create payload word to rsa 
echo $(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 40) >> ./rsa/payload-word


openssl req \
    -newkey rsa:2048 \
    -new -nodes \
    -keyout ./rsa/private.pem \
    -subj "/C=BR/ST=Rio de Janeiro/L=Rio de Janeiro/O=Organization Unknown CO/CN=www.example.com" \
    -out ./rsa/certificate-request-csr.pem

openssl x509 -req \
    -days 365 \
    -in ./rsa/certificate-request-csr.pem \
    -signkey ./rsa/private.pem \
    -out ./rsa/public.crt
