-- Table: public."RSS"

-- DROP TABLE public."RSS";

CREATE TABLE public."RSS"
(
    no integer NOT NULL DEFAULT nextval('"RSS_no_seq"'::regclass),
    title character varying(100) COLLATE pg_catalog."default" NOT NULL,
    link character varying(200) COLLATE pg_catalog."default" NOT NULL,
    page character varying(200) COLLATE pg_catalog."default",
    category character varying(100) COLLATE pg_catalog."default",
    rss_episode character varying(10) COLLATE pg_catalog."default",
    rss_season character varying(10) COLLATE pg_catalog."default",
    rss_title character varying(100) COLLATE pg_catalog."default",
    rss_quality character varying(10) COLLATE pg_catalog."default",
    rss_release_group character varying(10) COLLATE pg_catalog."default",
    tvdb_id character varying(10) COLLATE pg_catalog."default",
    tvdb_series_name character varying(100) COLLATE pg_catalog."default",
    rss_en_name character varying(100) COLLATE pg_catalog."default",
    description character varying(500) COLLATE pg_catalog."default",
    create_dt timestamp without time zone DEFAULT now(),
    creator character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT "RSS_pkey" PRIMARY KEY (link)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."RSS"
    OWNER to postgres;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public."RSS" TO docker;

GRANT ALL ON TABLE public."RSS" TO postgres;
