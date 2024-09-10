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
    roomType,
  } = JSON.parse(event.body);

  try {
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
        roomType: roomType,
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
