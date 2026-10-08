# udemy-complete-node

**Note:** This repository is archived and read-only.

Practices and projects from Jonas Schmedtmann's Node.js course on Udemy. Each top-level folder is a course section.

## Contents

- **`01-node-farm/project`** — "Node Farm", a plain Node.js HTTP app that renders product pages from HTML templates and JSON data. Run with `node 01-node-farm/project/index.js`.
- **`02-how-node-works`** — small scripts on `event-loop`, `events`, `modules` and `streams`, each with its own `package.json`.
- **`04-natours/project`** — "Natours", an Express + MongoDB (Mongoose) REST API for tours and users.

## Natours

ES modules, entry point `server.js`, app setup in `app.js`. Code is split into `controllers/`, `models/`, `routers/` and `utils/`. Middleware includes `helmet`, rate limiting on `/api`, a 10kb JSON body limit, Mongo sanitization, XSS protection and `hpp`. Tour routes are mounted at `/api/v1/tours`.

**Note:** some dependencies in its `package.json` (`express-mongo-sanitize`, `helmet`, `hpp`, `nodemailer`) point to local `file:` paths from the original author's machine. Replace them with registry versions before `npm install`.

Copy `config.example.env` and fill in: `NODE_ENV`, `PORT`, `DATABASE`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `BCRYPT_SALT_ROUNDS`, `JWT_SECRET`, `JWT_EXPIRES_IN_DAYS`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`.

```bash
cd 04-natours/project
npm install
npm run start:dev   # nodemon server.js
npm run start:prod  # uses Windows-style `set` syntax
npm run debug       # ndb server.js
```

## License

GNU General Public License v3.0 (see `LICENSE`).
