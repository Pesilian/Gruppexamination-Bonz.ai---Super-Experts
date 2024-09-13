import { db } from "../dynamoDb.js";

export const handler = async (event, context) => {
  const bookingNumber = event.pathParameters ? event.pathParameters.id : null;
  if (!bookingNumber) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: "Booking number is required" }),
    };
    return response;
  }

  try {
    const result = await db.get({
      TableName: "bookings",
      Key: {
        bookingNumber: bookingNumber,
      },
    });

    if (!result.Item) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: `Unable to find booking with booking number ${bookingNumber}.`,
        }),
      };
      return response;
    } else {
      if (result.Item.bookingNumber === bookingNumber) {
        const response = {
          statusCode: 200,
          body: JSON.stringify({
            message: "Here is your booking:",
            booking: result.Item,
          }),
        };
        return response;
      } else {
        const response = {
          statusCode: 400,
          body: JSON.stringify({
            message: `Booking with number ${bookingNumber} was not found. Contact customer support.`,
          }),
        };
        return response;
      }
    }
  } catch (error) {
    return console.error(error);
  }
};
