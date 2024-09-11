import { nanoid } from "nanoid";
import { db } from "../dynamoDb.js";

export const handler = async (event, context) => {
  const bookingNumber = nanoid();
  const {
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
    numGuests,
    roomType: requestedRooms,
  } = JSON.parse(event.body);

  try {
    const rooms = await db.scan({
      TableName: "rooms",
    });

    for (const [roomType, numOfRooms] of Object.entries(requestedRooms)) {
      const available = rooms.Items.find((room) => room.roomName === roomType);

      if (!available) {
        const response = {
          statusCode: 400,
          body: JSON.stringify({
            message: `Room type ${roomType} was not found. Available room type are: Enkelrum, Dubbelrum, and Svit.`,
          }),
        };
        return response;
      }
    }

    const result = await db.put({
      TableName: "bookings",
      Item: {
        bookingNumber: bookingNumber,
        firstName: firstName,
        surname: surname,
        email: email,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numGuests: numGuests,
        roomType: requestedRooms,
      },
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
    return response;
  } catch (error) {
    return console.error(error);
  }
};
