# Trail App - Full Stack Application

A modern full-stack web application built with Node.js, Express, MongoDB, and vanilla JavaScript. This application provides user authentication and product management functionality.

## Features

### Frontend
- **Modern Responsive Design**: Beautiful, mobile-first UI with smooth animations
- **User Authentication**: Login and registration with form validation
- **Product Management**: Create, read, update, and delete products
- **User Profile**: View user information and manage account
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during API calls
- **Mobile Navigation**: Hamburger menu for mobile devices

### Backend
- **RESTful API**: Clean API endpoints for authentication and products
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Input validation using Joi
- **MongoDB Integration**: Database operations with Mongoose
- **Error Handling**: Comprehensive error handling and responses
- **CORS Support**: Cross-origin resource sharing enabled

## Project Structure

```
trail/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript functionality
├── controllers/           # Route controllers (if needed)
├── databaseconnection/    # Database configuration
│   └── connection.js
├── models/               # Database models
│   ├── userModel.js      # User schema and methods
│   └── productModel.js   # Product schema and methods
├── Routes/               # API routes
│   ├── authRoutes.js     # Authentication routes
│   └── productRoutes.js  # Product management routes
├── validations/          # Input validation schemas
│   ├── userValidations.js
│   └── productValidations.js
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Steps

1. **Clone or download the project**
   ```bash
   cd trail
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5005
   MONGODB_URI=mongodb://localhost:27017/trail-app
   JWT_SECRET=your-secret-key-here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the application**
   ```bash
   npm start
   # or
   node index.js
   ```

6. **Access the application**
   Open your browser and go to `http://localhost:5005`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)
- `PATCH /api/products/:id` - Partial update product (requires auth)

## Usage

### User Registration
1. Click the "Register" button in the navigation
2. Fill in the registration form:
   - Full Name
   - Email address
   - Password (minimum 6 characters with at least one uppercase letter)
   - Phone number (10-11 digits)
3. Click "Register" to create your account

### User Login
1. Click the "Login" button in the navigation
2. Enter your email and password
3. Click "Login" to access your account

### Product Management
1. After logging in, navigate to the "Products" section
2. Click "Add Product" to create a new product
3. Fill in the product details:
   - Product name
   - Description
   - Price
   - Category
4. Click "Save Product" to add it to your collection
5. Use the "Edit" and "Delete" buttons to manage existing products

### User Profile
1. Click on "Profile" in the navigation to view your account information
2. View your name, email, and role

## Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No frameworks, pure JS
- **Font Awesome**: Icons
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Joi**: Data validation
- **JWT**: JSON Web Tokens for authentication

## Features in Detail

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile devices
- Flexible grid layouts
- Touch-friendly interface

### Authentication System
- Secure password requirements
- JWT token-based authentication
- Persistent login sessions
- Protected routes

### Product Management
- CRUD operations for products
- Real-time updates
- Form validation
- Error handling

### User Experience
- Loading spinners
- Toast notifications
- Smooth animations
- Intuitive navigation

## Development Notes

### Adding New Features
1. Create new routes in the `Routes/` directory
2. Add corresponding models in `models/`
3. Update the frontend JavaScript to handle new endpoints
4. Add validation schemas in `validations/`

### Styling
- All styles are in `public/styles.css`
- Uses CSS custom properties for consistent theming
- Mobile-responsive breakpoints
- Modern CSS features (Grid, Flexbox, animations)

### Database
- Uses MongoDB with Mongoose ODM
- Models include validation and methods
- Timestamps automatically added
- Soft delete for products

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Or kill the process using the port

3. **CORS Issues**
   - The app is configured to serve static files
   - API calls are made to the same origin

4. **Authentication Issues**
   - Check if JWT_SECRET is set in `.env`
   - Clear browser localStorage if needed

## Future Enhancements

- User profile editing
- Product image uploads
- Search and filtering
- Pagination
- Admin dashboard
- Email notifications
- Password reset functionality
- Product categories management
- Order management system

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please check the troubleshooting section or create an issue in the project repository.
