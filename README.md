# SUPER EXPERTS 

### Dylan Ravenson Lina Persson Signell Emma Dybdorf


## URL Endpoints 

### GET /booking 
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking 

Description: Retrieve all bookings.


### GET /booking/{bookingNumber}
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking/{bookingNumber}

Description: Retrieve a specific booking by bookingNumber.


### POST /booking 
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking

Description: Create a new booking.

Request Body:
{<br/>
"firstName": "John",<br/>
"surname": "Doe",<br/>
"email": "john.doe@example.com",<br/>
"checkInDate": "2024-09-15",<br/>
"checkOutDate": "2024-09-22",<br/>
"numGuests": 1,<br/>
"roomType":<br/> {
   "Enkelrum": 1
  }<br/>
}


### PUT /booking/{bookingNumber}
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking/{bookingNumber}

Description: Update an existing booking.


{<br/>
  "firstName": "John",<br/>
  "surname": "Doe",<br/>
  "email": "john.doe@example.com",<br/>
  "checkInDate": "2024-09-12",<br/>
  "checkOutDate": "2024-09-22",<br/>
  "numGuests": 1,<br/>
  "roomType":<br/> {
    "Svit": 1
  }<br/>
}


### DELETE /booking/{bookingNumber}
URL: https://0o5li5kjt2.execute-api.eu-north-1.amazonaws.com/booking/{bookingNumber}

Description: Delete a booking by its bookingNumber.


Response {
    "message": "Reservation is removed"
}
