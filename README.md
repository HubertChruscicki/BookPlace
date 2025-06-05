# 📚 BookPlace

BookPlace is a comprehensive web application that enables users to book accommodations (apartments, houses, etc.) as guests or rent them out as landlords. The platform offers a seamless experience for both sides of the marketplace.

## 🌟 Description

BookPlace serves as a bridge between property owners and travelers, creating a community-driven platform for short-term rentals. Users can browse available accommodations, make reservations, and leave reviews, while landlords can list and manage their properties, track bookings, and communicate with guests.

## 🏗️ Architecture

The application follows a client-server architecture:

```
BookPlace/
├── bookplace-frontend/
│   └── frontend/
└── bookplace-backend/
    └── backend/
```

- **Frontend**: Single-page application built with React
- **Backend**: REST API built with Django
- **Database**: PostgreSQL for data persistence
- **Authentication**: JWT-based authentication system

## 🛠️ Technology Stack & Justification

### Frontend
- **React**: Chosen for its component-based architecture, enabling reusable UI elements and efficient rendering through the virtual DOM
- **TypeScript**: Adds static typing to JavaScript, enhancing code quality, providing better tooling, and reducing runtime errors
- **Material UI**: Provides a comprehensive set of pre-built, customizable components that follow Google's Material Design guidelines, accelerating development
- **React Router**: Enables navigation between different views without page reloads
- **React Query**: Simplifies data fetching, caching, and state management for API calls
- **React Hook Form**: Manages form state and validation efficiently

### Backend
- **Django**: Powerful Python web framework with a robust ORM, admin panel, and security features
- **Django REST Framework**: Extension for building RESTful APIs with Django
- **RabitMQ + Celery**: Handles asynchronous tasks and background processing, such as sending notifications
- **PostgreSQL**: Advanced open-source relational database known for reliability, feature robustness, and performance
- **Docker**: Ensures consistent environments across development and production

## 👥 User Roles

BookPlace supports two primary user roles:

1. **Guests as User**:
    - Browse available accommodations
    - Filter and search properties
    - Make reservations
    - Pay for bookings
    - Leave reviews for past stays

2. **Landlords**:
    - explore the user role
    - Add and manage offers
    - Set availability and pricing
    - View and manage reservations
    - Communicate with guests
    - View booking calendar

## ✨ Main Functionalities

- **Property Listings**: Detailed property pages with photos, amenities, pricing, and availability
- **Search & Filtering**: Find accommodations based on location, dates, price, and amenities
- **Booking System**: Reserve properties for specific dates with guest count
- **User Authentication**: Secure login/signup with role-based permissions
- **Reviews & Ratings**: Feedback system for quality assurance
- **Landlord Dashboard**: Manage listings, reservations, and communications
- **Payment Processing**: Secure booking payment flow
- **Responsive Design**: Optimized for both desktop and mobile devices


## 📋 Requirements

### Frontend
- Node.js 16+
- npm 8+
- Modern web browser with JavaScript enabled

### Backend
- Docker and Docker Compose (it will run the backend and database in containers)

## 🚀 Setup Instructions
### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd bookplace-frontend/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The application will be available at http://localhost:80

### Backend Setup

1. Navigate to the backend directory:
```bash
cd bookplace-backend
```

2. Start the Docker containers:
```bash
docker-compose up -d
```

3. The API will be available at http://localhost:8000

### Environment Variables

Create a `.env` file in both frontend and backend directories as needed:

**Frontend (.env):**
```
VITE_BASE_API_URL= 'http://localhost:8000/api/v1'
VITE_BASE_API_IMAGES_URL='http://localhost:8000'
```

**Backend (.env):**
```
BREVO_API_KEY= 'your_brevo_api_key_here'
DEFAULT_FROM_EMAIL= 'your_default_from_email_here'
BREVO_RESERVATION_CONFIRM_TEMPLATE_ID='id_of_your_template_here'
```

## 🔎 Project Structure

```
BookPlace/
├── bookplace-frontend/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   ├── theme/
│   │   │   ├── .env
│   │   │   └── ...
│   │   ├── public/
│   │   └── ...
│   └── ...
└── bookplace-backend/
    ├── backend/
    │   ├── media/
    │   ├── backend/
    │   ├── offers/
    │   ├── reservations/
    │   ├── reviews/
    │   ├── users/
    │   ├── notifications/
    │   ├── .env
    │   └── ...
    ├── docker-compose.yml
    ├── Dockerfile
    └── ...
```

## 📝 License

This project is licensed under the MIT License