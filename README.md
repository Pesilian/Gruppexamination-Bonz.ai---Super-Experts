#SUPER EXPERTS 

###Dylan Ravenson Lina Persson Signell Emma Dybdorf


##URL Endpoints 

###GET /booking 
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking 
Description: Retrieve all bookings.


###GET /booking/{bookingNumber}
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking/ {bookingNumber}
Description: Retrieve a specific booking by bookingNumber.


###POST /booking https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking
Description: Create a new booking.

Request Body:
 {
  "firstName": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "checkInDate": "2024-09-15",
  "checkOutDate": "2024-09-22",
  "numGuests": 1,
  "roomType": {
    "Enkelrum": 1
  }
}


###PUT /booking/{bookingNumber}
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking/ {bookingNumber}
Description: Update an existing booking.


{
  "firstName": "John",
  "surname": "Doe",
  "email": "john.doe@example.com",
  "checkInDate": "2024-09-12",
  "checkOutDate": "2024-09-22",
  "numGuests": 1,
  "roomType": {
    "Svit": 1
  }
}


###DELETE /booking/{bookingNumber}
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking/ {bookingNumber}
Description: Delete a booking by its bookingNumber.


Response {
    "message": "Reservation is removed"
}
