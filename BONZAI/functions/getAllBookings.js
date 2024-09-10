const { db } = require(".././dynamoDb.js");

module.exports.handler = async (event, context) => {
  try {
    const result = await db.scan({
      TableName: "bookings",
    });
    if (result.Items.length < 0) {
      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: result.Items }),
      };
      return response;
    } else {
      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "There are no current bookings." }),
      };
      return response;
    }
  } catch (error) {
    return console.error(error);
  }
};
