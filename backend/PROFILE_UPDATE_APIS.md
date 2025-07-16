# Vendor Profile Update Request System

This system allows vendors to request profile updates that require admin approval before being applied.

## Database Setup

Run the SQL script to create the required table:
```sql
-- Execute create_profile_update_requests_table.sql
```

## API Endpoints

### Vendor APIs

#### 1. Submit Profile Update Request
**POST** `/api/vendor/profile-update-request`

Submit a profile update request for admin approval.

**Request Body (multipart/form-data):**
```json
{
  "owner_name": "New Owner Name",
  "profile_name": "New Profile Name",
  "phone": "9876543210",
  "email": "newemail@example.com",
  "state_id": 1,
  "city_id": 1,
  "pin_code": "123456",
  "price_range": "1000-5000",
  "short_description": "Updated description",
  "category_id": "1,2,3",
  "experience_since": "2020",
  "long_description": "Detailed description",
  "social_media_link": "https://facebook.com/profile"
}
```

**Files (optional):**
- `image`: Profile image file (JPEG, PNG, JPG, WebP)
- `video`: Profile video file (MP4, MPEG, QuickTime, AVI, MKV)

**Response:**
```json
{
  "status": true,
  "msg": "Profile update request submitted successfully. Waiting for admin approval.",
  "data": {
    "request_id": 1,
    "requested_changes": {
      "owner_name": "New Owner Name",
      "profile_name": "New Profile Name"
    }
  }
}
```

#### 2. Get Profile Update Status
**GET** `/api/vendor/profile-update-status`

Get all profile update requests for the authenticated vendor.

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "vendor_id": 123,
      "request_data": {
        "owner_name": "New Owner Name",
        "profile_name": "New Profile Name"
      },
      "status": "pending",
      "admin_remarks": null,
      "admin_id": null,
      "processed_at": null,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z",
      "admin": null
    }
  ]
}
```

### Admin APIs

#### 1. Get All Profile Update Requests
**GET** `/api/admin/profile-update-requests`

Get all profile update requests with pagination and filtering.

**Query Parameters:**
- `status` (optional): Filter by status ('pending', 'approved', 'rejected')
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "status": true,
  "data": {
    "requests": [
      {
        "id": 1,
        "vendor_id": 123,
        "request_data": {
          "owner_name": "New Owner Name",
          "profile_name": "New Profile Name"
        },
        "status": "pending",
        "admin_remarks": null,
        "admin_id": null,
        "processed_at": null,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z",
        "vendor": {
          "id": 123,
          "owner_name": "Current Owner",
          "profile_name": "Current Profile",
          "email": "vendor@example.com",
          "phone": "9876543210"
        },
        "admin": null
      }
    ],
    "total": 1,
    "current_page": 1,
    "total_pages": 1
  }
}
```

#### 2. Get Pending Profile Update Requests
**GET** `/api/admin/profile-update-requests/pending`

Get only pending profile update requests.

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "vendor_id": 123,
      "request_data": {
        "owner_name": "New Owner Name",
        "profile_name": "New Profile Name"
      },
      "status": "pending",
      "vendor": {
        "id": 123,
        "owner_name": "Current Owner",
        "profile_name": "Current Profile",
        "email": "vendor@example.com",
        "phone": "9876543210",
        "status": 1
      }
    }
  ]
}
```

#### 3. Get Profile Update Request Details
**GET** `/api/admin/profile-update-requests/:request_id`

Get detailed information about a specific profile update request.

**Response:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "vendor_id": 123,
    "request_data": {
      "owner_name": "New Owner Name",
      "profile_name": "New Profile Name"
    },
    "status": "pending",
    "admin_remarks": null,
    "admin_id": null,
    "processed_at": null,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "vendor": {
      "id": 123,
      "owner_name": "Current Owner",
      "profile_name": "Current Profile",
      "email": "vendor@example.com",
      "phone": "9876543210",
      "status": 1,
      "state_id": 1,
      "city_id": 1,
      "pin_code": "123456",
      "price_range": "1000-5000",
      "short_description": "Current description",
      "category_id": "1,2",
      "experience_since": "2019",
      "long_description": "Current detailed description",
      "social_media_link": "https://facebook.com/current"
    },
    "admin": null
  }
}
```

#### 4. Process Profile Update Request
**POST** `/api/admin/profile-update-requests/process`

Approve or reject a profile update request.

**Request Body:**
```json
{
  "request_id": 1,
  "action": "approve", // or "reject"
  "remarks": "Optional admin remarks"
}
```

**Response:**
```json
{
  "status": true,
  "msg": "Profile update request approved successfully",
  "data": {
    "request_id": 1,
    "status": "approved",
    "processed_at": "2024-01-01T11:00:00.000Z"
  }
}
```

## Features

### For Vendors:
- Submit profile update requests
- View request status and history
- Receive email notifications on approval/rejection
- Only one pending request allowed at a time

### For Admins:
- View all profile update requests
- Filter by status (pending/approved/rejected)
- View detailed request information
- Approve or reject requests with remarks
- Automatic email notifications to vendors
- Automatic profile updates on approval

### Allowed Fields for Update:
- `owner_name`
- `profile_name`
- `state_id`
- `city_id`
- `pin_code`
- `phone`
- `email`
- `price_range`
- `short_description`
- `category_id`
- `experience_since`
- `long_description`
- `social_media_link`
- `image` (file upload)
- `video` (file upload)

### Security Features:
- Only authenticated vendors can submit requests
- Only authenticated admins can process requests
- Foreign key constraints ensure data integrity
- Email notifications for transparency

## Error Handling

The APIs handle various error scenarios:
- Invalid request data
- Missing required fields
- Duplicate pending requests
- Non-existent requests
- Invalid status values
- Database errors

## Email Notifications

When a request is processed:
- **Approved**: Vendor receives email with updated fields and admin remarks
- **Rejected**: Vendor receives email with rejection reason

## File Upload Support

The system supports uploading:
- **Images**: JPEG, PNG, JPG, WebP (max 50MB)
- **Videos**: MP4, MPEG, QuickTime, AVI, MKV (max 50MB)

Files are stored in the `app/media/` directory with unique timestamps.

## Database Schema

The `profile_update_requests` table includes:
- `id`: Primary key
- `vendor_id`: Foreign key to users table
- `request_data`: JSON field containing requested changes
- `status`: ENUM ('pending', 'approved', 'rejected')
- `admin_remarks`: Text field for admin comments
- `admin_id`: Foreign key to users table (admin who processed)
- `processed_at`: Timestamp when request was processed
- `createdAt`, `updatedAt`: Timestamps 