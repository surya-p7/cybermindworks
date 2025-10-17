# Backend Changes - Authentication & Job Application System

## Overview
Implemented a complete authentication system with JWT tokens, protected routes, and proper database relationships for the job portal application.

---

## Database Schema Changes

### 1. **User Entity** (`users` table)
**New Fields:**
- `role` - User role: 'jobseeker' or 'employer' (default: 'jobseeker')
- `phone` - User phone number (nullable)
- `location` - User location (nullable)
- `bio` - User biography (nullable, text)
- `createdAt` - Timestamp when user was created
- `updatedAt` - Timestamp when user was last updated

**Relationships:**
- `postedJobs` - One-to-Many with Job entity
- `applications` - One-to-Many with JobApplication entity

---

### 2. **Job Entity** (`jobs` table)
**New Fields:**
- `jobType` - Type of job (e.g., Full-time, Part-time)
- `salary` - Salary range
- `requirements` - Job requirements (text)
- `responsibilities` - Job responsibilities (text)
- `deadline` - Application deadline (date)
- `status` - Job status: 'active', 'closed', 'draft' (default: 'active')
- `postedById` - Foreign key to User who posted the job
- `createdAt` - Timestamp when job was created
- `updatedAt` - Timestamp when job was last updated

**Relationships:**
- `postedBy` - Many-to-One with User entity
- `applications` - One-to-Many with JobApplication entity

---

### 3. **JobApplication Entity** (`job_applications` table)
**New Fields:**
- `applicantId` - Foreign key to User who applied
- `resume` - URL or path to resume file (nullable)
- `status` - Application status: 'pending', 'reviewed', 'accepted', 'rejected' (default: 'pending')
- `createdAt` - Timestamp when application was created
- `updatedAt` - Timestamp when application was last updated

**Relationships:**
- `job` - Many-to-One with Job entity
- `applicant` - Many-to-One with User entity

---

## New Modules & Features

### 1. **Auth Module** (`src/auth/`)
Complete authentication system with JWT tokens.

**Files Created:**
- `auth.module.ts` - Main auth module
- `auth.service.ts` - Authentication business logic
- `auth.controller.ts` - Auth endpoints
- `dto/register.dto.ts` - Registration validation
- `dto/login.dto.ts` - Login validation
- `strategies/jwt.strategy.ts` - JWT passport strategy
- `guards/jwt-auth.guard.ts` - JWT authentication guard

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile (protected)

**Features:**
- Password hashing with bcrypt (10 rounds)
- JWT token generation (7-day expiration)
- Email uniqueness validation
- Role-based user creation

---

### 2. **Protected Job Routes**
Updated Jobs module to require authentication for certain operations.

**Protected Endpoints:**
- `POST /jobs` - Create job (requires auth, employer only)
- `GET /jobs/my-jobs` - Get user's posted jobs (requires auth)
- `PATCH /jobs/:id` - Update job (requires auth, only by poster)
- `DELETE /jobs/:id` - Delete job (requires auth, only by poster)

**Public Endpoints:**
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get specific job with applicants

**Features:**
- Automatic `postedById` assignment
- Authorization checks (only poster can edit/delete)
- Relationships loaded (postedBy, applications)

---

### 3. **Job Applications System**
Complete job application workflow with proper authorization.

**Endpoints:**
- `POST /applications` - Apply to job (requires auth)
- `GET /applications/my-applications` - Get user's applications (requires auth)
- `GET /applications/job/:jobId` - Get job applicants (requires auth, only by poster)
- `PATCH /applications/:id/status` - Update application status (requires auth, only by poster)

**Features:**
- Duplicate application prevention
- Job existence validation
- Authorization checks
- Status management (pending → reviewed → accepted/rejected)
- Resume upload support

---

### 4. **User Profile Management**
New Users controller for profile operations.

**Endpoints:**
- `GET /users/profile` - Get current user profile with applications and posted jobs (requires auth)
- `PATCH /users/profile` - Update user profile (requires auth)
- `GET /users/:id` - Get user by ID (public)

**Features:**
- Profile includes all applications with job details
- Profile includes all posted jobs with applications
- Password excluded from responses
- Updatable fields: fullName, phone, location, bio

---

## Security Features

### 1. **Authentication**
- JWT tokens with 7-day expiration
- Bearer token authentication
- Secure password hashing (bcrypt, 10 rounds)
- Token validation on protected routes

### 2. **Authorization**
- Role-based access (jobseeker vs employer)
- Resource ownership validation
- Only job posters can:
  - Edit/delete their jobs
  - View applicants
  - Update application status
- Only applicants can view their own applications

### 3. **Validation**
- Email format validation
- Password minimum length (6 characters)
- Required field validation
- Duplicate prevention (email, applications)

---

## API Documentation

### Swagger Integration
All endpoints are documented with Swagger/OpenAPI:
- Access at: `http://localhost:3001/api`
- Bearer token authentication support
- Request/response examples
- Validation rules

---

## Environment Variables

**Required in `.env`:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=jobportal

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT (new)
JWT_SECRET=your-secret-key-change-in-production
```

---

## Database Migration

**Important:** The database schema has changed significantly. When you start the backend:

1. TypeORM will automatically create new columns and tables (synchronize: true)
2. Existing data may need migration:
   - Jobs without `postedById` will cause errors
   - Applications without `applicantId` will cause errors

**Recommendation:** For development, drop and recreate the database:
```sql
DROP DATABASE jobportal;
CREATE DATABASE jobportal;
```

---

## Testing

### Run the Test Suite
```bash
# Make sure backend is running on port 3001
npm run start:dev

# In another terminal, run tests
node test-auth-flow.js
```

### Test Coverage
The test suite covers:
1. User registration (employer)
2. User login
3. Get user profile
4. Create job without auth (should fail)
5. Create job with auth
6. Get all jobs (public)
7. Register job seeker
8. Apply to job
9. Duplicate application (should fail)
10. Get user applications
11. Get job applicants (employer)
12. Update application status
13. Get user profile with applications
14. Get posted jobs

---

## Breaking Changes

### For Frontend Integration

1. **Job Creation** now requires authentication:
   ```javascript
   // Before
   axios.post('/jobs', jobData)
   
   // After
   axios.post('/jobs', jobData, {
     headers: { Authorization: `Bearer ${token}` }
   })
   ```

2. **Job Application** requires authentication:
   ```javascript
   axios.post('/applications', {
     jobId: 'xxx',
     coverLetter: 'xxx'
   }, {
     headers: { Authorization: `Bearer ${token}` }
   })
   ```

3. **HTTP Method Change**:
   - Job updates: `PUT` → `PATCH`
   - Application status: `PUT` → `PATCH`

4. **Response Structure**:
   - Jobs now include `postedBy` object
   - Jobs include `applications` array
   - Applications include `applicant` and `job` objects

---

## Next Steps

### Frontend Updates Needed:
1. ✅ Create login/register pages
2. ✅ Store JWT token (localStorage/sessionStorage)
3. ✅ Add token to API requests
4. ✅ Create protected routes
5. ✅ Update job creation to require auth
6. ✅ Update job application to require auth
7. ✅ Add user profile page with applications
8. ✅ Show applicants to job posters
9. ✅ Add logout functionality
10. ✅ Handle token expiration

---

## Success Criteria

✅ Users can register and login
✅ JWT tokens are generated and validated
✅ Only authenticated users can post jobs
✅ Only authenticated users can apply to jobs
✅ Users cannot apply to the same job twice
✅ Job posters can view all applicants
✅ Job posters can update application status
✅ Users can view their application history
✅ Users can view their posted jobs
✅ Proper authorization checks in place
✅ Database relationships working correctly
✅ Swagger documentation available

---

## Support

For issues or questions:
1. Check Swagger docs: `http://localhost:3001/api`
2. Review test output: `node test-auth-flow.js`
3. Check backend logs for errors
4. Verify database schema in PostgreSQL
