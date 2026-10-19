# DV200_Theme_4_SpottyBird

## Run the app locally

1. Add a MongoDB connection string to `server/.env`:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
   PORT=5001
   ```

2. In one terminal, start the API:

   ```sh
   cd server
   npm install
   npm run dev
   ```

3. In another terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Vite forwards `/api` requests to the API at `http://localhost:5001`.

4. Open the Vite URL, go to **Admission**, complete the required fields, and click **Admit animal**. A successful response displays the saved MongoDB document ID. The API also lists the latest 50 cases at `GET /api/cases`.

The admission form posts case, finder, animal, incident, clinical, release-plan, and consent/referral details to `POST /api/cases`. The API returns validation errors in the form if required case details are missing or invalid.
