-- CreateTable
CREATE TABLE "RoomConfig" (
    "roomId" TEXT NOT NULL,
    "maxOccupancy" INTEGER NOT NULL,

    CONSTRAINT "RoomConfig_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "bookings" (
    "bookingId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("bookingId")
);
