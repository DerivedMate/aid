sudo -u postgres psql < server/database/drop.sql 
sudo -u postgres psql < server/database/mnt.sql   
sudo -u postgres psql aid < server/database/create.sql
sudo -u postgres psql aid < server/database/mock/insert-mock.psql 