#!/bin/sh

openssl genrsa -out https-key.pem 2048
openssl req -new -key https-key.pem -out https.csr
openssl x509 -req -in https.csr -signkey https-key.pem -out https-cert.pem
