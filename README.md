# SmartCommute

A smart public transport management platform with digital bus passes, QR-based ticketing, and online payments — built with role-based workflows for **passengers**, **conductors**, and **administrators**.

## What it does

- **Passengers** — buy and renew digital bus passes, get QR tickets, pay online via Razorpay, report lost items, and submit feedback
- **Conductors** — verify passenger QR codes and manage trips
- **Admins** — manage users, passes, tickets, buses, and payments

## Tech stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT authentication, Razorpay payments
- **Frontend:** React Native (Expo), React Navigation, Axios
- **Other:** QR code generation & verification (`react-native-qrcode-svg`, signed QR payloads)

## Project structure

```
SmartCommute/
├── backend/                 # Express API (port 3000)
│   ├── controllers/         # auth, passes, tickets, payments, feedback
│   ├── models/              # Mongoose models (user, pass, ticket, bus, ...)
│   ├── routes/              # /auth, /pass, /tickets, /payment, /conductor, /admin, ...
│   ├── middleware/          # JWT auth, role-based access control
│   └── server.js            # entry point
└── frontend/                # Expo React Native app
    ├── screens/             # passenger / conductor / admin screens
    ├── navigation/          # React Navigation setup
    ├── services/            # API + payment service layers
    ├── context/             # auth state
    └── assets/              # app icons
```

## Getting started

### Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```
JWT_SECRET=your_jwt_secret
QR_SECRET=your_qr_signing_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Make sure MongoDB is running locally (`mongodb://127.0.0.1:27017/smartcommute`), then:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

Set the API base URL via `EXPO_PUBLIC_API_URL` (see `frontend/services/`), then scan the QR code with Expo Go or run on an emulator.

## Notes

- `node_modules/`, `.env` files, and build output are git-ignored — never commit secrets.
- The backend defaults to a local MongoDB instance; point it at Atlas or another host for shared environments.
