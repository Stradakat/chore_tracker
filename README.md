# 🏠 Chore Tracker - Admin Edition

A modern, responsive chore tracking application with **admin authentication** and comprehensive household management features.

## 🔐 **Admin Authentication**

### **Default Login Credentials**
- **Username:** `admin`
- **Password:** `admin123`

### **Security Features**
- Protected routes requiring authentication
- Session persistence using localStorage
- Role-based access control (Admin/User)
- Secure logout functionality

## ✨ **Key Features**

### **🔒 Admin Controls**
- **Admin Dashboard** - Overview of system health and statistics
- **User Management** - Add/remove household members
- **Chore Management** - Full CRUD operations for chores
- **System Monitoring** - Track completion rates and performance

### **🏠 Household Management**
- **25+ Pre-loaded Chores** across 9 categories
- **Pet Care Focus** - Multiple daily pet care tasks
- **Member Assignment** - Assign chores to family members
- **Completion Tracking** - Record who did what and when

### **📱 Modern UI/UX**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Tailwind CSS** - Beautiful, modern styling
- **Shadcn UI** - Professional component library
- **Custom Color Palette** - Sage green, soft white, charcoal gray

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd chore-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Access the App**
1. Open your browser to `http://localhost:3000` (or the port shown)
2. You'll see the **Login Page** first
3. Use the default credentials:
   - Username: `admin`
   - Password: `admin123`
4. Click "Sign In" to access the admin panel

## 🎯 **App Structure**

### **Views**
- **Chores** - Main chore management interface
- **Statistics** - Performance analytics and reports
- **Admin Dashboard** - System overview and admin controls

### **Components**
- **LoginPage** - Authentication interface
- **ProtectedRoute** - Route protection wrapper
- **AuthContext** - Authentication state management
- **AdminDashboard** - Admin-specific features
- **Header** - Navigation with logout functionality
- **Sidebar** - Navigation menu with admin options

## 🎨 **Design System**

### **Color Palette**
- **Primary:** Sage Green (#87A96B)
- **Background:** Soft White (#FEFEFE)
- **Text:** Charcoal Gray (#2F3E46)
- **Accents:** Muted Blue (#6B9DC2), Soft Coral (#E07A5F)
- **Status:** Fresh Green (#81C784), Amber Yellow (#FFB74D), Gentle Red (#E57373)

### **Typography**
- **Headings:** Modern, readable fonts
- **Body:** Clean, accessible text
- **Mobile Optimized:** Responsive font sizing

## 🔧 **Technical Implementation**

### **Frontend**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### **State Management**
- **React Context** - Authentication state
- **Local Storage** - Data persistence
- **React Hooks** - Component state management

### **Authentication Flow**
1. User visits app → redirected to login
2. Enter credentials → validation
3. Success → redirect to main app
4. Session stored in localStorage
5. Protected routes check authentication
6. Logout → clear session → return to login

## 📱 **Mobile Features**

### **Responsive Design**
- **Mobile-first** approach
- **Touch-friendly** interface
- **Collapsible sidebar** for mobile
- **Optimized layouts** for all screen sizes

### **Mobile Optimizations**
- 44px minimum touch targets
- Responsive typography
- Mobile-friendly modals
- Optimized spacing and padding

## 🐱 **Pet Care Features**

### **Multiple Daily Chores**
- **Cat Litter Box** - 2x daily cleaning
- **Pet Feeding** - 2x daily feeding
- **Dog Walking** - 3x daily walks
- **Progress Tracking** - Daily completion counters

### **Smart Scheduling**
- **Frequency-based** due dates
- **Overdue detection** with visual indicators
- **Completion progress** bars
- **Next due time** calculations

## 🔒 **Security Considerations**

### **Current Implementation**
- Client-side authentication (demo purposes)
- Local storage for session management
- Protected routes and components

### **Production Recommendations**
- **Backend API** with JWT tokens
- **HTTPS** encryption
- **Password hashing** (bcrypt)
- **Rate limiting** for login attempts
- **Session timeout** and refresh tokens

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Deploy Options**
- **Vercel** - One-click deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting
- **Custom Server** - Node.js/Express backend

## 📊 **Data Structure**

### **Chore Object**
```typescript
interface Chore {
  id: string;
  name: string;
  description: string;
  category: ChoreCategory;
  frequency: Frequency;
  completionsPerDay?: number;
  estimatedTime: number;
  assignee?: string;
  isActive: boolean;
  createdAt: Date;
  lastCompleted?: Date;
  nextDueDate: Date;
  completedToday?: number;
}
```

### **User Object**
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}
```

## 🤝 **Contributing**

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Style**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Component-based** architecture

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

### **Common Issues**
- **Blank page after login** - Check browser console for errors
- **CSS not loading** - Ensure Tailwind CSS is properly configured
- **Authentication failing** - Verify credentials and localStorage

### **Getting Help**
- Check the browser console for error messages
- Verify all dependencies are installed
- Ensure Node.js version is compatible

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

*Your household chores, organized and tracked with admin precision!*
# chore_tracker
