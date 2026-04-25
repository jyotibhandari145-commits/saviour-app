# Smart Campus Saviour 🛡️

A comprehensive **Smart Campus & Infrastructure Management System** designed for modern educational institutions. This progressive web app (PWA) enables students and staff to report infrastructure issues, access emergency services, and navigate campus facilities efficiently.

## 🚀 Features

### Core Functionality
- **Issue Reporting**: Report campus infrastructure problems with photos and GPS location
- **Smart Categorization**: Automatic issue categorization (Water, Electricity, Roads, Buildings, Waste)
- **Risk Prediction**: AI-powered risk assessment for high-risk areas
- **Emergency Response**: Real-time emergency alerts and evacuation guidance
- **Campus Navigation**: Interactive navigation between campus locations
- **Developer Logs**: System monitoring and debugging tools

### Enhanced Features
- **📸 Image Upload**: Attach photos to issue reports for better context
- **📍 GPS Location**: Precise location tracking for accurate emergency response
- **⚠️ Damage Intensity**: Severity levels (Low, Medium, High, Critical) for prioritization
- **🚨 False Report Prevention**: Warning system to prevent misuse
- **📱 PWA Support**: Installable on mobile devices for offline access
- **🔔 Push Notifications**: Emergency alerts and system updates

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Database**: In-memory storage (easily upgradeable to MongoDB)
- **PWA**: Service Worker, Web App Manifest
- **File Upload**: Multer for image handling
- **Deployment**: GitHub Pages compatible

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-campus-saviour.git
   cd smart-campus-saviour
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Deployment

#### Option 1: GitHub Pages (Recommended for Static Frontend)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/dist" folder
   - Save changes

3. **Automatic Deployment**
   - The GitHub Actions workflow will automatically build and deploy
   - Your app will be available at: `https://yourusername.github.io/smart-campus-saviour`

#### Option 2: Heroku/Vercel/Railway (Full-Stack)

For full backend functionality, deploy to a platform that supports Node.js:

```bash
# Heroku
heroku create your-app-name
git push heroku main

# Vercel
vercel --prod

# Railway
railway login
railway link
railway up
```

## 📱 Mobile Installation

The app is designed as a Progressive Web App (PWA) and can be installed on mobile devices:

### Android/iOS Installation
1. Open the app in Chrome/Safari
2. Tap the "Share" button
3. Select "Add to Home Screen"
4. Follow the installation prompts

### Features Available Offline
- View previously loaded issues
- Access emergency contacts
- Basic navigation (cached routes)

## 🎯 Usage Guide

### Reporting an Issue
1. Navigate to the "Report Issue" tab
2. Select campus location from dropdown
3. Describe the issue in detail
4. Choose damage intensity level
5. (Optional) Attach a photo
6. (Optional) Enable GPS location
7. Confirm accuracy and submit

### Emergency Procedures
1. Go to "Emergency" tab
2. Choose emergency type
3. System will alert relevant personnel
4. Follow evacuation guidance if activated

### Navigation
1. Select "Navigation" tab
2. Choose starting point and destination
3. Get turn-by-turn directions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
# Add database URL for production
# DATABASE_URL=mongodb://localhost:27017/smartcampus
```

### Campus Locations
Edit the datalist in `public/index.html` to customize campus locations:

```html
<datalist id="locations">
  <option value="Your Building Name">
  <!-- Add more locations -->
</datalist>
```

## 🛡️ Security & Compliance

- **False Report Prevention**: Users must acknowledge consequences of false reporting
- **Data Privacy**: GPS coordinates are stored securely
- **Image Handling**: Files are validated and stored with unique names
- **Rate Limiting**: Built-in protection against spam reports

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/report` | Submit new issue report |
| GET | `/api/issues` | Retrieve all issues |
| POST | `/api/log` | Add developer log entry |
| POST | `/api/emergency` | Trigger emergency response |
| GET | `/api/navigation` | Get navigation routes |

## 🐛 Troubleshooting

### Common Issues

**App not loading on mobile**
- Ensure HTTPS is enabled for PWA features
- Check service worker registration in browser dev tools

**GPS not working**
- Grant location permissions in browser
- Try refreshing the page

**Images not uploading**
- Check file size (max 5MB)
- Ensure image format is supported (JPG, PNG, etc.)

### Development Tips

- Use browser dev tools for debugging
- Check console for service worker errors
- Test PWA features in Lighthouse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons and emojis from various open-source projects
- PWA inspiration from Google PWA guidelines
- Campus infrastructure management best practices

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Check the developer logs in the app
- Contact campus administration

---

**Made with ❤️ for safer, smarter campuses**

### F. Developer Failure Log System
- Log what broke, why it broke, and how it was fixed
- Persistent storage of all failure logs
- Timestamped entries for reference
- Easy search and review

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js 4.18+ |
| **Database** | In-Memory Arrays (MongoDB optional) |
| **API** | RESTful API with JSON |
| **Package Manager** | npm |

---

## 📁 Project Structure

```
SmartCampusSystem/
├── public/
│   ├── index.html       # Main HTML file (UI structure)
│   ├── style.css        # Complete styling (responsive design)
│   └── script.js        # Frontend logic (API calls & interactions)
├── server.js            # Express.js backend (REST APIs)
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional)

### Step 1: Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd SmartCampusSystem

# Or simply navigate to the project folder
cd SmartCampusSystem
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web framework
- `body-parser` - JSON parsing middleware
- `cors` - Cross-origin resource sharing
- `nodemon` - Auto-restart during development (dev dependency)

### Step 3: Verify Installation
```bash
npm list
```

---

## 🎯 Running the Application

### Option 1: Development Mode (with auto-reload)
```bash
npm run dev
```

### Option 2: Production Mode
```bash
npm start
```

### Expected Output:
```
╔═══════════════════════════════════════════════════╗
║  Smart Campus & Infrastructure Management System  ║
║            Server running on port 3000            ║
║        http://localhost:3000                       ║
╚═══════════════════════════════════════════════════╝
```

### Step 4: Access the Application
1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You should see the Smart Campus dashboard

---

## 📡 API Documentation

### 1. Report an Issue
```http
POST /api/report
Content-Type: application/json

{
  "location": "Building A - Room 101",
  "description": "Water leak from ceiling"
}

Response:
{
  "success": true,
  "message": "Issue reported successfully",
  "issue": { /* issue object */ },
  "highRiskAreas": [ /* array of high-risk areas */ ]
}
```

### 2. Get All Issues
```http
GET /api/issues

Response:
{
  "success": true,
  "totalIssues": 5,
  "issues": [ /* array of issues */ ],
  "groupedIssues": { /* grouped by category */ },
  "highRiskAreas": [ /* high-risk locations */ ],
  "emergencyMode": false
}
```

### 3. Add Developer Log
```http
POST /api/log
Content-Type: application/json

{
  "whatBroke": "Login button not responding",
  "whyBroke": "Database connection timeout",
  "howFixed": "Added timeout handling with retry logic"
}

Response:
{
  "success": true,
  "message": "Failure log added successfully",
  "log": { /* log object */ }
}
```

### 4. Get All Logs
```http
GET /api/logs

Response:
{
  "success": true,
  "totalLogs": 3,
  "logs": [ /* array of logs */ ]
}
```

### 5. Get Navigation Route
```http
GET /api/navigate/:route

Example: /api/navigate/library-cafeteria

Response:
{
  "success": true,
  "route": {
    "distance": "500m",
    "time": "7 mins",
    "directions": "Exit from building A → ..."
  },
  "alternateRoutes": [ /* other available routes */ ]
}
```

### 6. Trigger Emergency
```http
POST /api/emergency/:type

Types: "fire" or "network"

Response:
{
  "success": true,
  "emergencyType": "FIRE",
  "alert": "🚨 FIRE EMERGENCY DETECTED! ...",
  "action": "EVACUATE IMMEDIATELY",
  "alternateRoutes": [ /* exit routes */ ],
  "safeZones": [ /* assembly points */ ]
}
```

### 7. System Status
```http
GET /api/status

Response:
{
  "success": true,
  "systemStatus": "Online",
  "totalIssues": 5,
  "totalLogs": 3,
  "emergencyMode": false,
  "highRiskAreas": []
}
```

---

## 📖 Usage Guide

### 1. Report an Infrastructure Issue
1. Click **"Report Issue"** in navigation menu
2. Enter the location (e.g., "Building A - Room 101")
3. Describe the problem (include category keywords)
4. Click **"Submit Report"**
5. System automatically categorizes and groups issues

### 2. View and Filter Issues
1. Click **"View Issues"** in navigation menu
2. Use the filter dropdown to filter by category
3. Issues display with categorization and timestamp
4. High-risk areas shown with warning indicators

### 3. Navigate Campus
1. Click **"Navigation"** in navigation menu
2. Enter source location
3. Enter destination
4. Get detailed directions with distance and time
5. Click predefined route cards for quick access

### 4. Emergency Response
1. Click **"Emergency"** in navigation menu
2. Click **"Simulate Fire Emergency"** or **"Simulate Network Failure"**
3. View emergency protocols and exit routes
4. Click **"Reset Emergency Mode"** when done

### 5. Log Failures
1. Click **"Developer Logs"** in navigation menu
2. Fill in what broke, why it broke, and how it was fixed
3. Click **"Submit Log"**
4. View all historical logs in the same tab

### 6. Monitor Dashboard
1. Click **"Dashboard"** to see system overview
2. View total issues and high-risk areas
3. See category breakdown
4. Check system status and emergency mode

---

## 🎨 UI Features

### Responsive Design
- ✅ Works on Desktop, Tablet, and Mobile
- ✅ Adaptive grid layouts
- ✅ Touch-friendly buttons and forms

### Modern Styling
- Clean, professional interface
- Color-coded categories (water, electricity, road, building, waste)
- Smooth animations and transitions
- Accessibility-focused design

### Dashboard Analytics
- Real-time statistics
- Category breakdown with emojis
- High-risk area alerts
- Emergency status indicator

---

## 🎁 Bonus Features

### Implemented:
✅ **Animated Pulse Indicator** - System status with pulsing animation
✅ **Loading Spinners** - Visual feedback during API calls
✅ **Color-Coded Cards** - Different colors for issue categories
✅ **Smooth Transitions** - Fade-in animations for tabs
✅ **Responsive Grid** - Auto-adapting layouts
✅ **Alert System** - Success/error notifications
✅ **Tab Navigation** - Smooth switching between sections
✅ **Quick Action Cards** - Predefined routes and emergency buttons

### Potential Extensions:
- MongoDB integration for persistent database
- User authentication and roles
- Email notifications for high-risk areas
- Real-time WebSocket updates
- Advanced analytics and reporting
- Mobile app version
- Integration with campus systems

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Issue: Cannot find module
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS errors
- Ensure the frontend is accessing `http://localhost:3000`
- Backend has CORS enabled by default

### Issue: Changes not reflecting
- Clear browser cache (Ctrl+Shift+Delete)
- Restart the server
- Check browser console for errors (F12)

---

## 📊 Data Persistence

### Current Implementation:
- All data stored in **in-memory arrays**
- Data is **reset when server restarts**
- Perfect for demos and testing

### For Production:
```bash
npm install mongoose
```
Then modify `server.js` to use MongoDB:
```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smartcampus');
```

---

## 🎓 Key Technologies Explained

### Express.js
- Web framework for handling HTTP requests
- Middleware support for JSON parsing
- RESTful API routing

### Vanilla JavaScript
- No external frameworks
- Fetch API for backend communication
- DOM manipulation for dynamic UI

### CSS Grid & Flexbox
- Modern responsive layouts
- Mobile-first approach
- CSS variables for theming

---

## 📝 Code Quality

- ✅ Well-commented code
- ✅ Consistent naming conventions
- ✅ Error handling throughout
- ✅ Modular function design
- ✅ RESTful API standards

---

## 🎉 Hackathon Tips

1. **Live Demo**: Start with dashboard to show system overview
2. **Report Issues**: Submit a few sample issues to demonstrate grouping
3. **Emergency Demo**: Show emergency simulation features
4. **Developer Logs**: Highlight failure documentation capability
5. **Navigation**: Demonstrate route finding
6. **Highlight**: Emphasize the automatic risk prediction algorithm

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console for errors (F12)
4. Verify server is running on correct port

---

## 📄 License

MIT License - Free for hackathon and educational use

---

## 🚀 Next Steps After Hackathon

1. Deploy to cloud (Heroku, AWS, Azure)
2. Add MongoDB for data persistence
3. Implement user authentication
4. Add real-time notifications
5. Create mobile app version
6. Integrate with actual campus systems

---

**Built with ❤️ for Smart Campus Management**

Version 1.0 | Last Updated: April 24, 2026
