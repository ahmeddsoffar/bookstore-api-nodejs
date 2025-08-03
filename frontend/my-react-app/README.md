# BookStore API Frontend

A modern React frontend for the BookStore API backend, built with Vite, React Router, and Tailwind CSS.

## 🚀 Features

### 🔐 Authentication System

- **User Registration**: Create new accounts with username, email, password, and role selection
- **User Login**: Login with either username or email
- **JWT Token Management**: Automatic token storage and API request authentication
- **Role-based Access**: Different access levels for users and administrators

### 📚 Book Management (CRUD)

- **View Books**: Browse all books in a responsive grid layout
- **Add Books**: Create new book entries with title, author, and publication year
- **Edit Books**: Update existing book information
- **Delete Books**: Remove books from the collection
- **View Details**: See detailed information about each book

### 🏠 User Dashboard

- **Welcome Message**: Personalized greeting from the backend API
- **User Statistics**: Display book counts and user information
- **Quick Actions**: Easy navigation to main features
- **Account Information**: View current user details

### 👑 Admin Dashboard

- **Admin-only Access**: Restricted to users with admin role
- **System Status**: Monitor database and API health
- **Admin Privileges**: Overview of administrative capabilities
- **System Management**: Admin-specific features and controls

### 🎨 Modern UI/UX

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Tailwind CSS**: Modern utility-first CSS framework
- **Lucide Icons**: Beautiful and consistent iconography
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: User-friendly error messages and validation

## 🛠 Technology Stack

- **React 19.1.0**: Modern React with hooks and context
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

## 📦 Installation & Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd frontend/my-react-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and go to `http://localhost:5173`

## 🔌 API Integration

The frontend integrates with your Node.js backend API:

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Automatic token refresh and error management

### API Endpoints Used:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/home/welcome` - Protected user dashboard
- `GET /api/admin/welcome` - Admin-only dashboard
- `GET /api/books/get-books` - Get all books
- `POST /api/books/create-book` - Create new book
- `PUT /api/books/update-book/:id` - Update book
- `DELETE /api/books/delete-book/:id` - Delete book

## 🗂 Project Structure

```
src/
├── api/
│   └── api.js                 # Axios configuration and interceptors
├── components/
│   ├── Navbar.jsx            # Navigation component
│   └── ProtectedRoute.jsx    # Route protection wrapper
├── context/
│   └── AuthContext.jsx       # Authentication context and state
├── pages/
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── Dashboard.jsx         # User dashboard
│   ├── Books.jsx             # Books CRUD interface
│   └── Admin.jsx             # Admin dashboard
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles and Tailwind imports
```

## 🎯 Key Features Explained

### Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Protected routes check authentication status
5. Auto-logout on token expiration

### Protected Routes

- **User Routes**: Require authentication
- **Admin Routes**: Require authentication + admin role
- **Auto-redirect**: Based on authentication status

### Book Management

- **Modal Interface**: Clean popup forms for add/edit operations
- **Confirmation Dialogs**: Prevent accidental deletions
- **Real-time Updates**: Immediate UI updates after API operations
- **Error Handling**: User-friendly error messages

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Grid Layouts**: Responsive grid systems
- **Navigation**: Mobile-friendly navigation menu
- **Forms**: Touch-friendly form inputs

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup

Make sure your backend server is running on `http://localhost:3000` before starting the frontend.

## 🚀 Deployment

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service

3. **Update API base URL** in `src/api/api.js` if needed for production

## 🔍 Testing the Application

1. **Start both backend and frontend servers**
2. **Register a new user** (try both user and admin roles)
3. **Login and explore** the dashboard
4. **Test book CRUD operations** (create, read, update, delete)
5. **Try admin features** (if you created an admin user)
6. **Test responsive design** on different screen sizes

## 🤝 Integration with Backend

This frontend is specifically designed to work with your Node.js BookStore API backend. Make sure:

- Backend server is running on port 3000
- MongoDB is connected and accessible
- All API endpoints are functional
- CORS is configured to allow frontend requests

## 📝 Notes

- JWT tokens expire in 15 minutes (as configured in your backend)
- The app automatically handles token refresh and logout
- All forms include proper validation and error handling
- The UI is fully responsive and mobile-friendly

Enjoy your full-stack BookStore application! 🎉
