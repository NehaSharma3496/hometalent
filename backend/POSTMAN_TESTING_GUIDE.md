# Postman Testing Guide for Gallery Upload

## 1. Test the Debug Route First

**URL:** `POST http://localhost:9999/gallery/debug`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `user_id`, Value: `1`
- Key: `images`, Type: `File`, Value: Select an image file
- Key: `videos`, Type: `File`, Value: Select a video file

## 2. Test the Upload Route

**URL:** `POST http://localhost:9999/gallery/upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `user_id`, Value: `1`
- Key: `images`, Type: `File`, Value: Select an image file
- Key: `videos`, Type: `File`, Value: Select a video file

## 3. Common Issues and Solutions

### Issue: "Unexpected field" error
**Solution:** Make sure you're using the exact field names:
- `images` (not `images[]` or `image`)
- `videos` (not `videos[]` or `video`)

### Issue: Files not uploading
**Solution:** 
1. Check that you've selected "File" type in Postman for file fields
2. Make sure the files are actually selected
3. Check server logs for detailed error messages

### Issue: Content-Type header
**Solution:** 
- Don't manually set `Content-Type: multipart/form-data`
- Let Postman set it automatically when you add files

## 4. Step-by-Step Postman Setup

1. **Create a new request**
   - Method: `POST`
   - URL: `http://localhost:9999/gallery/upload`

2. **Set up Body**
   - Select `form-data`
   - Add fields:
     - `user_id` (Text): `1`
     - `images` (File): Select image files
     - `videos` (File): Select video files

3. **Send the request**
   - Check the response
   - Check server console for logs

## 5. Expected Response

**Success Response:**
```json
{
  "status": true,
  "msg": "2 files uploaded successfully. Waiting for admin approval.",
  "data": {
    "uploaded_count": 2,
    "files": [
      {
        "id": 1,
        "file_name": "image.jpg",
        "file_type": "image",
        "status": "pending"
      }
    ]
  }
}
```

**Error Response:**
```json
{
  "status": false,
  "msg": "Error message here"
}
```

## 6. Server Logs to Check

When you send a request, check your server console for these logs:
- `=== GalleryUpload middleware called ===`
- `Request headers: multipart/form-data`
- `=== Multer processing complete ===`
- File processing details
- `=== Final organized files ===`

## 7. Troubleshooting

If you're still getting "Unexpected field" error:

1. **Check field names exactly:**
   - Use `images` not `images[]`
   - Use `videos` not `videos[]`

2. **Check file selection:**
   - Make sure files are actually selected in Postman
   - Check file size (max 50MB)

3. **Check server logs:**
   - Look for the detailed logs we added
   - See what field names are being received

4. **Test with debug route first:**
   - Use `/gallery/debug` to see raw request data
   - This will show exactly what Postman is sending 