BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "CODE" (
    "codeID" INTEGER PRIMARY KEY,
    "codeType" TEXT NOT NULL,
    "codeValue" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "IDENTIFICATION" (
    "identificationID" INTEGER PRIMARY KEY,
    "identificationName" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "PAYER" (
    "payerID" INTEGER PRIMARY KEY AUTOINCREMENT,
    "idNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "postcode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "sector" TEXT,
    "muslimStaff" INTEGER,
    "ownershipPercentage" REAL,
    "PICName" TEXT,
    "PICEmail" TEXT,
    "PICPhoneNumber" TEXT,
    "profileID" INTEGER,
    "identificationID" INTEGER,
    "faxNumber"	TEXT,
	"website"	TEXT,
    FOREIGN KEY("profileID") REFERENCES "PROFILE"("profile_id")
);
CREATE TABLE IF NOT EXISTS "PROFILE" (
    "profile_id" INTEGER PRIMARY KEY,
    "profile_type" TEXT
);
CREATE TABLE IF NOT EXISTS "SPG" (
    "spgID" INTEGER PRIMARY KEY AUTOINCREMENT,
    "HeaderID" TEXT NOT NULL,
    "noCheque" TEXT NOT NULL,
    "bulanTahun" TEXT NOT NULL,
    "Amaun" REAL NOT NULL,
    "isSynced" INTEGER DEFAULT 0,
    "bankID" INTEGER,
    "MOPID" INTEGER,
    "payerID" INTEGER,
    FOREIGN KEY("payerID") REFERENCES "PAYER"("payerID")
);
CREATE TABLE IF NOT EXISTS "TRANSACTIONS" (
    "transactionID" INTEGER PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "chequeNo" TEXT,
    "referenceNo" TEXT,
    "isSynced" INTEGER DEFAULT 0,
    "payerID" INTEGER,
    "MOPID" INTEGER,
    "bankID" INTEGER,
    FOREIGN KEY("payerID") REFERENCES "PAYER"("payerID")
);
INSERT INTO "PROFILE" VALUES (1, 'individu');
INSERT INTO "PROFILE" VALUES (2, 'company');
COMMIT;
