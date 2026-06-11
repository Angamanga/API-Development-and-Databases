# Prisma + Express Project 


## How to run the server
1. Install dependencies:

```npm install```

2. Start the server

```npm run dev```

The server runs on port `3000`.

## Routes created
- `GET /userlanguages`: Returns a list of users
- `POST /userlanguages`: Creates a new user. Expects a body (JSON) with `name`, `email`, `languages` (array), and optional `age`.
- `PUT /userlanguages/:email`: Updates the `languages` field for the user by email.
- `DELETE /userlanguages`: Deletes users younger than 18.


## Test the routes

You can use `curl`, Insomnia or Postman to test the routes.

- Create a user (POST):

```
curl -X POST http://localhost:3000/userlanguages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Testsson","email":"test@example.com","languages":["Swedish", "Finnish"],"age":28}'
```

- List users (GET):

```
curl http://localhost:3000/userlanguages
```

- Delete users (DELETE) (deletes all users younger than 18 ):

```
curl -X DELETE http://localhost:3000/userlanguages
```

- Update a user's languages (PUT):

```
curl -X PUT http://localhost:3000/userlanguages/test@example.com \
  -H "Content-Type: application/json" \
  -d '{"languages":["Swedish","Finnish","Urdu"]}'
```
