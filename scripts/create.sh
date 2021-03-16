#!/usr/bin/env bash
openssl genrsa -out rootCA.key 2048
openssl req -new -days 3650 -key rootCA.key -out rootCA.pem -config openssl-ca.cnf
openssl x509 -req -days 3650 -in rootCA.pem -signkey rootCA.key -out rootCA.crt -extfile v3-ca.ext