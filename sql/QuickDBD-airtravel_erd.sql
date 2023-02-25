-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/KAWClO
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Airlines" (
    "Name" VARCHAR(70)   NOT NULL,
    "IATA" VARCHAR(35)   NOT NULL,
    -- ^airline ID
    "ICAO" VARCHAR(35)   NOT NULL,
    -- Airline callsign letters
    "Callsign" VARCHAR(35)   NOT NULL,
    -- Airline Shorthand Name
    "Country" VARCHAR(35)   NOT NULL,
    -- Country of Origin as a company
    "Active" VARCHAR(10)   NOT NULL,
    CONSTRAINT "pk_Airlines" PRIMARY KEY (
        "Name"
     )
);

CREATE TABLE "Routes" (
    "Airline" VARCHAR(10)   NOT NULL,
    -- airline ID
    "Airline_ID" VARCHAR(10)   NOT NULL,
    -- openflight nonsense
    "Source_Airport" VARCHAR(10)   NOT NULL,
    -- departing Airport ID
    "Source_Airport_ID" VARCHAR(10)   NOT NULL,
    -- openflight nonsense
    "Destination_Airport" VARCHAR(10)   NOT NULL,
    -- destination Airport ID
    "Destination_Airport_ID" VARCHAR(10)   NOT NULL,
    -- openflight nonsense
    "Codeshare" VARCHAR(10)   NOT NULL,
    -- openflight nonsense
    "Stops" INTEGER   NOT NULL,
    -- 0 = direct
    "Equipment" VARCHAR(35)   NOT NULL
);

-- Plane types used on this route
CREATE TABLE "Airports" (
    "Name" VARCHAR(70)   NOT NULL,
    "City" VARCHAR(70)   NOT NULL,
    "Country" VARCHAR(35)   NOT NULL,
    "IATA" VARCHAR(35)   NOT NULL,
    -- Airport ID
    "ICAO" VARCHAR(35)   NOT NULL,
    -- Airport LongID
    "Latitude" FLOAT   NOT NULL,
    "Longitude" FLOAT   NOT NULL,
    "Altitude" FLOAT   NOT NULL,
    "Timezone" INTEGER   NOT NULL,
    -- Airport's offset form UTZ
    "DST" VARCHAR(10)   NOT NULL,
    -- Daylight savings time zone
    "Timezone2" VARCHAR(70)   NOT NULL,
    CONSTRAINT "pk_Airports" PRIMARY KEY (
        "Name"
     )
);

ALTER TABLE "Airlines" ADD CONSTRAINT "fk_Airlines_ICAO" FOREIGN KEY("ICAO")
REFERENCES "Airports" ("IATA");

ALTER TABLE "Routes" ADD CONSTRAINT "fk_Routes_Airline" FOREIGN KEY("Airline")
REFERENCES "Airlines" ("IATA");

ALTER TABLE "Routes" ADD CONSTRAINT "fk_Routes_Source_Airport" FOREIGN KEY("Source_Airport")
REFERENCES "Airports" ("IATA");

ALTER TABLE "Routes" ADD CONSTRAINT "fk_Routes_Destination_Airport" FOREIGN KEY("Destination_Airport")
REFERENCES "Airports" ("IATA");

