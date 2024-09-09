module.exports.getAllBookings = async (event, context) => {
  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: `Welcome ${result.Item.Username}!` }),
    };
    return response;
  } catch (error) {
    return console.error(error);
  }
};
