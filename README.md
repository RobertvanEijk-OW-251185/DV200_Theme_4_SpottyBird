# DV200_Theme_4_SpottyBird

## Run the app locally

1. Add a MongoDB connection string to `server/.env`:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
   JWT_SECRET=<a-long-random-secret>
   PORT=5001
   ```

2. Create a login for an admin or staff member by temporarily adding these values to `server/.env`:

   ```env
   CREATE_USER_USERNAME=<username>
   CREATE_USER_EMAIL=<organisation-email>
   CREATE_USER_PASSWORD=<strong-password>
   ```

   Then run this once from the `server` directory:

   ```sh
   npm run create-user
   ```

   The command hashes the password before saving it. Remove the three `CREATE_USER_*` values from `.env` after it succeeds. There is no public registration endpoint or signup page.

3. In one terminal, start the API:

   ```sh
   cd server
   npm install
   npm run dev
   ```

4. In another terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Vite forwards `/api` requests to the API at `http://localhost:5001`.

5. Open the Vite URL and sign in with the email and password used to create the account. After login, go to **Admission**, complete the required fields, and click **Admit animal**. A successful response displays the saved MongoDB document ID. The API also lists the latest 50 cases at `GET /api/cases`.

The admission form posts case, finder, animal, incident, clinical, release-plan, and consent/referral details to `POST /api/cases`. The API returns validation errors in the form if required case details are missing or invalid.
