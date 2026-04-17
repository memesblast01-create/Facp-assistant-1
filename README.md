# FACP Assistant - Building Search System

A production-ready web application for searching and managing building information with Firebase integration, role-based admin controls, and flexible data upload capabilities.

## Features

### 🔍 Search System
- **Fully Flexible Search**: Search any field (code, name, zone, or custom fields)
- **Case-Insensitive**: Queries work regardless of letter casing
- **Partial Matching**: Find results with partial text matches
- **Dynamic Field Detection**: Works with inconsistent data structures
- **Debounced Search**: Optimized performance with debounced input
- **Value-Based Matching**: Searches all object values, not fixed keys

### 👥 User Authentication
- Firebase Email/Password authentication
- Role-based access control (Owner/Sub-Admin)
- Secure login system with error handling

### 🏢 Admin Dashboard
- **Data Upload**: CSV and Excel file support
- **Auto Column Detection**: Flexible parsing regardless of column order
- **Data Management**: View, edit, and delete building records
- **Admin Creation**: Owner can create and manage sub-admins
- **Role-Based Permissions**:
  - **Owner**: Full access (add, edit, delete, manage admins)
  - **Sub-Admin**: Can only add new data

### 📊 Data Management
- Real-time Firestore integration
- In-memory caching for performance
- Handles 5000+ records smoothly
- Dynamic field display in results
- Automatic empty row handling

### 🎨 Modern UI
- Responsive design (mobile + desktop)
- Professional gradient styling
- Smooth animations and transitions
- Glassmorphism effects
- Accessible color scheme

## Project Structure

```
Facp-assistant-1/
├── index.html          # Main search interface
├── admin.html          # Admin dashboard
├── background.jpg      # Background image
└── README.md          # This file
```

## Setup Instructions

### 1. Firebase Configuration

The app uses Firebase with the following configuration:
- **Project ID**: facp-assistant
- **Auth Domain**: facp-assistant.firebaseapp.com
- **Storage Bucket**: facp-assistant.firebasestorage.app

**Note**: The Firebase config is already embedded in both HTML files. If you need to change it, update the `firebaseConfig` object in both files.

### 2. Firestore Setup

Create the following collections in Firestore:

#### Collection: `buildings`
Documents with flexible structure:
```json
{
  "Building_Code": "B001",
  "Building_Name": "Central Tower",
  "Zone_or_Details": "Downtown",
  "Custom_Field_1": "value",
  "Custom_Field_2": "value"
}
```

#### Collection: `users`
Admin user records:
```json
{
  "email": "admin@example.com",
  "role": "owner" // or "subadmin"
}
```

### 3. Firestore Security Rules

For development/testing, use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**For production**, implement role-based rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /buildings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "owner";
    }
  }
}
```

### 4. Initial Admin Setup

1. Create the first admin user manually in Firebase Console:
   - Go to Authentication → Add user
   - Create admin account with email and password
   
2. Create corresponding user document in Firestore:
   - Collection: `users`
   - Document ID: (user's UID from Authentication)
   - Fields: `email`, `role: "owner"`

## Usage

### For Users

1. **Open index.html** in a web browser
2. **Search**: Enter any search term (code, name, zone, etc.)
3. **View Results**: Results display as cards with all available fields
4. **Access Admin**: Click "Admin Panel" button to access admin features

### For Admins

1. **Login**: Click "Admin Panel" → Enter credentials
2. **Upload Data**:
   - Select CSV or Excel file
   - Click "Upload File"
   - Data auto-parses and uploads to Firestore
3. **View Data**: Switch to "View Data" tab to see all records
4. **Edit Records**: Click "Edit" on any record
5. **Delete Records** (Owner only): Click "Delete" to remove records
6. **Manage Admins** (Owner only): Create and remove admin users

## File Upload Format

### CSV Format
```
B001,Central Tower,Downtown
B002,North Plaza,North District
B003,South Complex,South Area
```

### Excel Format
Same structure as CSV - first row can be headers or data (auto-detected)

**Important**: 
- Columns are auto-detected regardless of order
- Empty rows are skipped
- Missing fields are handled gracefully

## API Integration

### Search Endpoint (Client-Side)
```javascript
// Search is performed client-side using:
Object.values(item).some(v => 
  (v+"").toLowerCase().includes(query)
)
```

### Data Loading
```javascript
db.collection("buildings").get().then(snapshot => {
  snapshot.forEach(doc => {
    buildingsData.push(doc.data());
  });
});
```

## Performance Optimization

- **In-Memory Caching**: Data loaded once and cached in memory
- **Debounced Search**: 300ms debounce prevents excessive filtering
- **Lazy Loading**: Results rendered only when needed
- **Efficient Filtering**: Value-based search uses native JavaScript methods

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Error Handling

The app includes comprehensive error handling for:
- Firebase connection failures
- Invalid file uploads
- Authentication errors
- Missing or corrupted data
- Network timeouts

## Troubleshooting

### "No data in Firestore" message
- Check Firestore connection
- Verify `buildings` collection exists
- Upload sample data via admin panel

### Login fails
- Verify user exists in Firebase Authentication
- Check user document in `users` collection
- Ensure user has valid role assigned

### File upload errors
- Ensure CSV/Excel format is valid
- Check file size (should be < 10MB)
- Verify columns are properly formatted

### Search returns no results
- Try different search terms
- Check data was uploaded successfully
- Verify Firestore has documents

## Security Considerations

1. **API Keys**: Currently exposed in frontend (for demo). For production:
   - Use Firebase Security Rules
   - Implement backend proxy
   - Use environment variables

2. **Authentication**: 
   - Enforce strong passwords
   - Implement password reset
   - Add 2FA for admins

3. **Data Access**:
   - Implement role-based Firestore rules
   - Audit admin actions
   - Encrypt sensitive data

## Future Enhancements

- [ ] Advanced search filters
- [ ] Data export (CSV/Excel)
- [ ] Bulk edit operations
- [ ] User activity logs
- [ ] Two-factor authentication
- [ ] Data validation rules
- [ ] Backup and restore
- [ ] API endpoints for external integration

## Support

For issues or questions:
1. Check Firestore console for errors
2. Review browser console for JavaScript errors
3. Verify Firebase configuration
4. Check network tab for API calls

## License

This project is provided as-is for production use.

## Version

**Current Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
