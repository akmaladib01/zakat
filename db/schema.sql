BEGIN TRANSACTION;

-- Create the CODE table
CREATE TABLE IF NOT EXISTS "CODE" (
	"codeID"	INTEGER PRIMARY KEY,
	"codeType"	TEXT NOT NULL,
	"codeValue"	TEXT NOT NULL
);

-- Create the PROFILE table
CREATE TABLE IF NOT EXISTS "PROFILE" (
	"profile_id"	INTEGER PRIMARY KEY,
	"profile_type"	TEXT NOT NULL
);

-- Create the PAYER table
CREATE TABLE IF NOT EXISTS "PAYER" (
	"payerID"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"idNumber"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"address1"	TEXT,
	"address2"	TEXT,
	"postcode"	TEXT,
	"city"	TEXT,
	"state"	TEXT,
	"phoneNumber"	TEXT,
	"faxNumber"	TEXT,
	"website"	TEXT,
	"email"	TEXT,
	"sector"	TEXT,
	"muslimStaff"	INTEGER,
	"ownershipPercentage"	REAL,
	"PICName"	TEXT,
	"PICEmail"	TEXT,
	"PICPhoneNumber"	TEXT,
	"profileID"	INTEGER,
	"identificationID"	INTEGER,
	"syncStat"	INTEGER,
	FOREIGN KEY("profileID") REFERENCES "PROFILE"("profile_id")
	
);

-- Create the SPG table
CREATE TABLE IF NOT EXISTS "SPG" (
	"spgID"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"HeaderID"	TEXT NOT NULL,
	"noCheque"	TEXT NOT NULL,
	"bulanTahun"	TEXT NOT NULL,
	"Amaun"	REAL NOT NULL,
	"isSynced"	INTEGER DEFAULT 0,
	"bankID"	INTEGER,
	"MOPID" INTEGER,
	"payerID"	INTEGER,
	FOREIGN KEY("bankID") REFERENCES "CODE"("codeID"),
	FOREIGN KEY("payerID") REFERENCES "PAYER"("payerID")
);

-- Create the TRANSACTIONS table
CREATE TABLE IF NOT EXISTS "TRANSACTIONS" (
	"transactionID"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"totalAmount"	REAL NOT NULL,
	"chequeNo"	TEXT,
	"referenceNo"	TEXT,
	"isSynced"	INTEGER DEFAULT 0,
	"payerID"	INTEGER,
	"MOP"	TEXT,
	"bankID"	INTEGER,
	FOREIGN KEY("payerID") REFERENCES "PAYER"("payerID"),
	FOREIGN KEY("bankID") REFERENCES "CODE"("codeID")
);

-- Create the TRANSACTION_ZAKAT table
CREATE TABLE IF NOT EXISTS "TRANSACTION_ZAKAT" (
	"transzakatID"	INTEGER PRIMARY KEY,
	"zakatID"	INTEGER,
    "amount"    REAL,
	"transactionID"	INTEGER,
	FOREIGN KEY("transactionID") REFERENCES "TRANSACTIONS"("transactionID"),
	FOREIGN KEY("zakatID") REFERENCES "CODE"("codeID")
);

-- Create the USER table
CREATE TABLE IF NOT EXISTS "USER" (
	"userID"	INTEGER PRIMARY KEY,
	"domainEmail"	TEXT,
    "fullname"    TEXT,
	"phone_number"	TEXT
);

-- Create the SESSION table
CREATE TABLE IF NOT EXISTS "SESSION" (
	"sessionID"	INTEGER PRIMARY KEY,
    "hostname"    TEXT,
	"ip_address"	TEXT,
	"date"	DATE,
	"clock_in"	TIMESTAMP,
	"clock_out"	TIMESTAMP,
	"sessionStat"	TEXT,
	"userID"	INTEGER,
	FOREIGN KEY("userID") REFERENCES "USER"("userID")

);

-- Insert data into CODE table
INSERT OR IGNORE INTO "CODE" (codeID, codeType, codeValue) VALUES
-- Bank Codes
(1, 'B', 'AFFIN BANK BERHAD'),
(2, 'B', 'AFFIN ISLAMIC BANK BERHAD'),
(3, 'B', 'AL RAJHI BANKING & INVESTMENT CORPORATION MALAYSIA BERHAD'),
(4, 'B', 'ALLIANCE BANK MALAYSIA BERHAD'),
(5, 'B', 'ALLIANCE ISLAMIC BANK BERHAD'),
(6, 'B', 'AMBANK (M) BERHAD'),
(7, 'B', 'AMBANK ISLAMIC BERHAD'),
(8, 'B', 'BANGKOK BANK BERHAD'),
(9, 'B', 'BANK ISLAM MALAYSIA BERHAD'),
(10, 'B', 'BANK KERJASAMA RAKYAT MALAYSIA BERHAD (BANK RAKYAT)'),
(11, 'B', 'BANK MUAMALAT MALAYSIA BERHAD (BMMB)'),
(12, 'B', 'BANK NEGARA INDONESIA (BNI)'),
(13, 'B', 'BANK OF AMERICA MALAYSIA BERHAD'),
(14, 'B', 'BANK OF CHINA (MALAYSIA) BERHAD'),
(15, 'B', 'BANK PEMBANGUNAN MALAYSIA BERHAD'),
(16, 'B', 'BANK SIMPANAN NASIONAL'),
(17, 'B', 'BNP PARIBAS MALAYSIA BERHAD'),
(18, 'B', 'CHINA CONSTRUCTION BANK (MALAYSIA) BERHAD'),
(19, 'B', 'CIMB BANK BERHAD'),
(20, 'B', 'CIMB ISLAMIC BANK BERHAD'),
(21, 'B', 'CITIBANK BERHAD'),
(22, 'B', 'DEUTSCHE BANK (MALAYSIA) BERHAD'),
(23, 'B', 'HONG LEONG BANK BERHAD'),
(24, 'B', 'HONG LEONG ISLAMIC BANK BERHAD'),
(25, 'B', 'HSBC BANK MALAYSIA BERHAD'),
(26, 'B', 'INDUSTRIAL & COMMERCIAL BANK OF CHINA (MALAYSIA) BERHAD'),
(27, 'B', 'J.P. MORGAN CHASE BANK BERHAD (JPMO)'),
(28, 'B', 'KUWAIT FINANCE HOUSE (MALAYSIA) BERHAD'),
(29, 'B', 'MALAYAN BANKING BERHAD'),
(30, 'B', 'MAYBANK ISLAMIC BERHAD'),
(31, 'B', 'MBSB BANK BERHAD'),
(32, 'B', 'MIZUHO BANK (MALAYSIA) BERHAD'),
(33, 'B', 'MUFG BANK (MALAYSIA) BERHAD'),
(34, 'B', 'OCBC AL-AMIN BANK BERHAD'),
(35, 'B', 'OCBC BANK (MALAYSIA) BERHAD'),
(36, 'B', 'PUBLIC BANK BERHAD'),
(37, 'B', 'PUBLIC ISLAMIC BANK BERHAD'),
(38, 'B', 'RHB BANK BERHAD'),
(39, 'B', 'RHB ISLAMIC BANK BERHAD'),
(40, 'B', 'ROYAL BANK OF SCOTLAND'),
(41, 'B', 'SMALL MEDIUM ENTERPRISE DEVELOPMENT BANK MALAYSIA BERHAD (SME BANK)'),
(42, 'B', 'STANDARD CHARTERED BANK MALAYSIA BERHAD'),
(43, 'B', 'STANDARD CHARTERED SAADIQ BERHAD'),
(44, 'B', 'SUMITOMO MITSUI BANKING CORPORATION MALAYSIA BERHAD'),
(45, 'B', 'UNITED OVERSEAS BANK (MALAYSIA) BERHAD (UOB)'),

-- Zakat Codes
(46, 'Z', 'EMAS BUKAN PERHIASAN'),
(47, 'Z', 'EMAS PERHIASAN'),
(48, 'Z', 'HARTA'),
(49, 'Z', 'KWSP'),
(50, 'Z', 'TANAMAN (PADI)'),
(51, 'Z', 'PENDAPATAN'),
(52, 'Z', 'PERAK'),
(53, 'Z', 'PERNIAGAAN'),
(54, 'Z', 'QADHA'),
(55, 'Z', 'SAHAM DAN PELABURAN'),
(56, 'Z', 'SIMPANAN'),
(57, 'Z', 'TERNAKAN'),
(58, 'Z', 'TAKAFUL'),
(59, 'Z', 'KRIPTO DAN ASET DIGITAL');

-- Insert data into PROFILE table
INSERT OR IGNORE INTO "PROFILE" (profile_id, profile_type) VALUES
(1, 'individu'),
(2, 'company');

COMMIT;