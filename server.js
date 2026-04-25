// ===================================================
// Smart Campus & Infrastructure Management System
// Backend Server with Express.js
// ===================================================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// ===================================================
// MIDDLEWARE
// ===================================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===================================================
// IN-MEMORY DATABASE
// ===================================================
let issues = [];
let developerlogs = [];
let emergencyMode = false;
let evacuationStatus = [];
let currentEmergency = null;

// Keywords for smart grouping
const categoryKeywords = {
  water: ['water', 'leak', 'pipe', 'flood', 'drainage', 'tap', 'wetness'],
  electricity: ['electricity', 'power', 'light', 'switch', 'circuit', 'bulb', 'outage'],
  road: ['road', 'pothole', 'pavement', 'crack', 'asphalt', 'sidewalk'],
  building: ['building', 'wall', 'ceiling', 'roof', 'structure', 'paint', 'door', 'window'],
  waste: ['waste', 'garbage', 'trash', 'dustbin', 'litter', 'rubbish']
};

// Predefined routes for navigation
const routes = {
  // Library & Core Facilities
  'library-cafeteria': {
    distance: '500m',
    time: '7 mins',
    directions: 'Exit from building A → Cross main quad → Turn left at fountain → Reach cafeteria'
  },
  'classroom-labs': {
    distance: '300m',
    time: '5 mins',
    directions: 'Exit from main building → Follow corridor → Go up stairs → First right → Labs entrance'
  },
  'office-library': {
    distance: '400m',
    time: '6 mins',
    directions: 'Start from admin office → Head towards central plaza → Pass by sports field → Library ahead'
  },
  'entrance-auditorium': {
    distance: '600m',
    time: '10 mins',
    directions: 'Enter from main gate → Follow main road → Right at traffic light → Auditorium signboard'
  },
  'cafeteria-hostel': {
    distance: '800m',
    time: '12 mins',
    directions: 'From cafeteria → Exit towards north wing → Cross bridge → Follow hostel signs'
  },
  
  // Hospital Routes
  'hospital-main-gate': {
    distance: '1200m',
    time: '18 mins',
    directions: 'From main gate → Follow medical zone signs → Hospital on left side'
  },
  'block-1-hospital': {
    distance: '950m',
    time: '15 mins',
    directions: 'From Block-1 → Head north towards medical complex → Follow hospital signage'
  },
  
  // Mall & Food Courts
  'unimall-block-1': {
    distance: '450m',
    time: '7 mins',
    directions: 'From UniMall → Head east → Pass through plaza → Block-1 main entrance'
  },
  'food-courts-gh-1': {
    distance: '350m',
    time: '6 mins',
    directions: 'From Food Courts → Head south → Cross pathway → GH-1 gate'
  },
  'food-courts-bh-5': {
    distance: '400m',
    time: '7 mins',
    directions: 'From Food Courts → Head west → Follow signage → BH-5 main entrance'
  },
  
  // Girls Hostel Routes
  'gh-1-library': {
    distance: '650m',
    time: '10 mins',
    directions: 'From GH-1 → Head north → Cross main avenue → Library building ahead'
  },
  'gh-5-hospital': {
    distance: '800m',
    time: '13 mins',
    directions: 'From GH-5 → Head east → Follow medical zone → Hospital entrance'
  },
  'gh-9-admin': {
    distance: '750m',
    time: '12 mins',
    directions: 'From GH-9 → Head north → Pass central plaza → Admin office building'
  },
  
  // Boys Hostel Routes
  'bh-1-library': {
    distance: '550m',
    time: '9 mins',
    directions: 'From BH-1 → Head east → Cross quad → Library ahead'
  },
  'bh-10-sports': {
    distance: '600m',
    time: '10 mins',
    directions: 'From BH-10 → Head west → Sports complex on left'
  },
  'bh-5-unimall': {
    distance: '500m',
    time: '8 mins',
    directions: 'From BH-5 → Head south → UniMall complex ahead'
  },
  
  // Block Routes
  'block-1-block-2': {
    distance: '150m',
    time: '3 mins',
    directions: 'From Block-1 → Cross walkway → Block-2 main entrance'
  },
  'block-2a-block-3': {
    distance: '200m',
    time: '4 mins',
    directions: 'From Block-2A → Head south → Block-3 building ahead'
  },
  'block-10-block-20': {
    distance: '400m',
    time: '7 mins',
    directions: 'From Block-10 → Follow campus road → Block-20 sector'
  },
  'block-50-library': {
    distance: '900m',
    time: '15 mins',
    directions: 'From Block-50 → Head towards central zone → Library building'
  },
  'block-73-admin': {
    distance: '1100m',
    time: '18 mins',
    directions: 'From Block-73 → Head west → Cross main avenue → Admin office'
  },
  
  // SDMA Routes
  'sdma-library': {
    distance: '300m',
    time: '5 mins',
    directions: 'From SDMA → Head north → Library on right side'
  },
  'sdma-block-1': {
    distance: '250m',
    time: '4 mins',
    directions: 'From SDMA → Head east → Block-1 complex'
  },
  
  // General Campus Routes
  'main-gate-block-1': {
    distance: '500m',
    time: '8 mins',
    directions: 'From main gate → Follow main avenue → Block-1 buildings on left'
  },
  'main-gate-gh-1': {
    distance: '600m',
    time: '10 mins',
    directions: 'From main gate → Head towards residential zone → GH-1 complex'
  },
  'main-gate-bh-1': {
    distance: '700m',
    time: '12 mins',
    directions: 'From main gate → Head west → Boys hostel complex'
  },
  'sports-complex-hospital': {
    distance: '450m',
    time: '8 mins',
    directions: 'From Sports Complex → Head north → Medical zone → Hospital'
  },
  'auditorium-block-5': {
    distance: '550m',
    time: '9 mins',
    directions: 'From Auditorium → Head east → Academic block area → Block-5'
  }
};

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

// Function to categorize issues based on keywords
function categorizeIssue(description) {
  const lowerDesc = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category;
    }
  }
  return 'other';
}

// Function to check if area is high-risk
function checkHighRiskAreas() {
  const locationCount = {};
  issues.forEach(issue => {
    locationCount[issue.location] = (locationCount[issue.location] || 0) + 1;
  });

  const highRiskAreas = [];
  for (const [location, count] of Object.entries(locationCount)) {
    if (count > 5) {
      highRiskAreas.push({ location, issueCount: count });
    }
  }
  return highRiskAreas;
}

// ===================================================
// REST API ENDPOINTS
// ===================================================

// 1. POST - Report an issue
app.post('/api/report', upload.single('image'), (req, res) => {
  try {
    const { location, description, damageIntensity, latitude, longitude, confirmAccurate } = req.body;

    // Validation
    if (!location || !description || !damageIntensity) {
      return res.status(400).json({
        success: false,
        message: 'Location, description, and damage intensity are required'
      });
    }

    if (!confirmAccurate) {
      return res.status(400).json({
        success: false,
        message: 'You must confirm that the report is accurate'
      });
    }

    // Create issue object
    const newIssue = {
      id: issues.length + 1,
      location,
      description,
      category: categorizeIssue(description),
      damageIntensity,
      timestamp: new Date().toLocaleString(),
      status: 'reported',
      confirmAccurate: confirmAccurate === 'true'
    };

    // Add GPS coordinates if provided
    if (latitude && longitude) {
      newIssue.latitude = parseFloat(latitude);
      newIssue.longitude = parseFloat(longitude);
    }

    // Add image path if uploaded
    if (req.file) {
      newIssue.imagePath = `/uploads/${req.file.filename}`;
    }

    // Add to issues array
    issues.push(newIssue);

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      issue: newIssue,
      highRiskAreas: checkHighRiskAreas()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 2. GET - Retrieve all issues
app.get('/api/issues', (req, res) => {
  try {
    const groupedIssues = {};
    
    // Group issues by category
    issues.forEach(issue => {
      if (!groupedIssues[issue.category]) {
        groupedIssues[issue.category] = [];
      }
      groupedIssues[issue.category].push(issue);
    });

    res.status(200).json({
      success: true,
      totalIssues: issues.length,
      issues: issues,
      groupedIssues: groupedIssues,
      highRiskAreas: checkHighRiskAreas(),
      emergencyMode: emergencyMode
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 3. POST - Add developer failure log
app.post('/api/log', (req, res) => {
  try {
    const { whatBroke, whyBroke, howFixed } = req.body;

    // Validation
    if (!whatBroke || !whyBroke || !howFixed) {
      return res.status(400).json({
        success: false,
        message: 'All fields (whatBroke, whyBroke, howFixed) are required'
      });
    }

    // Create log object
    const newLog = {
      id: developerlogs.length + 1,
      whatBroke,
      whyBroke,
      howFixed,
      timestamp: new Date().toLocaleString(),
      severity: 'normal'
    };

    // Add to logs array
    developerlogs.push(newLog);

    res.status(201).json({
      success: true,
      message: 'Failure log added successfully',
      log: newLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 4. GET - Retrieve all developer logs
app.get('/api/logs', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      totalLogs: developerlogs.length,
      logs: developerlogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 5. GET - Get navigation route
app.get('/api/navigate/:route', (req, res) => {
  try {
    const routeKey = req.params.route.toLowerCase().replace(/\s/g, '-');
    const routeInfo = routes[routeKey];

    if (!routeInfo) {
      // If specific route not found, return generic directions
      return res.status(200).json({
        success: true,
        message: 'Custom route - Please ask campus staff for directions',
        route: {
          distance: 'Variable',
          time: 'Variable',
          directions: 'Route not in database. Please contact information desk.'
        },
        alternateRoutes: Object.keys(routes).slice(0, 3)
      });
    }

    res.status(200).json({
      success: true,
      route: routeInfo,
      alternateRoutes: Object.keys(routes).filter(r => r !== routeKey).slice(0, 2)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 6. POST - Emergency Simulation
app.post('/api/emergency/:type', (req, res) => {
  try {
    const emergencyType = req.params.type.toLowerCase();

    if (emergencyType === 'fire') {
      emergencyMode = true;
      currentEmergency = 'FIRE';
      evacuationStatus = []; // Reset evacuation status
      const alertMessage = '🚨 FIRE EMERGENCY DETECTED! Evacuate immediately to assembly points. Use nearest exit.';
      const alternateRoutes = [
        'North Wing Emergency Exit → Assembly Point A (Sports Field)',
        'South Wing Emergency Exit → Assembly Point B (Open Ground)',
        'Main Gate Exit → Assembly Point C (Front Courtyard)'
      ];

      res.status(200).json({
        success: true,
        emergencyType: 'FIRE',
        alert: alertMessage,
        action: 'EVACUATE IMMEDIATELY',
        alternateRoutes: alternateRoutes,
        safeZones: ['Sports Field', 'Open Ground', 'Front Courtyard'],
        vibrationPattern: [200, 100, 200, 100, 200]
      });
    } else if (emergencyType === 'network') {
      emergencyMode = true;
      currentEmergency = 'NETWORK_FAILURE';
      const alertMessage = '⚠️ NETWORK FAILURE DETECTED! Backup systems activated. Communication via emergency PA system.';
      const alternateRoutes = [
        'Use hardwired phones for communication',
        'Proceed to nearest help desk',
        'Check physical bulletin boards for updates'
      ];

      res.status(200).json({
        success: true,
        emergencyType: 'NETWORK_FAILURE',
        alert: alertMessage,
        action: 'USE ALTERNATE COMMUNICATION',
        alternateRoutes: alternateRoutes,
        backupSystems: ['Emergency PA System', 'Hardwired Phones', 'Information Desks'],
        vibrationPattern: [100, 100, 100, 100, 100, 100]
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid emergency type. Use "fire" or "network"'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 7. POST - Reset Emergency Mode
app.post('/api/emergency/reset', (req, res) => {
  emergencyMode = false;
  currentEmergency = null;
  res.status(200).json({
    success: true,
    message: 'Emergency mode deactivated',
    emergencyMode: emergencyMode
  });
});

// 8. POST - Evacuation Status Update
app.post('/api/evacuation-status', (req, res) => {
  try {
    const { userId, location, status, timestamp } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: 'userId and status are required'
      });
    }

    const evacuationRecord = {
      id: evacuationStatus.length + 1,
      userId,
      location: location || 'Unknown',
      status, // 'alert_seen', 'evacuating', 'evacuated', 'safe'
      timestamp: timestamp || new Date().toLocaleString(),
      coordinates: null
    };

    evacuationStatus.push(evacuationRecord);

    res.status(201).json({
      success: true,
      message: `Evacuation status updated: ${status}`,
      record: evacuationRecord,
      totalEvacuated: evacuationStatus.filter(e => e.status === 'safe').length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 9. GET - Evacuation Report
app.get('/api/evacuation-report', (req, res) => {
  try {
    const alertSeen = evacuationStatus.filter(e => e.status === 'alert_seen').length;
    const evacuating = evacuationStatus.filter(e => e.status === 'evacuating').length;
    const safe = evacuationStatus.filter(e => e.status === 'safe').length;

    res.status(200).json({
      success: true,
      totalPeople: evacuationStatus.length,
      alertSeen,
      evacuating,
      safe,
      evacuationRecords: evacuationStatus,
      emergencyActive: emergencyMode,
      currentEmergency: currentEmergency
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 9. GET - System Status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    systemStatus: 'Online',
    totalIssues: issues.length,
    totalLogs: developerlogs.length,
    emergencyMode: emergencyMode,
    highRiskAreas: checkHighRiskAreas(),
    evacuationStatus: {
      total: evacuationStatus.length,
      safe: evacuationStatus.filter(e => e.status === 'safe').length
    }
  });
});

// Default route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===================================================
// START SERVER
// ===================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║  Smart Campus & Infrastructure Management System  ║
  ║            Server running on port ${PORT}            ║
  ║        http://localhost:${PORT}                       ║
  ║        http://0.0.0.0:${PORT} (Network Access)        ║
  ╚═══════════════════════════════════════════════════╝
  `);
});
