# Doctor License Management

A comprehensive Medical SaaS platform for managing doctor licenses with automatic expiry tracking, search functionality, and status management.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

### Backend (.NET 8 Web API)
- **Domain Layer**: Core business entities and enums
- **Application Layer**: Services, DTOs, and interfaces
- **Infrastructure Layer**: Data access, Entity Framework, and repositories
- **API Layer**: Controllers with full CRUD operations

### Frontend (Next.js 14)
- **Modern React**: TypeScript with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks for local state
- **API Integration**: Fetch API with error handling

## 🚀 Features

### Core Functionality
- ✅ **CRUD Operations**: Create, Read, Update, Delete (soft delete)
- ✅ **Search**: Search by name or license number
- ✅ **Filtering**: Filter by license status (Active/Expired/Suspended)
- ✅ **Auto Status Update**: Automatically marks licenses as expired
- ✅ **Validation**: Comprehensive input validation with error messages
- ✅ **Duplicate Prevention**: Prevents duplicate license numbers and emails

### Advanced Features (Bonus)
- ✅ **Pagination**: Efficient data pagination with navigation
- ✅ **Modal Forms**: Clean modal interface for add/edit operations
- ✅ **Status Badges**: Visual status indicators with color coding
- ✅ **Expired Highlighting**: Visual emphasis on expired licenses
- ✅ **Loading States**: Professional loading indicators
- ✅ **Empty States**: User-friendly empty state messages
- ✅ **Responsive Design**: Mobile-first responsive layout

### Database Features
- ✅ **Stored Procedures**: Optimized database queries
- ✅ **Soft Delete**: Data preservation with soft delete
- ✅ **Indexing**: Performance-optimized database indexes
- ✅ **Triggers**: Automatic status updates based on expiry dates
- ✅ **Sample Data**: Pre-populated with test data

## 🛠️ Tech Stack

### Backend
- **.NET 8**: Latest LTS with performance improvements
- **Entity Framework Core 8.0**: Modern ORM with SQL Server
- **SQL Server**: Robust relational database
- **Clean Architecture**: Maintainable and testable code
- **Swagger/OpenAPI**: Interactive API documentation

### Frontend
- **Next.js 14**: App Router with server components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React 18**: Modern React with hooks

## 📋 Requirements

### Prerequisites
- **.NET 8 SDK**: [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **SQL Server**: LocalDB or full SQL Server instance
- **Git**: For version control

### Development Tools
- **Visual Studio 2022** or **VS Code** with C# and TypeScript extensions
- **SQL Server Management Studio** for database management
- **Postman** or similar API testing tool

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/ahmad-amin4436/DoctorLicenseManagement.git
cd DoctorLicenseManagement
```

### 2. Database Setup

#### Option A: Automatic (Recommended)
```bash
# Navigate to Database folder
cd Database

# Execute schema and stored procedures
sqlcmd -S "(localdb)\mssqllocaldb" -i schema.sql
sqlcmd -S "(localdb)\mssqllocaldb" -i stored-procedures.sql
```

#### Option B: Manual
1. Open **SQL Server Management Studio**
2. Connect to `(localdb)\mssqllocaldb`
3. Execute `Database/schema.sql`
4. Execute `Database/stored-procedures.sql`

### 3. Backend Setup

```bash
# Navigate to API project
cd DoctorLicenseManagement.API

# Restore dependencies
dotnet restore

# Run the API
dotnet run
```

The API will be available at:
- **Development**: `https://localhost:5039`
- **Swagger UI**: `https://localhost:5039` (root)
- **Health Check**: `https://localhost:5039/health`

### 4. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
https://localhost:5039/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | Get all doctors with search and pagination |
| GET | `/doctors/{id}` | Get doctor by ID |
| GET | `/doctors/expired` | Get expired doctors |
| POST | `/doctors` | Create new doctor |
| PUT | `/doctors/{id}` | Update doctor |
| PATCH | `/doctors/{id}/status` | Update doctor status |
| DELETE | `/doctors/{id}` | Soft delete doctor |

### Query Parameters
```
GET /doctors?searchTerm=john&status=Active&pageNumber=1&pageSize=50
```

### Request/Response Examples

#### Create Doctor
```json
POST /api/doctors
{
  "fullName": "Dr. John Smith",
  "email": "john.smith@email.com",
  "specialization": "Cardiology",
  "licenseNumber": "MED123456",
  "licenseExpiryDate": "2025-12-31"
}
```

#### Search Response
```json
{
  "data": [...],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 50,
  "totalPages": 2,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

## 🎯 Business Rules

### License Status Logic
- **Active**: License not expired and not suspended
- **Expired**: License expiry date < today
- **Suspended**: Manually suspended (overrides expired status)

### Validation Rules
- **Required Fields**: All fields marked with * are required
- **Email Format**: Valid email address required
- **Future Date**: License expiry must be in the future
- **Unique Constraints**: License number and email must be unique
- **Character Limits**: Enforced at database level

### Automatic Operations
- **Status Updates**: Database triggers automatically update expired status
- **Soft Delete**: Records are marked as deleted, not physically removed
- **Audit Trail**: CreatedDate and DeletedDate are automatically managed

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### API Testing with Postman
1. Import the Postman collection (if provided)
2. Set environment variable: `{{baseUrl}} = https://localhost:5039/api`
3. Test all endpoints with various scenarios

### Frontend Testing
```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Build for production
npm run build
```

## 🔧 Configuration

### Database Connection
Update `appsettings.json` in the API project:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your_server;Database=DoctorLicenseManagement;User Id=your_user;Password=your_password;TrustServerCertificate=true;"
  }
}
```

### Frontend Environment
Create `.env.local` in frontend folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5039/api
```

## 📊 Performance Considerations

### Database Optimizations
- **Stored Procedures**: Complex queries use stored procedures
- **Indexes**: Strategic indexes on frequently queried columns
- **Pagination**: Server-side pagination prevents large result sets
- **Soft Delete**: Maintains data integrity while improving query performance

### Frontend Optimizations
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component usage
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Appropriate caching strategies

## 🚀 Deployment

### Backend Deployment
```bash
# Publish for production
dotnet publish -c Release -o ./publish

# Deploy to IIS/Azure/App Service
# Configure connection string for production environment
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy .next folder to hosting provider
# Configure environment variables
```

## 🔄 Development Workflow

### Git Workflow
1. **Feature Branches**: Create branches for new features
2. **Pull Requests**: Submit PRs for code review
3. **CI/CD**: Automated testing and deployment
4. **Version Tags**: Tag releases for version management

### Code Quality
- **ESLint**: Frontend code linting
- **TypeScript**: Type safety enforcement
- **Clean Code**: SOLID principles adherence
- **Comments**: Comprehensive XML documentation

## 🐛 Troubleshooting

### Common Issues

#### Backend
- **Connection Issues**: Check SQL Server service and connection string
- **Migration Errors**: Ensure database schema is up to date
- **CORS Issues**: Verify frontend URL is allowed

#### Frontend
- **Build Errors**: Check Node.js version compatibility
- **Type Errors**: Ensure TypeScript configuration is correct
- **API Errors**: Check network tab and API logs

### Debug Tips
- **Backend**: Use Visual Studio debugger or `dotnet run --launch-profile https`
- **Frontend**: Use browser dev tools and React DevTools
- **Database**: Use SQL Server Profiler for query optimization

## 📈 Future Enhancements

### Planned Features
- [ ] **Role-Based Access**: Different permissions for different user types
- [ ] **Audit Logging**: Comprehensive audit trail
- [ ] **Email Notifications**: Automatic expiry notifications
- [ ] **File Upload**: Document management for licenses
- [ ] **Dashboard**: Analytics and reporting features
- [ ] **Mobile App**: React Native mobile application

### Technical Improvements
- [ ] **Microservices**: Split into smaller, focused services
- [ ] **CQRS**: Command Query Responsibility Segregation
- [ ] **Event Sourcing**: Event-driven architecture
- [ ] **Testing**: Unit and integration test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
6. Ensure all tests pass

## 📞 Support

For questions and support: +971 52 508 1961
- Create an issue in the GitHub repository
- Check existing documentation
- Review the troubleshooting section

---

**Built with ❤️ for the medical community**