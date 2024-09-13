BONZAI Hotel Booking API
SUPER EXPERTS
Dylan Ravenson, Lina Persson Signell, Emma Dybdorf

Requirements:
A table called "rooms" with Partition key "roomName" must be created in dynamoDb with Items as follows:

Attribute name: roomName
Value: Enkelrum
Type: String
Attribute name: guests
Value: 1
Type: Number

Attribute name: roomName
Value: Dubbelrum
Type: String
Attribute name: guests
Value: 2
Type: Number

Attribute name: roomName
Value: Svit
Type: String
Attribute name: guests
Value: 3
Type: Number

A table called "bookings" with Partition key "bookingNumber" must be created in dynamoDb.

Instructions:

1. Download zip-file or fork repo
2. Open file, open console and enter npm i nanoid and npm i joi
3. Enter serverless deploy into console, click enter
4. Make request with unique endpoint URL

URL Endpoints
GET /booking

URL: https://${UNIQUE_URL}.execute-api.eu-north-1.amazonaws.com/booking
Description: Retrieve all bookings.

---

GET /booking/{bookingNumber}

URL: https://${UNIQUE_URL}.execute-api.eu-north-1.amazonaws.com/booking/{bookingNumber}

## Description: Retrieve a specific booking by bookingNumber.

POST /booking

URL: https://${UNIQUE_URL}.execute-api.eu-north-1.amazonaws.com/booking

Description: Create a new booking.

Request Body: {
"firstName": "John",
"surname": "Doe",
"email": "john.doe@example.com",
"checkInDate": "2024-09-15",
"checkOutDate": "2024-09-22",
"numGuests": 1,
"roomType":
{ "Enkelrum": 1 }
}

---

PUT /booking/{bookingNumber}

URL: https://${UNIQUE_URL}.execute-api.eu-north-1.amazonaws.com/booking/{bookingNumber}

Description: Update an existing booking.

{
"firstName": "John",
"surname": "Doe",
"email": "john.doe@example.com",
"checkInDate": "2024-09-12",
"checkOutDate": "2024-09-22",
"numGuests": 1,
"roomType":
{ "Svit": 1 }
}

---

DELETE /booking/{bookingNumber}

URL: https://${UNIQUE_URL}.execute-api.eu-north-1.amazonaws.com/booking/{bookingNumber}

Description: Delete a booking by its bookingNumber.

Response { "message": "Reservation is removed" }
