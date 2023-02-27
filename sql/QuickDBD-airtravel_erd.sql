-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/KAWClO
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Airports" (
    "airport_name" VARCHAR(70)   NOT NULL,
    "city" VARCHAR(70)   NOT NULL,
    "country" VARCHAR(70)   NOT NULL,
    "airport_id" VARCHAR(10)   NOT NULL,
    "latitude" VARCHAR(20)   NOT NULL,
    "longitude" VARCHAR(20)   NOT NULL,
    "altitude" INTEGER   NOT NULL,
    CONSTRAINT "pk_Airports" PRIMARY KEY (
        "airport_id"
     )
);

CREATE TABLE "Airlines" (
    "airline_name" VARCHAR(70)   NOT NULL,
    "airline_id" VARCHAR(10)   NOT NULL,
    "origin_country" VARCHAR(70)   NOT NULL,
    "active" VARCHAR(5)   NOT NULL,
    CONSTRAINT "pk_Airlines" PRIMARY KEY (
        "airline_id"
     )
);

CREATE TABLE "Domestic Flights" (
    "id" INTEGER   NOT NULL,
    "date" DATE   NOT NULL,
    "airline_id" VARCHAR(10)   NOT NULL,
    "dep_airport" VARCHAR(10)   NOT NULL,
    "des_airport" VARCHAR(10)   NOT NULL,
    "total" INTEGER   NOT NULL,
    CONSTRAINT "pk_Domestic Flights" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "International Flights" (
    "id" INTEGER   NOT NULL,
    "date" DATE   NOT NULL,
    "airline_id" VARCHAR(10)   NOT NULL,
    "dep_airport" VARCHAR(10)   NOT NULL,
    "des_airport" VARCHAR(10)   NOT NULL,
    "total" INTEGER   NOT NULL,
    CONSTRAINT "pk_International Flights" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Flights_Airports" (
    "airline_id" INTEGER   NOT NULL,
    "dep_airport_id" VARCHAR(10)   NOT NULL,
    "des_airport_id" VARCHAR(10)   NOT NULL,
    "dep_name" VARCHAR(70),   NOT NULL,
    "dep_city" VARCHAR(70)   NOT NULL,
    "dep_country" VARCHAR(70)   NOT NULL,
    "dep_latitude" VARCHAR(20)   NOT NULL,
    "dep_longitude" VARCHAR(20)   NOT NULL,
    "total" INTEGER   NOT NULL,
    "des_name" VARCHAR(70)   NOT NULL,
    "des_city" VARCHAR(70)   NOT NULL,
    "des_country" VARCHAR(70)   NOT NULL,
    "airport_id" VARCHAR(10)   NOT NULL,
    "des_latitude" VARCHAR(20)   NOT NULL,
    "des_longitude" VARCHAR(20)   NOT NULL,
    "des_altitude" INTEGER   NOT NULL,
    "airline_name" VARCHAR(70)   NOT NULL,
    CONSTRAINT "pk_Flights_Airports" PRIMARY KEY (
        "airline_id","dep_airport_id","des_airport_id"
     )
);

CREATE TABLE "JFK Data" (
    "airline_name" VARCHAR(70)   NOT NULL,
    "ontime" INTEGER   NOT NULL,
    "late" INTEGER   NOT NULL,
    "very_late" INTEGER   NOT NULL,
    "cancelled" INTEGER   NOT NULL,
    CONSTRAINT "pk_JFK Data" PRIMARY KEY (
        "airline_name"
     )
);

ALTER TABLE "Domestic Flights" ADD CONSTRAINT "fk_Domestic Flights_airline_id" FOREIGN KEY("airline_id")
REFERENCES "Airlines" ("airline_id");

ALTER TABLE "Domestic Flights" ADD CONSTRAINT "fk_Domestic Flights_dep_airport" FOREIGN KEY("dep_airport")
REFERENCES "Airports" ("airport_id");

ALTER TABLE "Domestic Flights" ADD CONSTRAINT "fk_Domestic Flights_des_airport" FOREIGN KEY("des_airport")
REFERENCES "Airports" ("airport_id");

ALTER TABLE "International Flights" ADD CONSTRAINT "fk_International Flights_airline_id" FOREIGN KEY("airline_id")
REFERENCES "Airlines" ("airline_id");

ALTER TABLE "International Flights" ADD CONSTRAINT "fk_International Flights_dep_airport" FOREIGN KEY("dep_airport")
REFERENCES "Airports" ("airport_id");

ALTER TABLE "International Flights" ADD CONSTRAINT "fk_International Flights_des_airport" FOREIGN KEY("des_airport")
REFERENCES "Airports" ("airport_id");

