# LegalSift Backend

AI-driven legal assistant backend built with Node.js, Express, and MongoDB.

## Features

### Core Features
- **User Management**: Registration, authentication, profile management
- **Lawyer Management**: Registration, verification, profile management
- **Admin Dashboard**: Platform management, lawyer verification, analytics
- **AI Integration**: Document analysis, chat assistance, risk assessment
- **Payment Processing**: Stripe integration for consultations
- **Real-time Chat**: Socket.io for user-lawyer communication
- **Document Analysis**: AI-powered legal document analysis
- **Multi-language Support**: Support for 10 Indian languages

### AI Capabilities
- Document text extraction (PDF, DOC, DOCX, TXT)
- Legal risk assessment and scoring
- Clause-level analysis and flagging
- Plain language explanations
- Multi-language translation
- Voice summaries
- Interactive Q&A

### Security Features
- JWT authentication
- Role-based access control
- Encrypted document storage
- Secure file uploads
- Input validation and sanitization
- Rate limiting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payment**: Stripe
- **AI**: OpenAI GPT-4
- **Real-time**: Socket.io
- **Email**: Nodemailer

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp env.example .env
```

4. Configure environment variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/legalsift

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password
- `PUT /api/auth/update-profile` - Update profile
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile-picture` - Upload profile picture
- `GET /api/users/documents` - Get user documents
- `GET /api/users/cases` - Get user cases
- `DELETE /api/users/account` - Delete account
- `PUT /api/users/deactivate` - Deactivate account

### Lawyers
- `POST /api/lawyers/register` - Register as lawyer
- `GET /api/lawyers/profile/me` - Get lawyer profile
- `PUT /api/lawyers/profile/me` - Update lawyer profile
- `POST /api/lawyers/verification-documents` - Upload verification docs
- `GET /api/lawyers/cases/me` - Get lawyer cases
- `GET /api/lawyers/earnings/me` - Get lawyer earnings
- `PUT /api/lawyers/availability/me` - Update availability
- `GET /api/lawyers/reviews/me` - Get lawyer reviews
- `GET /api/lawyers/search` - Search lawyers
- `GET /api/lawyers/:id` - Get lawyer by ID

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/lawyers/pending` - Get pending lawyers
- `PUT /api/admin/lawyers/:id/verify` - Verify lawyer
- `PUT /api/admin/lawyers/:id/reject` - Reject lawyer
- `GET /api/admin/lawyers` - Get all lawyers
- `GET /api/admin/users` - Get all users
- `GET /api/admin/cases` - Get all cases
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/:id` - Get chat by ID
- `DELETE /api/chat/:id` - Delete chat
- `POST /api/chat/voice-summary` - Generate voice summary

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get documents
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents/:id/analyze` - Analyze document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/share` - Share document
- `GET /api/documents/:id/analysis` - Get document analysis
- `POST /api/documents/:id/translate` - Translate document

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments` - Get payments
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments/:id/refund` - Process refund

### Cases
- `POST /api/cases` - Create case
- `GET /api/cases` - Get cases
- `GET /api/cases/:id` - Get case by ID
- `PUT /api/cases/:id/status` - Update case status
- `POST /api/cases/:id/messages` - Send message in case
- `GET /api/cases/:id/messages` - Get case messages
- `POST /api/cases/:id/feedback` - Submit feedback
- `GET /api/cases/:id/feedback` - Get case feedback
- `DELETE /api/cases/:id` - Delete case

## Database Models

### User
- Basic user information
- Authentication details
- Preferences and settings
- Subscription information

### Lawyer
- Professional details
- Verification status
- Specializations and experience
- Availability and pricing
- Reviews and ratings

### Case
- Case details and status
- User-lawyer relationship
- Messages and communication
- Payment information
- AI analysis results

### Document
- File information
- AI analysis results
- Sharing permissions
- Version control

### Payment
- Payment details
- Stripe integration
- Refund information
- Platform fee calculation

### Chat
- Message history
- AI conversations
- Real-time communication

### Admin
- Admin permissions
- System management

## AI Integration

The backend integrates with OpenAI's GPT-4 for:
- Document analysis and risk assessment
- Legal text summarization
- Multi-language translation
- Interactive chat assistance
- Voice summary generation

## Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- Encrypted document storage
- Secure file uploads

## Error Handling

Comprehensive error handling with:
- Custom error messages
- HTTP status codes
- Validation errors
- Database errors
- External API errors

## Testing

```bash
npm test
```

## Deployment

1. Set up production environment variables
2. Configure MongoDB Atlas
3. Set up Cloudinary account
4. Configure Stripe webhooks
5. Deploy to your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
