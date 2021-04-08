create user aidclient with password 'toor' CREATEDB;
create database aid owner aidclient; 
GRANT ALL PRIVILEGES ON DATABASE aid TO aidclient;