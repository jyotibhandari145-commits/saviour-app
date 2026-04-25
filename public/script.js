// ===================================================
// Smart Campus & Infrastructure Management System
// Frontend JavaScript
// ===================================================

const API_BASE_URL = 'http://localhost:3000/api';

// ===================================================
// VIBRATION API & ALERTS
// ===================================================

let currentEmergency = null;
let isEvacuating = false;
let evacuationVibrationInterval = null;

// Vibration patterns (in milliseconds)
const vibrationPatterns = {
  alert: [200, 100, 200, 100, 200],           // Fire emergency
  evacuation: [100, 50, 100, 50, 100, 50, 100],  // Continuous warning
  confirmSafe: [100, 100, 100, 100, 100],    // Confirmation pattern
  safeZone: [300, 200, 300]                   // Safe zone reached
};

// Vibrate device with pattern
function vibrate(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// Start continuous evacuation vibration
function startEvacuationVibration() {
  if (evacuationVibrationInterval) return;
  
  evacuationVibrationInterval = setInterval(() => {
    vibrate(vibrationPatterns.evacuation);
  }, 2000);
}

// Stop evacuation vibration
function stopEvacuationVibration() {
  if (evacuationVibrationInterval) {
    clearInterval(evacuationVibrationInterval);
    evacuationVibrationInterval = null;
  }
}

// ===================================================
// LOCATION TRACKING
// ===================================================

let userLocation = null;
let safeZones = [];

// Get user location
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported. Using fallback.');
      resolve({ latitude: 0, longitude: 0, accuracy: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toLocaleString()
        };
        resolve(userLocation);
      },
      (error) => {
        console.log('Location access denied or unavailable');
        resolve({ latitude: 0, longitude: 0, accuracy: null });
      }
    );
  });
}

// Simple distance calculation (for demo)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // in meters
}

// Start tracking location and update header
function startLocationTracking() {
  if (!navigator.geolocation) return;
  
  navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // Update location display in header
      const locationDisplay = document.getElementById('currentLocationDisplay');
      if (locationDisplay) {
        // Simple location naming based on coordinates (for demo)
        let locationName = 'Campus';
        if (lat > 28.5 && lat < 28.6 && lon > 77.1 && lon < 77.2) {
          locationName = '📍 Delhi Campus';
        }
        locationDisplay.textContent = locationName;
      }
      
      // Update user location
      userLocation = {
        latitude: lat,
        longitude: lon,
        accuracy: position.coords.accuracy
      };
    },
    (error) => {
      console.log('Location tracking unavailable');
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    }
  );
}

// Initialize location tracking on page load
document.addEventListener('DOMContentLoaded', () => {
  startLocationTracking();
});

// ===================================================
// EVACUATION SYSTEM
// ===================================================

// Report evacuation status to server
async function reportEvacuationStatus(status) {
  try {
    const location = await getUserLocation();
    
    const response = await fetch(`${API_BASE_URL}/evacuation-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'student_' + Math.random().toString(36).substr(2, 9),
        location: document.getElementById('currentLocationDisplay')?.textContent || 'Campus',
        status: status,
        timestamp: new Date().toLocaleString()
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reporting evacuation status:', error);
  }
}

// Confirm safe evacuation
async function confirmSafeEvacuation() {
  vibrate(vibrationPatterns.safeZone);
  
  const response = await reportEvacuationStatus('safe');
  
  // Show confirmation
  showNotification('✅ Safety Confirmed! Thank you for your prompt response.', 'success');
  
  // Hide evacuation dialog
  const dialog = document.getElementById('evacuationConfirmDialog');
  if (dialog) dialog.style.display = 'none';
  
  isEvacuating = false;
  stopEvacuationVibration();
}

// Show emergency notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <p>${message}</p>
      <button onclick="this.closest('.notification').remove()">×</button>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 5000);
}

// ===================================================
// TAB MANAGEMENT
// ===================================================

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Show the selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        
        // Add active class to corresponding nav link
        event.target.closest('.nav-link').classList.add('active');

        // Load data based on tab
        if (tabName === 'dashboard') {
            refreshDashboard();
        } else if (tabName === 'issues') {
            loadIssues();
        } else if (tabName === 'logs') {
            loadLogs();
        }
    }
}

// ===================================================
// REPORT ISSUE FUNCTIONALITY
// ===================================================

async function submitReport(event) {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const damageIntensity = document.getElementById('damageIntensity').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const confirmAccurate = document.getElementById('confirmAccurate').checked;
    const messageDiv = document.getElementById('reportMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Validate required fields
    if (!location || !description || !damageIntensity) {
        messageDiv.textContent = '❌ Please fill in all required fields.';
        messageDiv.classList.remove('alert-hidden');
        messageDiv.classList.add('alert-error');
        return;
    }

    if (!confirmAccurate) {
        messageDiv.textContent = '❌ Please confirm that your report is accurate.';
        messageDiv.classList.remove('alert-hidden');
        messageDiv.classList.add('alert-error');
        return;
    }

    try {
        submitBtn.disabled = true;
        messageDiv.classList.remove('alert-success', 'alert-error');
        messageDiv.classList.add('alert-hidden');

        // Prepare form data for image upload
        const formData = new FormData();
        formData.append('location', location);
        formData.append('description', description);
        formData.append('damageIntensity', damageIntensity);
        formData.append('confirmAccurate', confirmAccurate);

        if (latitude && longitude) {
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);
        }

        // Add image if selected
        const imageInput = document.getElementById('issueImage');
        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        const response = await fetch(`${API_BASE_URL}/report`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = '✅ Issue reported successfully! Thank you for your contribution.';
            messageDiv.classList.remove('alert-hidden');
            messageDiv.classList.add('alert-success');
            document.getElementById('reportForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('gpsStatus').textContent = 'Location not set';
            document.getElementById('gpsStatus').className = 'gps-status';

            // Show high-risk areas if any
            if (data.highRiskAreas && data.highRiskAreas.length > 0) {
                setTimeout(() => {
                    alert('⚠️ High-Risk Area Alert!\n\n' + 
                        data.highRiskAreas.map(area => 
                            `${area.location}: ${area.issueCount} issues reported`
                        ).join('\n'));
                }, 500);
            }
        } else {
            messageDiv.textContent = '❌ Error: ' + data.message;
            messageDiv.classList.remove('alert-hidden');
            messageDiv.classList.add('alert-error');
        }
    } catch (error) {
        messageDiv.textContent = '❌ Error: ' + error.message;
        messageDiv.classList.remove('alert-hidden');
        messageDiv.classList.add('alert-error');
    } finally {
        submitBtn.disabled = false;
    }
}

// ===================================================
// GPS LOCATION FUNCTIONS
// ===================================================

async function getCurrentLocation() {
    const gpsBtn = document.getElementById('gpsBtn');
    const gpsStatus = document.getElementById('gpsStatus');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');

    if (!navigator.geolocation) {
        gpsStatus.textContent = '❌ GPS not supported by this device';
        gpsStatus.className = 'gps-status location-error';
        return;
    }

    gpsBtn.disabled = true;
    gpsStatus.textContent = '📍 Getting location...';
    gpsStatus.className = 'gps-status';

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            latitudeInput.value = latitude;
            longitudeInput.value = longitude;
            
            gpsStatus.textContent = `✅ Location set: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            gpsStatus.className = 'gps-status location-set';
            gpsBtn.disabled = false;
        },
        (error) => {
            let errorMessage = '❌ Location error: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Location access denied. Please enable GPS.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'Unknown error.';
                    break;
            }
            gpsStatus.textContent = errorMessage;
            gpsStatus.className = 'gps-status location-error';
            gpsBtn.disabled = false;
        },
        options
    );
}

// ===================================================
// IMAGE UPLOAD FUNCTIONS
// ===================================================

// Handle image file selection
document.getElementById('issueImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            this.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file size must be less than 5MB.');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});

// Remove selected image
function removeImage() {
    document.getElementById('issueImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

async function loadIssues() {
    const container = document.getElementById('issuesContainer');
    container.innerHTML = '<p class="loading">Loading issues...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/issues`);
        const data = await response.json();

        if (data.success && data.issues.length > 0) {
            container.innerHTML = '';
            data.issues.forEach(issue => {
                const issueCard = createIssueCard(issue);
                container.appendChild(issueCard);
            });
        } else {
            container.innerHTML = '<p class="no-data">No issues reported yet. Help improve campus by reporting issues!</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="no-data">Error loading issues: ' + error.message + '</p>';
    }
}

function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = `issue-card ${issue.category}`;

    const categoryEmoji = {
        water: '💧',
        electricity: '⚡',
        road: '🛣️',
        building: '🏢',
        waste: '♻️',
        other: '📍'
    };

    const intensityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#f97316',
        critical: '#dc2626'
    };

    const intensityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴'
    };

    let imageHtml = '';
    if (issue.imagePath) {
        imageHtml = `<div class="issue-image">
            <img src="${issue.imagePath}" alt="Issue image" onclick="showImageModal('${issue.imagePath}')">
        </div>`;
    }

    let gpsHtml = '';
    if (issue.latitude && issue.longitude) {
        gpsHtml = `<div class="issue-gps">
            📍 GPS: ${issue.latitude.toFixed(6)}, ${issue.longitude.toFixed(6)}
        </div>`;
    }

    card.innerHTML = `
        <div class="issue-header">
            <div class="issue-location">${categoryEmoji[issue.category] || '📍'} ${issue.location}</div>
            <span class="issue-category">${issue.category.toUpperCase()}</span>
        </div>
        <p class="issue-description">${issue.description}</p>
        ${imageHtml}
        <div class="issue-details">
            <div class="issue-intensity" style="color: ${intensityColors[issue.damageIntensity] || '#6b7280'}">
                ${intensityEmoji[issue.damageIntensity] || '⚪'} ${issue.damageIntensity ? issue.damageIntensity.toUpperCase() : 'UNKNOWN'}
            </div>
            ${gpsHtml}
        </div>
        <div class="issue-footer">
            <span class="issue-status">${issue.status.toUpperCase()}</span>
            <span>${issue.timestamp}</span>
        </div>
    `;

    return card;
}

function filterIssuesByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const issueCards = document.querySelectorAll('.issue-card');

    issueCards.forEach(card => {
        if (!selectedCategory) {
            card.style.display = 'block';
        } else {
            card.classList.contains(selectedCategory) 
                ? card.style.display = 'block' 
                : card.style.display = 'none';
        }
    });
}

// ===================================================
// IMAGE MODAL FUNCTION
// ===================================================

function showImageModal(imagePath) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${imagePath}" alt="Issue image" style="max-width: 100%; max-height: 80vh;">
        </div>
    `;
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    document.body.appendChild(modal);
}

async function getNavigation() {
    const fromLocation = document.getElementById('fromLocation').value;
    const toLocation = document.getElementById('toLocation').value;
    const resultDiv = document.getElementById('navigationResult');

    if (!fromLocation || !toLocation) {
        alert('Please enter both source and destination');
        return;
    }

    try {
        // Convert destination to route key format
        const routeKey = toLocation.toLowerCase().replace(/\s/g, '-');
        const response = await fetch(`${API_BASE_URL}/navigate/${routeKey}`);
        const data = await response.json();

        if (data.success) {
            displayNavigation(data.route, fromLocation, toLocation, data.alternateRoutes);
            resultDiv.classList.add('active');
        } else {
            resultDiv.innerHTML = '<p class="no-data">Could not find route information</p>';
            resultDiv.classList.add('active');
        }
    } catch (error) {
        resultDiv.innerHTML = '<p class="no-data">Error: ' + error.message + '</p>';
        resultDiv.classList.add('active');
    }
}

function displayNavigation(route, from, to, alternateRoutes) {
    const resultDiv = document.getElementById('navigationResult');

    let alternateHTML = '';
    if (alternateRoutes && alternateRoutes.length > 0) {
        alternateHTML = `
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <h4>Other nearby routes:</h4>
                <ul style="list-style: none; padding-left: 0; margin-top: 0.75rem;">
                    ${alternateRoutes.map(r => 
                        `<li style="padding: 0.25rem 0; cursor: pointer; color: var(--primary-color);" onclick="quickRoute('${r}')">&rarr; ${r}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }

    resultDiv.innerHTML = `
        <div class="route-info">
            <h3>📍 Route: ${from} → ${to}</h3>
            <div class="route-distance">
                <div class="route-stat">
                    <div class="route-stat-label">Distance</div>
                    <div class="route-stat-value">${route.distance}</div>
                </div>
                <div class="route-stat">
                    <div class="route-stat-label">Estimated Time</div>
                    <div class="route-stat-value">${route.time}</div>
                </div>
            </div>
            <div class="route-directions">
                <strong>Directions:</strong><br>
                ${route.directions}
            </div>
            ${alternateHTML}
        </div>
    `;
}

async function quickRoute(routeKey) {
    try {
        const response = await fetch(`${API_BASE_URL}/navigate/${routeKey}`);
        const data = await response.json();

        if (data.success) {
            const formattedRoute = routeKey.split('-').join(' → ');
            displayNavigation(data.route, formattedRoute.split(' → ')[0], formattedRoute.split(' → ')[1], data.alternateRoutes);
            document.getElementById('navigationResult').classList.add('active');
        }
    } catch (error) {
        alert('Error loading route: ' + error.message);
    }
}

// ===================================================
// EMERGENCY SIMULATION
// ===================================================

async function triggerEmergency(type) {
    const resultDiv = document.getElementById('emergencyResult');
    resultDiv.innerHTML = '<p class="loading">Activating emergency protocol...</p>';
    resultDiv.classList.add('active');

    try {
        const response = await fetch(`${API_BASE_URL}/emergency/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            // Trigger vibration immediately
            if (data.vibrationPattern) {
                vibrate(data.vibrationPattern);
            }
            
            // Mark emergency as active
            currentEmergency = data.emergencyType;
            isEvacuating = true;
            
            // Start continuous evacuation vibration
            startEvacuationVibration();
            
            // Get user location
            await getUserLocation();
            
            // Show enhanced emergency display
            displayEmergency(data);
            
            // Show evacuation confirmation dialog
            setTimeout(() => showEvacuationConfirmDialog(data), 1500);
        } else {
            resultDiv.innerHTML = '<p class="no-data">Error: ' + data.message + '</p>';
        }
    } catch (error) {
        resultDiv.innerHTML = '<p class="no-data">Error: ' + error.message + '</p>';
    }
}

function showEvacuationConfirmDialog(emergencyData) {
    const existingDialog = document.getElementById('evacuationConfirmDialog');
    if (existingDialog) existingDialog.remove();
    
    const dialog = document.createElement('div');
    dialog.id = 'evacuationConfirmDialog';
    dialog.className = 'evacuation-dialog';
    dialog.innerHTML = `
        <div class="evacuation-dialog-content">
            <h3>🚨 ${emergencyData.emergencyType === 'FIRE' ? 'FIRE EMERGENCY' : 'EMERGENCY ALERT'}</h3>
            <p class="evacuation-message">${emergencyData.alert}</p>
            
            <div class="evacuation-status">
                <div class="status-item">
                    <span class="status-label">Status:</span>
                    <span class="status-value" id="evacuationStatusValue">Alert Received</span>
                </div>
            </div>
            
            <div class="evacuation-instructions">
                <h4>📍 Action Required:</h4>
                <p>${emergencyData.action}</p>
            </div>
            
            <div class="evacuation-buttons">
                <button class="btn btn-success" onclick="markEvacuating()">
                    🚗 I'm Evacuating Now
                </button>
                <button class="btn btn-success" onclick="confirmSafeEvacuation()">
                    ✅ I've Reached Safety
                </button>
            </div>
            
            <div class="vibration-indicator">
                <span class="pulse"></span> Device Vibrating - Alert Active
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Report alert seen
    reportEvacuationStatus('alert_seen');
}

function markEvacuating() {
    reportEvacuationStatus('evacuating');
    showNotification('🚗 Evacuation in progress. Head to nearest safe zone.', 'warning');
    document.getElementById('evacuationStatusValue').textContent = 'Evacuating';
}

function displayEmergency(emergencyData) {
    const resultDiv = document.getElementById('emergencyResult');

    let routesHTML = '';
    if (emergencyData.alternateRoutes && emergencyData.alternateRoutes.length > 0) {
        routesHTML = `
            <div class="emergency-routes">
                <h4>🚪 Recommended Exit Routes:</h4>
                <ul>
                    ${emergencyData.alternateRoutes.map(route => 
                        `<li>${route}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }

    let safeZonesHTML = '';
    if (emergencyData.safeZones) {
        safeZonesHTML = `
            <div style="margin-top: 1rem;">
                <strong>🟢 Safe Assembly Points:</strong>
                <p>${emergencyData.safeZones.join(', ')}</p>
            </div>
        `;
    }

    let backupSystemsHTML = '';
    if (emergencyData.backupSystems) {
        backupSystemsHTML = `
            <div style="margin-top: 1rem;">
                <strong>🔧 Backup Systems Available:</strong>
                <p>${emergencyData.backupSystems.join(', ')}</p>
            </div>
        `;
    }

    resultDiv.innerHTML = `
        <div class="emergency-alert">
            📢 ${emergencyData.alert}
        </div>
        <div class="emergency-action">
            ⚡ ACTION REQUIRED: ${emergencyData.action}
        </div>
        ${routesHTML}
        ${safeZonesHTML}
        ${backupSystemsHTML}
    `;
}

async function resetEmergency() {
    try {
        // Stop vibration
        stopEvacuationVibration();
        vibrate(0);
        
        // Clear emergency state
        currentEmergency = null;
        isEvacuating = false;
        
        // Hide evacuation dialog
        const dialog = document.getElementById('evacuationConfirmDialog');
        if (dialog) dialog.remove();
        
        const response = await fetch(`${API_BASE_URL}/emergency/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('emergencyResult').classList.remove('active');
            document.getElementById('emergencyResult').innerHTML = '';
            showNotification('✅ Emergency mode deactivated. All systems back to normal.', 'success');
            refreshDashboard();
        }
    } catch (error) {
        showNotification('Error resetting emergency: ' + error.message, 'error');
    }
}

// ===================================================
// DEVELOPER LOGS FUNCTIONALITY
// ===================================================

async function submitLog(event) {
    event.preventDefault();

    const whatBroke = document.getElementById('whatBroke').value;
    const whyBroke = document.getElementById('whyBroke').value;
    const howFixed = document.getElementById('howFixed').value;
    const messageDiv = document.getElementById('logMessage');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        messageDiv.classList.remove('alert-success', 'alert-error');
        messageDiv.classList.add('alert-hidden');

        const response = await fetch(`${API_BASE_URL}/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ whatBroke, whyBroke, howFixed })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = '✅ Failure log recorded successfully!';
            messageDiv.classList.remove('alert-hidden');
            messageDiv.classList.add('alert-success');
            document.getElementById('logForm').reset();
            loadLogs();
        } else {
            messageDiv.textContent = '❌ Error: ' + data.message;
            messageDiv.classList.remove('alert-hidden');
            messageDiv.classList.add('alert-error');
        }
    } catch (error) {
        messageDiv.textContent = '❌ Error: ' + error.message;
        messageDiv.classList.remove('alert-hidden');
        messageDiv.classList.add('alert-error');
    } finally {
        submitBtn.disabled = false;
    }
}

async function loadLogs() {
    const container = document.getElementById('logsContainer');
    container.innerHTML = '<p class="loading">Loading failure logs...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/logs`);
        const data = await response.json();

        if (data.success && data.logs.length > 0) {
            container.innerHTML = '';
            data.logs.forEach(log => {
                const logCard = createLogCard(log);
                container.appendChild(logCard);
            });
        } else {
            container.innerHTML = '<p class="no-data">No failure logs recorded yet. Start documenting your debugging journey!</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="no-data">Error loading logs: ' + error.message + '</p>';
    }
}

function createLogCard(log) {
    const card = document.createElement('div');
    card.className = 'log-card';

    card.innerHTML = `
        <div class="log-section-title">🔴 What Broke:</div>
        <div class="log-content">${log.whatBroke}</div>

        <div class="log-section-title">🔍 Why It Broke:</div>
        <div class="log-content">${log.whyBroke}</div>

        <div class="log-section-title">✅ How It Was Fixed:</div>
        <div class="log-content">${log.howFixed}</div>

        <div class="log-timestamp">
            📅 ${log.timestamp} | ID: ${log.id}
        </div>
    `;

    return card;
}

// ===================================================
// DASHBOARD FUNCTIONALITY
// ===================================================

async function refreshDashboard() {
    try {
        // Load system status
        const statusResponse = await fetch(`${API_BASE_URL}/status`);
        const statusData = await statusResponse.json();

        // Load issues
        const issuesResponse = await fetch(`${API_BASE_URL}/issues`);
        const issuesData = await issuesResponse.json();

        // Load logs
        const logsResponse = await fetch(`${API_BASE_URL}/logs`);
        const logsData = await logsResponse.json();

        // Update dashboard cards
        document.getElementById('dashTotalIssues').textContent = statusData.totalIssues;
        document.getElementById('dashHighRisk').textContent = statusData.highRiskAreas.length;
        document.getElementById('dashLogs').textContent = statusData.totalLogs;
        document.getElementById('dashEmergency').textContent = statusData.emergencyMode ? '🚨 EMERGENCY ACTIVE' : '✅ Normal';

        // Update high-risk areas
        updateHighRiskDisplay(statusData.highRiskAreas);

        // Update category breakdown
        if (issuesData.groupedIssues) {
            updateCategoryBreakdown(issuesData.groupedIssues);
        }

    } catch (error) {
        console.error('Error refreshing dashboard:', error);
    }
}

function updateHighRiskDisplay(highRiskAreas) {
    const riskList = document.getElementById('highRiskList');

    if (highRiskAreas.length === 0) {
        riskList.innerHTML = '<p class="no-data">No high-risk areas at the moment ✅</p>';
    } else {
        riskList.innerHTML = '';
        highRiskAreas.forEach(area => {
            const riskItem = document.createElement('div');
            riskItem.className = 'risk-item';
            riskItem.innerHTML = `
                <strong>🔴 ${area.location}</strong>
                <p style="margin: 0.5rem 0 0 0; color: #991b1b;">
                    ${area.issueCount} issues reported - ATTENTION REQUIRED
                </p>
            `;
            riskList.appendChild(riskItem);
        });
    }
}

function updateCategoryBreakdown(groupedIssues) {
    const categoryGrid = document.getElementById('categoryBreakdown');
    categoryGrid.innerHTML = '';

    const categories = Object.keys(groupedIssues);

    if (categories.length === 0) {
        categoryGrid.innerHTML = '<p class="no-data">No categories yet</p>';
        return;
    }

    const categoryEmojis = {
        water: '💧',
        electricity: '⚡',
        road: '🛣️',
        building: '🏢',
        waste: '♻️',
        other: '📍'
    };

    categories.forEach(category => {
        const count = groupedIssues[category].length;
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <div class="category-item-name">
                ${categoryEmojis[category] || '📍'} ${category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            <div class="category-item-count">${count}</div>
        `;
        categoryGrid.appendChild(item);
    });
}

// ===================================================
// INITIALIZE ON PAGE LOAD
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Campus System - Initializing...');
    
    // Show dashboard on load
    const dashboardTab = document.getElementById('dashboard');
    if (dashboardTab) {
        dashboardTab.classList.add('active');
    }

    // Activate first nav link
    const firstNavLink = document.querySelector('.nav-link');
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }

    // Load initial dashboard data
    refreshDashboard();

    console.log('✅ System initialized successfully!');
});

// ===================================================
// ERROR HANDLING & LOGGING
// ===================================================

window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Show error notification
function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

console.log('🚀 Smart Campus System Frontend Loaded');
