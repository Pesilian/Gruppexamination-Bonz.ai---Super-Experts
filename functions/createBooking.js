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

    const allBookings = await db.scan({
      TableName: "bookings",
    });

    const differentRooms = Object.entries(requestedRooms).flatMap(
      ([key, value]) => Array(value).fill(key)
    );

    const roomCapacities = {
      Enkelrum: 1,
      Dubbelrum: 2,
      Svit: 3,
    };

    const totalCurrentGuests = {};

    allBookings.Items.forEach((booking) => {
      Object.entries(booking.roomType).forEach(([roomType, numOfRooms]) => {
        if (totalCurrentGuests[roomType]) {
          totalCurrentGuests[roomType] += numOfRooms;
        } else {
          totalCurrentGuests[roomType] = numOfRooms;
        }
      });
    });

    const totalRequestedRooms = Object.values(requestedRooms).reduce(
      (sum, count) => sum + count,
      0
    );

    const totalRooms = Object.values(totalCurrentGuests).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalRooms + totalRequestedRooms > 20) {
      let remainingRooms = 20 - totalRooms;
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: `There are currently only ${remainingRooms} rooms available.`,
        }),
      };
      return response;
    }

    await db.put({
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
      body: JSON.stringify({
        message: `Your booking was completed. Here is your booking number: ${bookingNumber}`,
      }),
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred.",
        error: error.message,
      }),
    };
    return response;
  }
};
