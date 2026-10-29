# Task Manager API + Expo integration patch

This patch connects the Expo app to the existing Express/MongoDB backend. It includes account registration/login, locally stored JWT access tokens, user-specific task CRUD, and a three-tab signed-in UI.

## Important security step

The project archive that was shared for review included `server/.env`. Treat any database password and JWT secret in that file as exposed. Rotate the MongoDB database user's password in MongoDB Atlas, update the local `server/.env` with the new connection string, and generate a fresh JWT secret on your own computer (for example, run `openssl rand -hex 32` in your terminal). Do not paste secrets into chat or commit `.env` files.

This patch intentionally does not contain any real `.env` files.

## Files in this patch

- `server/src/models/task.model.js` — task schema in MongoDB.
- `server/src/controllers/task.controller.js` — list/create/update/delete tasks scoped to the signed-in user.
- `server/src/routes/task.routes.js` — protected task endpoints.
- `server/src/models/user.model.js` and `server/src/controllers/auth.controller.js` — add a name field for registration and display it in the app. Existing users without a name fall back to their email prefix in responses.
- `server/src/app.js` and `server/src/server.js` — register task routes and start the API on the network interfaces.
- `src/services/authStorage.js` — save/read/delete the JWT with Expo SecureStore.
- `src/services/api.js` — small API helper for auth and task calls.
- `src/app/index.jsx` — login/register UI, task list, create/edit/delete/complete, and Tasks/Completed/Profile bottom tabs.
- `src/app/_layout.tsx` — uses a simple Expo Router stack because bottom tabs are shown inside the signed-in screen.
- `.gitignore` — ignores environment secrets.
- `.env.example` — example API URL configuration for Expo.

## Apply the patch

Extract this ZIP into the **root of your existing `task-manager-native` project**, allowing it to merge/replace the listed files. Do not extract it into the `server` folder; the archive paths already start with `src/` and `server/`.

Keep your existing `server/.env`. Do not copy `.env.example` over your real environment file.

## Configure Expo's API URL

In the project root, create `.env` using `.env.example` as a guide.

For the iOS Simulator on the same Mac as the backend:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

For the Android Emulator:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api
```

For a physical phone, use your Mac's LAN IP address instead of `localhost`, for example `http://192.168.1.10:4000/api`. The phone and Mac should be on the same Wi-Fi network, and the firewall must permit the connection.

`EXPO_PUBLIC_API_URL` is public app configuration, not a secret. Never place `MONGODB_URI` or `ACCESS_TOKEN_SECRET` in the Expo root `.env`.

## Run it

Use two terminals.

Terminal 1 — backend:

```bash
cd server
npm run dev
```

Check `http://localhost:4000/api/health` in your browser. It should return JSON with `api: "ok"` and `database: "connected"`.

Terminal 2 — Expo, from the project root:

```bash
npx expo start --dev-client --scheme taskmanagernative
```

Restart Expo after changing the root `.env` so it picks up the new API URL. Do not run `npm audit fix --force` and do not run `expo prebuild --clean` for this patch.

If the app reports that the SecureStore native module is unavailable, your currently installed development build may not include the plugin. Rebuild the development client for your target platform with the project's usual Expo build command; do not clean/reset the native project.

## Implemented endpoints

- `POST /api/auth/register` — name, email, password; returns a user and 7-day access token.
- `POST /api/auth/login` — email and password; returns a user and 7-day access token.
- `GET /api/auth/me` — authenticated current user.
- `GET /api/tasks` — list the signed-in user's tasks.
- `POST /api/tasks` — create a task.
- `PATCH /api/tasks/:id` — update a task or its completion status.
- `DELETE /api/tasks/:id` — delete a task.

Task details are stored in MongoDB: title, description, priority, due date, completed status, and timestamps. Every task query is scoped to `req.auth.userId`, so one user cannot read or change another user's tasks using these endpoints.

Logging out clears the token from Expo SecureStore. This project intentionally has no backend logout/revocation endpoint, so a copied JWT could remain valid until its seven-day expiry.

## Existing SQLite tasks

The previous local SQLite task database is left intact but is no longer used by the new screen. Tasks created after this change are stored in MongoDB and associated with the signed-in account. Existing local SQLite tasks are not automatically migrated.
