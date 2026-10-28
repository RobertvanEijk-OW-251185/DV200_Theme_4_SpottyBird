<!-- Repository Information & Links -->

<h5 align="center" style="padding:0;margin:0;">Robert van Eijk</h5>
<h5 align="center" style="padding:0;margin:0;">251185</h5>
<h6 align="center">DV200 2026</h6>
<br />
<p align="center">
  <a href="https://github.com/RobertvanEijk-OW-251185/DV200_Theme_4_SpottyBird">
    <img src="frontend/src/assets/readmeImages/Logo.png" alt="SpottyBird Wildlife logo" width="300">
  </a>
</p>

<h3 align="center">SpottyBird Wildlife</h3>

<p align="center">
  A wildlife rescue management portal for tracking reports, animal care, and volunteer shifts.
  <br /><br />
  <a href="#about-the-project"><strong>Explore the project</strong></a>
  ·
  <a href="https://github.com/RobertvanEijk-OW-251185/DV200_Theme_4_SpottyBird/issues/new">Report a bug</a>
  ·
  <a href="https://github.com/RobertvanEijk-OW-251185/DV200_Theme_4_SpottyBird/issues/new">Request a feature</a>
</p>

## About the Project

SpottyBird Wildlife is a web application concept for wildlife rescue teams. It brings animal intake records, case progress, rehabilitation information, and volunteer scheduling into one staff-facing workspace. Staff can record an animal's condition and incident details, follow its case through the care workflow, and coordinate volunteers and shifts.

### Built With

- [React](https://react.dev/) and [Vite](https://vite.dev/) for the frontend
- [Express](https://expressjs.com/) and [Node.js](https://nodejs.org/) for the API
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for data storage
- [React Router](https://reactrouter.com/) for page navigation
- [Chart.js](https://www.chartjs.org/) for dashboard visualizations
- [Lucide](https://lucide.dev/) and [Font Awesome](https://fontawesome.com/) for icons

## Getting Started

Follow these steps to run the application locally for development.

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or newer (or 22.12 or newer) and npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB instance
- Git

### Installation

1. Clone the repository and enter the project directory:

   ```sh
   git clone https://github.com/RobertvanEijk-OW-251185/DV200_Theme_4_SpottyBird.git
   cd DV200_Theme_4_SpottyBird
   ```

2. Install the backend and frontend dependencies:

   ```sh
   cd server
   npm install
   cd ../frontend
   npm install
   cd ..
   ```

3. Create `server/.env` and add your MongoDB connection string and a private JWT signing secret:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
   JWT_SECRET=replace-with-a-long-random-secret
   PORT=5001
   ```

   For a local MongoDB installation, use its connection URI instead. Keep real credentials private and do not commit the `.env` file.

4. Create a staff login. Add these values to `server/.env` temporarily, using a unique username, email, and password:

   ```env
   CREATE_USER_USERNAME=your-username
   CREATE_USER_EMAIL=you@example.com
   CREATE_USER_PASSWORD=use-a-strong-password
   ```

   Then run:

   ```sh
   cd server
   npm run create-user
   ```

   After the account is created, remove the three `CREATE_USER_...` entries from `server/.env`.

5. Start the backend and frontend in separate terminals from the project directory:

   ```sh
   cd server
   npm run dev
   ```

   ```sh
   cd frontend
   npm run dev
   ```

   Open the local URL printed by Vite (usually `http://localhost:5173`). The Vite development server proxies `/api` requests to the backend at `http://localhost:5001`. The API connects to MongoDB at startup and creates its default enclosure records if they are missing.

## Features and Functionality

### Staff login

Staff members sign in with an account created by the backend's `create-user` script. The application stores the returned authentication token in browser local storage and uses it for protected volunteer and shift operations.

![SpottyBird login screen](frontend/src/assets/readmeImages/LogIn.png)

### Dashboard

The dashboard visualizes case workflow stages, animal types, active species, and admissions compared with releases.

![SpottyBird dashboard](frontend/src/assets/readmeImages/Main.png)

### Case management

Browse recent wildlife cases and narrow the list by animal type, location, urgency, status, or assignee. Open a case to review its individual record.

![Wildlife cases list](frontend/src/assets/readmeImages/Cases.png)

### Admissions and saved drafts

Create or update an animal admission with finder, animal, incident, clinical, assignment, and release-plan details. Incomplete forms can be saved as drafts and resumed later; case records can also include file attachments.

![Animal admission form](frontend/src/assets/readmeImages/Admissions.png)

### Rehabilitation tracking

Review animals in care or ready for release, with summary counts for animals in care, critical cases, release-ready cases, and records needing updates.

![Rehabilitation overview](frontend/src/assets/readmeImages/Rehabilitation.png)

### Volunteer directory and shift scheduling

Review volunteer availability, search and filter the directory, add contacts, view the weekly shift calendar, and assign or unassign volunteers from shifts.

![Volunteer schedule](frontend/src/assets/readmeImages/Volunbteers.png)

### Individual case records

View case and animal details, update the record, and access associated attachments.

![Individual wildlife case](<frontend/src/assets/readmeImages/Case Details.png>)

## Development Process

The project is organized into a Vite/React frontend and an Express API backed by MongoDB. The API separates routes, controllers, models, middleware, and utility code. Mongoose models represent cases, users, volunteers, shifts, enclosures, and case-number counters.

### Implementation Highlights

- Implemented JSON API endpoints for animal cases, admissions drafts, rehabilitation summaries, and dashboard statistics.
- Added case statuses that represent the workflow from new report through assessment and care to release readiness and closure.
- Added account login with bcrypt password comparison and JSON Web Token authentication for protected volunteer and shift routes.
- Added weekly volunteer shift creation and assignment, along with volunteer contact management.
- Added case attachment upload and retrieval, with file metadata stored alongside the case.
- Used reusable React components for forms, filters, status and priority labels, dashboard cards, and scheduling.

### Challenges

- Keeping admission form data consistent across drafts, complete cases, and individual case updates requires careful mapping between nested form fields and the database model.
- Case attachment handling needs to keep uploaded files associated with the correct record and safely serve those files again.
- Shift scheduling calender, getting the calendar to work and accurately pull data through from the DB as well as getting the volunteers linked up to the specific backend link to allocate them to that specific shift slot.

## Future Improvements

- Add role-based permissions and a staff-facing logout/session-expiry flow.
-

## Video Demonstration

To see a run through of the application, click below:

[View Demonstration](path/to/video/demonstration)

## Authors

- **Robert van Eijk** — [RobertvanEijk-OW-251185](https://github.com/RobertvanEijk-OW-251185)

## License

No license file is currently included in this repository. Terms for reuse have not been specified.

## Acknowledgements

- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Express documentation](https://expressjs.com/)
- [React documentation](https://react.dev/learn)
- [Vite documentation](https://vite.dev/guide/)
- [Chart.js documentation](https://www.chartjs.org/docs/latest/)
- [Lucide icons](https://lucide.dev/)
- [Font Awesome](https://fontawesome.com/)
