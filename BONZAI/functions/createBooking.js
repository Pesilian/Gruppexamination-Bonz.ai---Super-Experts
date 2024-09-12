const { db } = require('../dynamoDb.js'); 
const crypto = require('crypto');

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex');
}

exports.handler = async (event) => {
  const bookingNumber = generateRandomString(16); 
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
    await db.put({
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
    return {
      statusCode: 200,
      body: JSON.stringify({ bookingNumber }), 
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create booking', error: error.message }),
    };
  }
};
