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

    let numOfGuest = 0;
    const totalCurrentGuests = {};
    rooms.Items.forEach((room) => {
      numOfGuest += room.guests;
    });

    allBookings.Items.forEach((booking) => {
      Object.entries(booking.roomType).forEach(([roomType, numOfRooms]) => {
        if (totalCurrentGuests[roomType]) {
          totalCurrentGuests[roomType] += numOfRooms;
        } else {
          totalCurrentGuests[roomType] = numOfRooms;
        }
      });
    });

    const totalRooms = Object.values(totalCurrentGuests).reduce(
      (sum, count) => sum + count,
      0
    );

    if (numOfGuest < guests) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({
          message: numOfGuest,
          totalRooms,
        }),
      };
      return response;
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
      body: JSON.stringify({ message: "good" }),
    };
    return response;
  } catch (error) {
    return console.error(error);
  }
};
