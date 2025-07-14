# Complete Vendor Profile & Gallery Management System

This system provides comprehensive vendor profile management with gallery uploads, social media links, and admin approval workflows.

## Database Setup

Run the SQL scripts in order:
```sql
-- 1. Update users table
-- Execute update_user_table.sql

-- 2. Create gallery table
-- Execute create_gallery_table.sql

-- 3. Create profile update requests table
-- Execute create_profile_update_requests_table.sql
```

## API Endpoints

### 🔐 Authentication APIs
- Login, Register, etc. (existing)

### 👤 Vendor Profile APIs

#### 1. Submit Profile Update Request
**POST** `/api/vendor/profile-update-request`

Submit profile changes for admin approval.

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
  "facebook_link": "https://facebook.com/profile",
  "instagram_link": "https://instagram.com/profile",
  "twitter_link": "https://twitter.com/profile",
  "linkedin_link": "https://linkedin.com/profile",
  "youtube_link": "https://youtube.com/channel",
  "website_link": "https://website.com"
}
```

**Files (optional):**
- `image`: Profile image file (JPEG, PNG, JPG, WebP)

#### 2. Get Profile Update Status
**GET** `/api/vendor/profile-update-status`

Get all profile update requests for the vendor.

### 🖼️ Gallery APIs

#### 1. Upload Gallery Files
**POST** `/api/gallery/upload`

Upload multiple images and videos to gallery.

**Request Body (multipart/form-data):**
- `images[]`: Multiple image files
- `videos[]`: Multiple video files

**Response:**
```json
{
  "status": true,
  "msg": "5 files uploaded successfully. Waiting for admin approval.",
  "data": {
    "uploaded_count": 5,
    "files": [
      {
        "id": 1,
        "file_name": "image1.jpg",
        "file_type": "image",
        "status": "pending"
      }
    ]
  }
}
```

#### 2. Get My Gallery
**GET** `/api/gallery/my-gallery`

Get vendor's gallery with status filtering.

**Query Parameters:**
- `status` (optional): Filter by status ('pending', 'approved', 'rejected')

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "file_name": "image1.jpg",
      "file_type": "image",
      "file_path": "media-1234567890-image1.jpg",
      "file_size": 1024000,
      "status": "approved",
      "admin_remarks": null,
      "admin_id": 1,
      "processed_at": "2024-01-01T11:00:00.000Z",
      "sort_order": 1,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T11:00:00.000Z",
      "admin": {
        "id": 1,
        "owner_name": "Admin User",
        "profile_name": "Admin"
      }
    }
  ]
}
```

#### 3. Remove Gallery Item
**DELETE** `/api/gallery/remove/:gallery_id`

Remove a gallery item (only if pending or rejected).

#### 4. Update Gallery Order
**PUT** `/api/gallery/update-order`

Update the display order of gallery items.

**Request Body:**
```json
{
  "items": [
    { "id": 1, "sort_order": 1 },
    { "id": 2, "sort_order": 2 },
    { "id": 3, "sort_order": 3 }
  ]
}
```

### 👨‍💼 Admin APIs

#### 1. Get All Gallery Requests
**GET** `/api/admin/gallery-requests`

Get all gallery requests with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status
- `user_id` (optional): Filter by specific user
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### 2. Get Pending Gallery Requests
**GET** `/api/admin/gallery-requests/pending`

Get only pending gallery requests.

#### 3. Process Gallery Requests
**POST** `/api/admin/gallery-requests/process`

Approve or reject multiple gallery items.

**Request Body:**
```json
{
  "gallery_ids": [1, 2, 3],
  "action": "approve", // or "reject"
  "remarks": "Optional admin remarks"
}
```

#### 4. Get User Complete Profile
**GET** `/api/admin/user-profile/:user_id`

Get complete user profile with all details and gallery.

**Response:**
```json
{
  "status": true,
  "data": {
    "user": {
      "id": 123,
      "owner_name": "Vendor Name",
      "profile_name": "Vendor Profile",
      "email": "vendor@example.com",
      "phone": "9876543210",
      "state_id": 1,
      "city_id": 1,
      "pin_code": "123456",
      "price_range": "1000-5000",
      "short_description": "Short description",
      "category_id": "1,2,3",
      "experience_since": "2020",
      "long_description": "Long description",
      "image": "profile-image.jpg",
      "facebook_link": "https://facebook.com/profile",
      "instagram_link": "https://instagram.com/profile",
      "twitter_link": "https://twitter.com/profile",
      "linkedin_link": "https://linkedin.com/profile",
      "youtube_link": "https://youtube.com/channel",
      "website_link": "https://website.com",
      "status": 1,
      "is_sponsored": 0,
      "sponsor_rank": 0,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    "approved_gallery": [
      {
        "id": 1,
        "file_name": "image1.jpg",
        "file_type": "image",
        "file_path": "media-1234567890-image1.jpg",
        "status": "approved",
        "sort_order": 1
      }
    ],
    "pending_gallery": [
      {
        "id": 2,
        "file_name": "image2.jpg",
        "file_type": "image",
        "file_path": "media-1234567891-image2.jpg",
        "status": "pending"
      }
    ],
    "rejected_gallery": [
      {
        "id": 3,
        "file_name": "video1.mp4",
        "file_type": "video",
        "file_path": "media-1234567892-video1.mp4",
        "status": "rejected",
        "admin_remarks": "Inappropriate content"
      }
    ]
  }
}
```

### 🖼️ Admin Gallery APIs (No Approval Required)

#### 1. Upload Admin Gallery Files
**POST** `/api/admin/admin-gallery/upload`

Upload multiple images and videos to admin gallery (auto-approved).

**Request Body (multipart/form-data):**
- `admin_id`: Admin's user ID
- `images[]`: Multiple image files
- `videos[]`: Multiple video files

**Response:**
```json
{
  "status": true,
  "msg": "3 files uploaded successfully to admin gallery.",
  "data": {
    "uploaded_count": 3,
    "files": [
      {
        "id": 1,
        "file_name": "admin-image1.jpg",
        "file_type": "image",
        "status": "approved"
      }
    ]
  }
}
```

#### 2. Get Admin Gallery
**GET** `/api/admin/admin-gallery/my-gallery?admin_id=1`

Get admin's gallery (only approved items).

#### 3. Remove Admin Gallery Item
**DELETE** `/api/admin/admin-gallery/remove/1`

Remove an admin gallery item.

**Request Body:**
```json
{
  "admin_id": 1
}
```

#### 4. Update Admin Gallery Order
**PUT** `/api/admin/admin-gallery/update-order`

Update the display order of admin gallery items.

**Request Body:**
```json
{
  "admin_id": 1,
  "items": [
    { "id": 1, "sort_order": 1 },
    { "id": 2, "sort_order": 2 },
    { "id": 3, "sort_order": 3 }
  ]
}
```

#### 5. Get All Admin Galleries
**GET** `/api/admin/admin-gallery/all?admin_id=1&page=1&limit=20`

Get all admin galleries (for super admin).

**Query Parameters:**
- `admin_id` (optional): Filter by specific admin
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

## Features

### 🎯 **Profile Management**
- **Social Media Links**: Separate fields for Facebook, Instagram, Twitter, LinkedIn, YouTube, Website
- **Profile Image**: Single profile image upload
- **Admin Approval**: All profile changes require admin approval
- **Email Notifications**: Automatic emails on approval/rejection

### 🖼️ **Gallery System**
- **Multiple Uploads**: Upload multiple images and videos at once
- **File Types**: Support for images (JPEG, PNG, JPG, WebP) and videos (MP4, MPEG, QuickTime, AVI, MKV)
- **Admin Approval**: All gallery items require admin approval
- **Sort Order**: Customizable display order
- **Status Tracking**: Pending, approved, rejected status for each item
- **File Management**: Automatic file deletion for rejected items

### 👨‍💼 **Admin Features**
- **Bulk Processing**: Approve/reject multiple gallery items at once
- **Complete Profiles**: View user's complete profile with all details
- **Gallery Management**: Manage all gallery requests with filtering
- **Email Notifications**: Automatic emails to vendors on processing
- **Admin Gallery**: Upload and manage admin gallery (no approval required)
- **Auto-Approval**: Admin gallery items are automatically approved

### 📧 **Email Notifications**
- **Profile Updates**: Notifications for profile change approvals/rejections
- **Gallery Updates**: Notifications for gallery item approvals/rejections
- **Detailed Information**: Include specific changes and admin remarks

## Database Schema

### Users Table Updates
- Removed: `video`, `social_media_link`
- Added: `facebook_link`, `instagram_link`, `twitter_link`, `linkedin_link`, `youtube_link`, `website_link`

### Gallery Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `file_name`: Original file name
- `file_type`: ENUM ('image', 'video')
- `file_path`: Stored file path
- `file_size`: File size in bytes
- `status`: ENUM ('pending', 'approved', 'rejected')
- `admin_remarks`: Admin comments
- `admin_id`: Admin who processed
- `processed_at`: Processing timestamp
- `sort_order`: Display order
- `createdAt`, `updatedAt`: Timestamps

## File Upload Support

### Supported Formats
- **Images**: JPEG, PNG, JPG, WebP (max 50MB)
- **Videos**: MP4, MPEG, QuickTime, AVI, MKV (max 50MB)

### Storage
- Files stored in `app/media/` directory
- Unique filenames with timestamps
- Automatic cleanup for rejected files

## Security Features
- Authentication required for all APIs
- File type validation
- File size limits
- Foreign key constraints
- Admin-only approval system
- Email notifications for transparency

## Error Handling
- Invalid file types
- File size exceeded
- Duplicate requests
- Non-existent items
- Database errors
- File system errors 