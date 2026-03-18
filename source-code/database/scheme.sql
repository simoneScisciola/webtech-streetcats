DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION "tecweb-admin";


-- public.user_roles definition

-- Drop table

-- DROP TABLE public.user_roles;

CREATE TABLE public.user_roles (
	rolename varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (rolename)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	fk_rolename varchar(255) DEFAULT 'USER'::character varying NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (username)
);

-- public.users foreign keys

ALTER TABLE public.users ADD CONSTRAINT users_fk_rolename_fkey FOREIGN KEY (fk_rolename) REFERENCES public.user_roles(rolename) ON DELETE SET DEFAULT ON UPDATE CASCADE;


-- public.sightings definition

-- Drop table

-- DROP TABLE public.sightings;

CREATE TABLE public.sightings (
	id serial4 NOT NULL,
	photo_url varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	latitude numeric(8, 6) NOT NULL,
	longitude numeric(9, 6) NOT NULL,
	address varchar(255) NULL,
	fk_username varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT sightings_pkey PRIMARY KEY (id)
);

-- public.sightings foreign keys

ALTER TABLE public.sightings ADD CONSTRAINT sightings_fk_username_fkey FOREIGN KEY (fk_username) REFERENCES public.users(username) ON DELETE RESTRICT ON UPDATE CASCADE;


-- public."comments" definition

-- Drop table

-- DROP TABLE public."comments";

CREATE TABLE public."comments" (
	id serial4 NOT NULL,
	"content" text NOT NULL,
	fk_username varchar(255) NOT NULL,
	fk_sighting_id int4 NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id)
);

-- public."comments" foreign keys

ALTER TABLE public."comments" ADD CONSTRAINT comments_fk_sighting_id_fkey FOREIGN KEY (fk_sighting_id) REFERENCES public.sightings(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."comments" ADD CONSTRAINT comments_fk_username_fkey FOREIGN KEY (fk_username) REFERENCES public.users(username) ON DELETE CASCADE ON UPDATE CASCADE;