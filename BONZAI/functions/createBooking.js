import { nanoid } from "nanoid";
import { db } from "../dynamoDb.js";
import { roomSchema } from "../middleware/roomSchema.js";

export const handler = async (event, context) => {
  const bookingNumber = nanoid();
  const { error } = roomSchema.validate(JSON.parse(event.body));
  if (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message,
      }),
    };
    return response;
  }
  const {
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
    guests,
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
        guests: guests,
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
