CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
/*
do $$
declare
  usr varchar := 'aidclient';
begin
*/
  -- Custom types
  create type bloodtype as enum (
    'A+' , 'A-' , 
    'B+' , 'B-' ,
    'AB+', 'AB-',
    'O+' , 'O-' 
  );

  -- Highlevel user structures
  create table if not exists supervisor (
    supervisor_id UUID default uuid_generate_v4(),
    email varchar(255) not null unique,
    password text not null,
    name varchar(255) not null,
    lastname varchar(255) not null,
    primary key (supervisor_id)
  );
  -- execute 'grant all privileges on table supervisor to "'||usr||'"';

  create table if not exists supervised (
    supervised_id UUID default uuid_generate_v4(),
    device_id UUID not null unique,
    auth text not null unique,
    primary key (supervised_id)
  );
  -- execute 'grant all privileges on table supervised to "'||usr||'"';

  create table if not exists supervision (
    supervision_id UUID default uuid_generate_v4(),
    supervisor_id UUID not null 
      references supervisor (supervisor_id) 
      on delete cascade,
    supervised_id UUID not null 
      references supervised (supervised_id) 
      on delete cascade,
    primary key (supervision_id),
    unique (supervisor_id, supervised_id)
  );
  -- execute 'grant all privileges on table supervision to "'||usr||'"';


  -- User-specific info
  create table if not exists medicine (
    medicine_id UUID default uuid_generate_v4(),
    supervised_id UUID not null
      references supervised (supervised_id) 
      on delete cascade,
    name varchar(255) not null,
    amount int default 1,
    unit varchar(255) default '',
    current boolean default true,
    primary key (medicine_id)
  );
  -- execute 'grant all privileges on table medicine to "'||usr||'"';

  create table if not exists take (
    take_id UUID default uuid_generate_v4(),
    medicine_id UUID not null
      references medicine (medicine_id) 
      on delete cascade,
    date timestamptz not null,
    primary key (take_id)
  );
  -- execute 'grant all privileges on table take to "'||usr||'"';

  create table if not exists info (
    info_id UUID default uuid_generate_v4(),
    supervised_id UUID not null unique
      references supervised (supervised_id) 
      on delete cascade,
    name varchar(255) not null,
    lastname varchar(255) not null,
    hc_number varchar(255) not null,
    blood_type bloodtype,
    primary key (info_id)
  );
  -- execute 'grant all privileges on table info to "'||usr||'"';

  create table if not exists add_info (
    add_info_id UUID primary key default uuid_generate_v4(),
    info_id UUID not null
      references info (info_id)
      on delete cascade,
    key varchar(255) not null,
    value varchar(255) not null
  );
  -- execute 'grant all privileges on table add_info to "'||usr||'"';

  create table if not exists position (
    position_id UUID default uuid_generate_v4(),
    supervised_id UUID not null unique
      references supervised (supervised_id) 
      on delete cascade,
    pos point,
    primary key (position_id)
  );
  -- execute 'grant all privileges on table position to "'||usr||'"';

  -- Session
  CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);

  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

  CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  -- execute 'grant all privileges on table "session" to "'||usr||'"';

-- end $$;
