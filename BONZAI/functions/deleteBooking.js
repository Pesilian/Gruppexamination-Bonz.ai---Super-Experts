import { db } from "../dynamoDb.js";
import { sendResponse, sendError } from './services/index.js'; 


async function deleteReservation(bookingNumber) {
  return db.delete({
    TableName: "bookings",
    Key: {
      bookingNumber: bookingNumber,
    },
  });
}

async function getReservation(bookingNumber) {
  const result = await db.get({
    TableName: "bookings",
    Key: {
      bookingNumber: bookingNumber,
    },
  });

  return result.Item;
}

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  const bookingNumber = event.pathParameters ? event.pathParameters.id : null;

  if (!bookingNumber) {
    return sendError(400, "Booking number is required");
  }

  let reservationInfo;
  try {
    reservationInfo = await getReservation(bookingNumber);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return sendError(500, "Error fetching reservation");
  }

  if (!reservationInfo) {
    return sendError(404, "Can't find the reservation");
  }

  const todayDate = new Date();
  const checkInDate = new Date(reservationInfo.checkInDate);
  const timeDifference = checkInDate - todayDate;
  const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (differenceInDays < 2) {
    return sendError(400, "You cannot cancel your stay later than 2 days before check-in.");
  }

  try {
    await deleteReservation(bookingNumber);
    return sendResponse("Reservation is removed");
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return sendError(500, "Can't delete reservation");
  }
};

