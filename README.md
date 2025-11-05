# Rideconnect-website
🚕 RideConnect - Taxi Booking Platform
Connecting Communities, One Ride at a Time

RideConnect is a modern, full-stack taxi booking platform that connects passengers with verified drivers in real-time. Built with Node.js, Express, MongoDB, and modern web technologies.

🌟 Features
🚗 For Passengers
Real-time Booking - Instant ride requests with live tracking

Live Map Integration - Track your driver in real-time

Secure Payments - M-Pesa and card payment integration

Ride History - Access your complete trip history

Rating System - Rate drivers for quality assurance

👨‍✈️ For Drivers
Flexible Earnings - Set your own schedule and earn competitively

Ride Management - Accept/reject rides with ease

Earnings Dashboard - Track your income and performance

Document Verification - Secure onboarding process

Real-time Navigation - Optimized routes and navigation

🔒 Safety & Security
Verified Drivers - Background checked and certified

Live Tracking - Real-time GPS tracking for every ride

Emergency Contacts - Built-in safety features

Secure Data - Encrypted data transmission and storage

🛠 Tech Stack
Frontend
HTML5 - Semantic markup and structure

CSS3 - Modern styling with Flexbox/Grid

JavaScript - Interactive functionality

Responsive Design - Mobile-first approach

Backend
Node.js - Runtime environment

Express.js - Web application framework

MongoDB - NoSQL database with Mongoose ODM

JWT - JSON Web Tokens for authentication

bcryptjs - Password hashing and security

APIs & Integration
RESTful APIs - Clean, structured endpoints

M-Pesa Integration - Mobile money payments

Google Maps API - Location services and mapping

Real-time Features - WebSocket integration planned

🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

MongoDB ( Atlas)

Modern web browser

Installation
Clone the repository

bash
git clone https://github.com/your-username/rideconnect.git
cd rideconnect
Install dependencies

bash
npm install
Environment Setup

bash
# Create .env file
cp .env.example .env
# Add your MongoDB URI and JWT secret
Start the development server

bash
npm run dev
Access the application

text
Open http://localhost:3000 in your browser
📁 Project Structure
text
rideconnect/
├── public/                 # Frontend assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   ├── images/            # Static images
│   └── *.html             # Page templates
├── routes/                # Express route handlers
│   ├── auth.js           # Authentication routes
│   ├── bookings.js       # Booking management
│   └── drivers.js        # Driver operations
├── models/               # Database models
│   ├── User.js          # User schema
│   └── Booking.js       # Booking schema
├── middleware/           # Custom middleware
│   └── auth.js          # Authentication middleware
├── config/              # Configuration files
└── server.js           # Main application entry point
🎯 Key Features Implemented
✅ Completed
User Authentication (Login/Register)

Driver Registration with Document Upload

Responsive Homepage Design

Booking Interface

Live Map Dashboard

Driver Dashboard

Payment Hub

MongoDB Integration

RESTful API Endpoints

🔄 In Progress
Real-time Location Tracking

M-Pesa Payment Integration

Ride Matching Algorithm

Push Notifications

Admin Dashboard

🗓 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user

Bookings
POST /api/bookings - Create new booking

GET /api/bookings/my-bookings - Get user bookings

PATCH /api/bookings/:id/status - Update booking status

Drivers
GET /api/drivers/nearby - Find nearby drivers

PATCH /api/drivers/availability - Update driver status

🌍 Kenyan Market Focus
M-Pesa Integration - Seamless mobile money payments

Local Currency - KES pricing and earnings display

Kenyan Cities - Nairobi, Mombasa, Kisumu, and more

Local Regulations - NTSA compliance and safety standards

🤝 Contributing
We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

Development Workflow
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

👥 Team
Sammy Mapapa- Full Stack Developer & Project Lead

🆘 Support
For support, email support@rideconnect.co.ke or join our Slack channel.

🔮 Future Roadmap
Mobile App (React Native)

AI-powered Route Optimization

Corporate Accounts

Subscription Plans

Multi-language Support

Advanced Analytics Dashboard

⭐ Star this repository if you find it helpful!

Built with ❤️ in Kenya 🇰🇪

