create user aidclient with password 'toor' SUPERUSER;
create database aid owner aidclient; 
GRANT ALL PRIVILEGES ON DATABASE aid TO aidclient;