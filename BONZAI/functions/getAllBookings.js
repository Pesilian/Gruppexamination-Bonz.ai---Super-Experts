const { db } = require(".././dynamoDb.js");

module.exports.handler = async (event, context) => {
  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: "Welcome" }),
    };
    return response;
  } catch (error) {
    return console.error(error);
  }
};
