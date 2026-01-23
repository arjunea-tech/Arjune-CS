# Registration Troubleshooting Guide

## What to Do If Registration Validation Fails

If you see: `ERROR Registration error: [Error: Validation failed]`

### Step 1: Check Backend Console
Look for `[VALIDATION]` logs in the backend terminal. They will show you exactly which field failed and why.

Example output:
```
[VALIDATION] Errors: [
  {
    "field": "email",
    "message": "Valid email is required",
    "value": "invalid-email"
  }
]
```

### Step 2: Understand Validation Rules

**REQUIRED Fields (must always provide):**
- `name` - 2-50 characters, cannot be empty
- `email` - Must be a valid email format (example@domain.com)
- `password` - Minimum 6 characters

**OPTIONAL Fields (can be empty):**
- `mobileNumber` - If provided, must be exactly 10 digits (example: 9876543210)
- `address` - Can be any text
- `pincode` - If provided, must be exactly 6 digits
- `district` - Can be any text
- `state` - Can be any text

### Step 3: Common Issues & Solutions

#### Issue: "Valid email is required"
**Problem:** Email format is invalid
**Solution:** Use format like `user@example.com`
**Example:** 
- ❌ Wrong: `useratexample.com`, `user@.com`, `@example.com`
- ✅ Correct: `john@example.com`, `test@gmail.com`

#### Issue: "Name must be between 2 and 50 characters"
**Problem:** Name is too short or too long
**Solution:** Use a name with 2-50 characters
**Example:**
- ❌ Wrong: `J` (too short), `VeryVeryVeryLongNameThatExceedsFiftyCharactersLimit` (too long)
- ✅ Correct: `John`, `John Doe`, `Jane Smith`

#### Issue: "Password must be at least 6 characters"
**Problem:** Password is too short
**Solution:** Use at least 6 characters
**Example:**
- ❌ Wrong: `pass`, `12345`
- ✅ Correct: `Test123`, `MyPassword2024`, `secure123`

#### Issue: "Valid mobile number is required"
**Problem:** Mobile number is invalid format (if provided)
**Solution:** Use exactly 10 digits
**Example:**
- ❌ Wrong: `123` (too short), `98765432109` (too long), `9876-543210` (with dashes)
- ✅ Correct: `9876543210`, `8765432109`

#### Issue: "Pincode must be 6 digits"
**Problem:** Pincode is invalid format (if provided)
**Solution:** Use exactly 6 digits
**Example:**
- ❌ Wrong: `12345` (too short), `1234567` (too long), `123456a` (contains letter)
- ✅ Correct: `123456`, `560001`, `400001`

### Step 4: Test Registration Form

Fill form with these test values:
```
Name:     John Doe
Email:    john@example.com
Password: Test123456
Mobile:   9876543210 (optional)
Address:  123 Main St (optional)
Pincode:  123456 (optional)
District: Bangalore (optional)
State:    Karnataka (optional)
```

If this works, you'll see success message and get a login token.

### Step 5: Check Frontend logs

In the Expo terminal, look for error details:
```
ERROR  Registration error: [Error: Validation failed]
```

Or check the detailed response in the API response which should show:
```javascript
{
  success: false,
  error: "Validation failed",
  details: [
    {
      field: "fieldName",
      message: "error description",
      value: "what you sent"
    }
  ]
}
```

### Step 6: Network Check

Make sure:
1. Backend is running on `http://localhost:5000`
2. Frontend `environment.js` has `API_URL = 'http://localhost:5000/api/v1'`
3. Both are on same machine or connected network

To test backend directly:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123"
  }'
```

Expected success response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

Expected validation error response:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required",
      "value": "invalid"
    }
  ]
}
```

### Step 7: Debug Mode

To see all validation errors in real-time:

**Backend:**
- Check terminal for `[VALIDATION]` output
- Check `backend/logs/error.log` for detailed validation errors

**Frontend:**
- Check Expo terminal for error messages
- Check network response in browser DevTools

### Still Having Issues?

1. **Clear app cache:**
   - Press `r` in Expo terminal to reload
   - Clear browser cache if using web

2. **Restart servers:**
   ```bash
   # Kill all Node processes
   Get-Process node | Stop-Process -Force
   
   # Restart backend
   cd backend && node server.js
   
   # Restart frontend
   cd frontend && npm start
   ```

3. **Check database:**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

4. **Review logs:**
   - Backend: `backend/logs/error.log`
   - Frontend: Expo console output

### Support

All validation is logged in real-time. When registration fails:
1. Check backend console for `[VALIDATION]` logs showing exact error
2. Fix the field based on the error message
3. Try again

The validation is intentionally strict to ensure data quality. If you see an error, it's helping you enter valid data!
