import { db } from '../dynamoDb.js';
import { roomSchema } from '../middleware/roomSchema.js';
import { sendResponse, sendError } from './services/index.js';

const requirementRooms = (rooms, roomType, guests) => {
  const mapOfRoomTypes = rooms.reduce((map, room) => {
    if (!map[room.roomName]) {
      map[room.roomName] = 0;
    }
    map[room.roomName] += room.guests;
    return map;
  }, {});

  const requiredRooms = roomType.reduce((total, type) => {
    return total + (mapOfRoomTypes[type] || 0);
  }, 0);

  return requiredRooms >= guests;
};

async function updateReservation(bookingNumber, updateParams) {
  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  for (const [key, value] of Object.entries(updateParams)) {
    const attributeName = `#${key}`;
    const attributeValue = `:${key}`;
    updateExpression.push(`${attributeName} = ${attributeValue}`);
    expressionAttributeNames[attributeName] = key;
    expressionAttributeValues[attributeValue] = value;
  }

  return db.update({
    TableName: 'bookings',
    Key: { bookingNumber },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });
}

async function getReservation(bookingNumber) {
  const result = await db.get({
    TableName: 'bookings',
    Key: {
      bookingNumber: bookingNumber,
    },
  });

  return result.Item;
}

export const handler = async event => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const bookingNumber = event.pathParameters ? event.pathParameters.id : null;
  if (!bookingNumber) {
    return sendError(400, 'Booking number is required');
  }

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

  const updateData = JSON.parse(event.body);

  let reservationInfo;
  try {
    reservationInfo = await getReservation(bookingNumber);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return sendError(500, 'Error fetching reservation');
  }

  if (!reservationInfo) {
    return sendError(404, "Can't find the reservation");
  }

  const todayDate = new Date();
  const checkInDate = new Date(reservationInfo.checkInDate);
  const timeDifference = checkInDate - todayDate;
  const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (differenceInDays < 2) {
    return sendError(
      400,
      'You cannot modify your stay later than 2 days before check-in.'
    );
  }

  try {
    const rooms = await db.scan({
      TableName: 'rooms',
    });

    const allBookings = await db.scan({
      TableName: 'bookings',
    });

    const updatedRooms = updateData.roomType || reservationInfo.roomType;
    const guests = updateData.guests || reservationInfo.guests;

    const differentRooms = Object.entries(updatedRooms).flatMap(
      ([key, value]) => Array(value).fill(key)
    );

    const correctRoomTypes = requirementRooms(
      rooms.Items,
      differentRooms,
      guests
    );

    if (!correctRoomTypes) {
      return sendError(
        400,
        'The updated number of guests does not fit within the available rooms.'
      );
    }

    const totalCurrentGuests = {};

    allBookings.Items.forEach(booking => {
      Object.entries(booking.roomType).forEach(([roomType, numOfRooms]) => {
        if (totalCurrentGuests[roomType]) {
          totalCurrentGuests[roomType] += numOfRooms;
        } else {
          totalCurrentGuests[roomType] = numOfRooms;
        }
      });
    });

    const totalRequestedRooms = Object.values(updatedRooms).reduce(
      (sum, count) => sum + count,
      0
    );

    const totalRooms = Object.values(totalCurrentGuests).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalRooms + totalRequestedRooms > 20) {
      let remainingRooms = 20 - totalRooms;
      return sendError(
        400,
        `There are currently only ${remainingRooms} rooms available.`
      );
    }

    const updatedReservation = await updateReservation(
      bookingNumber,
      updateData
    );
    return sendResponse(
      'Reservation was changed successfully',
      updatedReservation.Attributes
    );
  } catch (error) {
    console.error('Error updating reservation:', error);
    return sendError(500, "Can't update reservation");
  }
};
