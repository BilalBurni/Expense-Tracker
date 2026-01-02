# Expense Tracker

A modern, feature-rich expense tracking application built with Next.js, TypeScript, React, and MongoDB.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Add, edit, and delete expenses
- ✅ Categorize expenses (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other)
- ✅ Filter expenses by category
- ✅ View expense summary with statistics
- ✅ Monthly analysis with trends and comparisons
- ✅ Track expenses by date
- ✅ Category-wise expense breakdown
- ✅ MongoDB database integration
- ✅ Password hashing with bcrypt
- ✅ Responsive design
- ✅ Modern dark theme (Black, Gray, Silver)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
expense-tracker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   └── expenses/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── components/
│   │   ├── ExpenseForm/      # Form for adding/editing expenses
│   │   ├── ExpenseList/       # List of all expenses
│   │   ├── ExpenseSummary/   # Summary statistics
│   │   └── MonthlyAnalysis/  # Monthly analysis
│   ├── context/
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ExpenseContext.tsx # Expense state
│   ├── login/                # Login/Register page
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── lib/
│   └── mongodb.ts            # MongoDB connection
├── .env.local               # Environment variables
└── package.json
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **MongoDB** - Database
- **bcryptjs** - Password hashing
- **React Context API** - State management
- **CSS Modules** - Scoped styling
- **React Icons** - Icon library

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses for logged-in user
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  title: String,
  amount: Number,
  category: String,
  date: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

1. **Register**: Go to `/login`, click "Register", and create your account
2. **Login**: Use your email and password to login
3. **Add Expense**: Click "Add Expense" button and fill in the form
4. **Edit Expense**: Click the edit icon on any expense item
5. **Delete Expense**: Click the delete icon on any expense item
6. **Filter Expenses**: Use the category filter dropdown
7. **View Summary**: Check the summary section for statistics
8. **Monthly Analysis**: View monthly trends and breakdowns

## Build for Production

```bash
npm run build
npm start
```

## Security Notes

- Passwords are hashed using bcryptjs before storing in database
- User authentication required for all expense operations
- Each user can only access their own expenses
- API routes validate user ID from headers

## License

MIT
