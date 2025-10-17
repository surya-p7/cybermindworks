# 🚀 Deployment Guide - Render Platform

This guide will help you deploy the CyberMindWorks Job Portal to Render.

---

## 📋 Pre-Deployment Checklist

✅ **Phase 1 Complete** - Code is ready for deployment
- [x] CORS configured for production
- [x] Database configuration supports DATABASE_URL
- [x] Environment variable examples created
- [x] Build scripts verified
- [x] .gitignore configured

---

## 🔐 Environment Variables Reference

### Backend Environment Variables (Render)

```env
DATABASE_URL=<provided_by_render_postgresql>
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-name.onrender.com
```

### Frontend Environment Variables (Render)

```env
REACT_APP_BACKEND_URL=https://your-backend-name.onrender.com
```

---

## 📝 Deployment Steps Summary

### Step 1: Push to GitHub ✅
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create PostgreSQL Database
1. Go to Render Dashboard
2. New → PostgreSQL
3. Name: `jobportal-db`
4. Copy Internal Database URL

### Step 3: Deploy Backend
1. New → Web Service
2. Connect GitHub repo
3. Root Directory: `backend-nestjs`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start:prod`
6. Add environment variables (see above)

### Step 4: Deploy Frontend
1. New → Static Site
2. Connect GitHub repo
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `build`
6. Add REACT_APP_BACKEND_URL

### Step 5: Update CORS
1. Update FRONTEND_URL in backend environment variables
2. Redeploy backend

### Step 6: Test
- Test backend API endpoints
- Test frontend application
- Test authentication flow
- Test job application flow

---

## 🎯 Important Notes

### Database Configuration
- Render provides `DATABASE_URL` automatically for PostgreSQL
- SSL is required and configured in `app.module.ts`
- `synchronize: true` is enabled for initial deployment (change to false later)

### CORS Configuration
- Configured in `main.ts` to accept production frontend URL
- Update `FRONTEND_URL` environment variable after frontend deployment

### Build Process
- Backend: TypeScript compiled to JavaScript in `dist/` folder
- Frontend: React app built to static files in `build/` folder

---

## 🔍 Troubleshooting

### Backend Issues
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly
- Ensure JWT_SECRET is set
- Check CORS configuration

### Frontend Issues
- Verify REACT_APP_BACKEND_URL is correct
- Check browser console for errors
- Ensure backend is deployed and running

### Database Issues
- Verify DATABASE_URL format
- Check SSL configuration
- Ensure database is running

---

## 📊 Deployment Timeline

| Phase | Status |
|-------|--------|
| Phase 1: Pre-deployment prep | ✅ COMPLETE |
| Phase 2: GitHub setup | ⏳ NEXT |
| Phase 3: Database deployment | ⏳ PENDING |
| Phase 4: Backend deployment | ⏳ PENDING |
| Phase 5: Frontend deployment | ⏳ PENDING |
| Phase 6: CORS update | ⏳ PENDING |
| Phase 7: Testing | ⏳ PENDING |

---

## 🎉 Success Criteria

- ✅ Backend API accessible at `https://your-backend.onrender.com`
- ✅ Swagger docs available at `https://your-backend.onrender.com/api`
- ✅ Frontend accessible at `https://your-frontend.onrender.com`
- ✅ User registration works
- ✅ User login works
- ✅ Job listing displays
- ✅ Job application works
- ✅ Profile page shows data

---

**Ready for Phase 2: GitHub Setup**
