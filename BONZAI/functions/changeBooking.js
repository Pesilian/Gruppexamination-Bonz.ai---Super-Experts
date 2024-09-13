import { db } from "../dynamoDb.js"
import {sendResponse, sendError} from "./services/index.js"

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

exports const handler = async event => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const bookingNumber = event.pathParameters ? event.pathParameters.id : null;
  if (!bookingNumber) {
    return sendError(400, 'Booking number is required');
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
    const updatedReservation = await updateReservation(
      bookingNumber,
      updateData
    );
    return sendResponse(200, updatedReservation.Attributes);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return sendError(500, "Can't update reservation");
  }
};
