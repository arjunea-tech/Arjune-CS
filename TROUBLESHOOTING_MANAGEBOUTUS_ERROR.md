# Troubleshooting Guide: ManageAboutUs Error

## Error: "Cannot read property 'toString' of undefined"

### Root Cause
When the ManageAboutUs component tries to render the latitude/longitude input fields, one of these values is undefined, and calling `.toString()` on undefined causes an error.

---

## Solution Applied ✅

### 1. **Safe String Conversion**
Changed from:
```javascript
value={contact.latitude.toString()}  // ❌ Error if undefined
```

To:
```javascript
value={String(contact.latitude || '')}  // ✅ Safe
```

This ensures:
- If `contact.latitude` exists → converts to string
- If `contact.latitude` is undefined/null → converts empty string
- String() is safer than .toString() method

---

### 2. **Proper State Initialization**
Initial state in component:
```javascript
const [contact, setContact] = useState({
    email: '',
    phone: '',
    address: '',
    latitude: '',      // ✅ Empty string, not undefined
    longitude: ''      // ✅ Empty string, not undefined
});
```

---

### 3. **Safe Data Fetching**
When fetching from API:
```javascript
const contactData = resSettings.data.data.contact;
setContact({
    email: contactData?.email || '',      // Optional chaining + default
    phone: contactData?.phone || '',
    address: contactData?.address || '',
    latitude: contactData?.latitude || '',  // Optional chaining + default
    longitude: contactData?.longitude || ''
});
```

---

### 4. **Proper Data Saving**
When saving to backend:
```javascript
const updateData = {
    aboutUs,
    contact: {
        email: contact.email || '',
        phone: contact.phone || '',
        address: contact.address || '',
        latitude: contact.latitude ? parseFloat(contact.latitude) : null,  // Convert to number or null
        longitude: contact.longitude ? parseFloat(contact.longitude) : null
    }
};
```

---

## If Error Still Shows

### Step 1: Check Browser Console
1. Open React Native Debugger or Metro Console
2. Look for the exact error message
3. Note which field is causing the issue
4. Check the stack trace

### Step 2: Add Console Logging
Add this to `fetchAboutUs()` function:
```javascript
console.log('[ManageAboutUs] Full contact object:', contact);
console.log('[ManageAboutUs] Latitude type:', typeof contact.latitude);
console.log('[ManageAboutUs] Longitude type:', typeof contact.longitude);
console.log('[ManageAboutUs] API Response:', resSettings.data.data);
```

### Step 3: Verify API Response
Check what the API is actually returning:
1. Open Network tab in debugger
2. Look for `/settings` request
3. Check the response body for contact field
4. Verify contact exists and has all fields

### Step 4: Backend Verification
Check if the Settings model has default values:
```javascript
// In backend/models/Settings.js
contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
}
```

---

## Debug Checklist

- [ ] Cleared React Native cache: `expo start -c`
- [ ] Checked browser console for exact error
- [ ] Verified API endpoint `/settings` returns contact object
- [ ] Confirmed initial state has all fields as empty strings
- [ ] Tested with fresh contact data (all fields empty)
- [ ] Tested with saved contact data (all fields filled)
- [ ] Restarted the development server
- [ ] Cleared node_modules and reinstalled

---

## Preventing This Error in Future

### Best Practice 1: Always Use Defaults
```javascript
// ❌ Bad
const value = data.latitude.toString();

// ✅ Good
const value = String(data?.latitude || '');
```

### Best Practice 2: Validate Before Operations
```javascript
// ❌ Bad
if (data.latitude) {
    return data.latitude.toString();
}

// ✅ Good
if (data?.latitude !== undefined && data.latitude !== null) {
    return String(data.latitude);
}
```

### Best Practice 3: Consistent State Structure
```javascript
// ✅ Always initialize ALL fields in state
const [contact, setContact] = useState({
    email: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: ''
});
```

### Best Practice 4: Safe API Handling
```javascript
// ✅ Always provide defaults when destructuring
const {
    email = '',
    phone = '',
    address = '',
    latitude = '',
    longitude = ''
} = apiResponse.contact || {};
```

---

## Common Causes

| Cause | Fix |
|-------|-----|
| API not returning contact object | Check backend `/settings` endpoint |
| Component rendering before data loads | Add loading state check |
| Undefined instead of empty string | Use `|| ''` default operator |
| Direct call to .toString() on non-existent value | Use `String()` wrapper instead |
| State not initialized properly | Ensure all fields in initial state |

---

## Testing the Fix

### Test Case 1: Fresh Component Load
1. Navigate to ManageAboutUs
2. Wait for loading to complete
3. Check if latitude/longitude fields appear
4. Fields should be empty but visible

### Test Case 2: Editing Values
1. Type coordinates in latitude field
2. Type coordinates in longitude field
3. Click "Save Changes"
4. Wait for success alert
5. Values should persist after reload

### Test Case 3: Viewing Map
1. Enter valid coordinates
2. Click "View on Map" button
3. Google Maps should open with those coordinates

### Test Case 4: Empty Values
1. Leave latitude/longitude empty
2. Click "Save Changes"
3. Should save without errors
4. Fields should remain empty

---

## Additional Resources

- **React Native TextInput Docs:** https://reactnative.dev/docs/textinput
- **JavaScript Optional Chaining:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
- **Nullish Coalescing Operator:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator

---

## Still Stuck?

If the error persists:
1. Capture the exact error message and stack trace
2. Check the API response in Network tab
3. Verify all fixes are applied
4. Try a complete app restart: `expo start -c`
5. Check if other components have similar patterns that work

Last Updated: January 23, 2026
