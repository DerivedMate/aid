#!/usr/bin/env bash
openssl req -newkey rsa:2048 -days 3650 -x509 -nodes -keyout server.key -new -out server.crt -config ./openssl-cert.cnf -sha256