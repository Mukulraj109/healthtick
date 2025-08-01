# HealthTick Calendar Booking System

A full-stack calendar booking system for HealthTick coaches to schedule calls with clients.

## 🚀 Features

- **Daily Calendar View**: Time slots from 10:30 AM to 7:30 PM in 20-minute intervals
- **Two Call Types**: 
  - Onboarding (40 minutes, one-time)
  - Follow-up (20 minutes, weekly recurring)
- **Overlap Prevention**: Smart validation to prevent conflicting bookings
- **Client Management**: Searchable dropdown with 20 pre-loaded clients
- **Recurring Bookings**: Automatic weekly scheduling for follow-up calls
- **Real-time Updates**: Immediate UI updates after booking changes
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: Firebase Firestore
- **UI Icons**: Lucide React
- **Date Handling**: Day.js
- **Validation**: Zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthtick-calendar-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a service account key
   - Enable Firestore Database
   - Copy `.env.example` to `.env` and fill in your Firebase credentials

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually
   npm run dev          # Frontend only
   npm run dev:backend  # Backend only
   ```

## 🔧 Environment Variables

Create a `.env` file in the  backend folder:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 📊 Firestore Schema

### Collections

#### `clients`
```json
{
  "id": "auto-generated",
  "name": "Client Name",
  "phone": "+1-555-0123"
}
```

#### `bookings`
```json
{
  "id": "auto-generated",
  "clientId": "client-document-id",
  "clientName": "Client Name",
  "clientPhone": "+1-555-0123",
  "callType": "onboarding" | "follow-up",
  "date": "2024-01-15",
  "startTime": "10:30",
  "endTime": "11:10",
  "duration": 40,
  "recurring": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 🔁 Seeding Data in Firebase

To populate Firebase with initial test data, run the following commands using `tsx`:

```bash
npx tsx createTestBooking.ts
npx tsx createClient.ts
```

## 🔄 API Endpoints

### Clients
- `GET /api/clients` - Get all clients

### Bookings
- `GET /api/bookings/:date` - Get bookings for a specific date (YYYY-MM-DD)
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Delete a booking

### Health Check
- `GET /api/health` - Server health status

## 🧠 Business Logic

### Overlap Prevention
The system prevents overlapping bookings by:
1. Checking existing bookings for the selected date
2. Validating time conflicts between new and existing bookings
3. Considering both direct bookings and recurring bookings
4. Blocking time slots that would be partially occupied

### Recurring Bookings
Follow-up calls are handled as recurring bookings:
1. The original booking is stored with `recurring: true`
2. When querying by date, recurring bookings are dynamically generated
3. Only future occurrences are shown (same day of week, same time)
4. Deleting a recurring booking removes all future occurrences

### Time Slot Logic
- 20-minute intervals from 10:30 AM to 7:30 PM
- Onboarding calls (40 min) block 2 consecutive slots
- Follow-up calls (20 min) block 1 slot
- Visual indicators show availability and booking details

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main actions and highlights
- **Success**: Green (#10B981) - Follow-up calls and success states  
- **Warning**: Amber (#F59E0B) - Alerts and warnings
- **Error**: Red (#EF4444) - Errors and delete actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headers**: Semibold weights for clear hierarchy
- **Body**: Regular weight with proper line height (1.5)
- **Labels**: Medium weight for form elements

### Spacing
- Consistent 8px spacing system
- Generous padding for touch targets
- Proper visual hierarchy with spacing

## 🚦 Development Scripts

```bash
npm run dev:full      # Start both frontend and backend
npm run dev           # Start frontend only (port 5173)
npm run dev:backend   # Start backend only (port 5000)
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

## 📱 Responsive Design

- **Mobile**: Single column layout with touch-friendly buttons
- **Tablet**: 2-column grid for time slots
- **Desktop**: 3-4 column grid for optimal space usage
- **Large screens**: Maximum 4 columns to maintain readability

## 🔒 Security Considerations

- Firebase Admin SDK for secure server-side operations
- Input validation using Zod schemas
- CORS configuration for cross-origin requests
- Environment variables for sensitive configuration
- No client-side exposure of Firebase Admin credentials

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for production API URL

### Backend (Render)
1. Deploy the `backend` folder
2. Set all required environment variables
3. Ensure Node.js version 18+ is selected

## 📞 Support

For technical issues or questions:
1. Check the console for error messages
2. Verify Firebase configuration and permissions
3. Ensure all environment variables are set correctly
4. Check network connectivity for API calls

## 🔄 Future Enhancements

- Multiple coach support with authentication
- Email notifications for bookings
- Calendar integration (Google Calendar, Outlook)
- Advanced recurring patterns (bi-weekly, monthly)
- Client portal for self-booking
- Analytics and reporting dashboard
- Time zone support for international clients