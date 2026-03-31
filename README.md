# EquipFlow

EquipFlow is a full-stack equipment rental management platform built for shared equipment spaces such as media labs, studios, campus clubs, and creative teams. It helps users browse equipment, request bookings, and manage their rentals, while giving admins a dedicated dashboard to manage inventory, approve bookings, track payments, and monitor customer activity.

## Live URLs

Update these before submission with your deployed links:

- Frontend: https://equipflow-frontend.vercel.app
- Backend API: https://equipflow-backend.vercel.app

## Features

- User authentication with sign up, login, email verification, and password reset
- Public equipment catalog with featured items, category filtering, search, and detailed equipment pages
- Booking request system with date-based availability checking to reduce double bookings
- Role-based dashboards for users and admins
- Admin inventory management for equipment and categories
- Booking approval workflow with status updates such as pending, confirmed, active, returned, cancelled, and rejected
- Stripe-based checkout flow for booking payments
- Equipment image upload support using Cloudflare R2
- Customer management, statistics, and review/testimonial support

## Technologies Used

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: Express.js, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Better Auth
- Payments: Stripe
- File Storage: Cloudflare R2 with AWS SDK
- Email Service: Nodemailer
- Package Manager and Tooling: pnpm, ESLint

## Project Structure

```text
Apollo-Level2-Web-Dev-B6A5/
|-- frontend/
|-- backend/
`-- README.md
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yazmiox/Apollo-Level2-Web-Dev-B6A5
cd Apollo-Level2-Web-Dev-B6A5
```

### 2. Install dependencies

Install dependencies separately for the frontend and backend:

```bash
cd backend
pnpm install
```

```bash
cd ../frontend
pnpm install
```

### 3. Configure environment variables

Create a `backend/.env` file and add:

```env
PORT=5000
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
EMAIL=your_email_address
EMAIL_APP_PASS=your_email_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
R2_ENDPOINT=your_r2_endpoint
R2_BUCKET_NAME=your_r2_bucket_name
R2_HOSTNAME=your_r2_public_hostname
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_SIGNED_URL_EXPIRY_HOUR=1
```

Create a `frontend/.env` file and add:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
R2_HOSTNAME=your_r2_public_hostname
```

### 4. Set up the database

From the `backend` folder, generate Prisma client and push the schema:

```bash
cd backend
pnpm db:push
```

### 5. Run the project locally

Start the backend server:

```bash
cd backend
pnpm dev
```

Start the frontend server in a second terminal:

```bash
cd frontend
pnpm dev
```

### 6. Open the application

Visit the frontend in your browser:

```text
http://localhost:3000
```

The backend API runs on:

```text
http://localhost:5000
```