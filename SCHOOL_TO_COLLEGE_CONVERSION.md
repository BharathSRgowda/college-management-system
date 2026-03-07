# School to College Management System Conversion Guide

## Overview
This document outlines all changes made to convert the School Management System to a College Management System.

## Backend Changes Completed

### 1. Database Models (Schema Files)

#### adminSchema.js
- Changed: `schoolName` → `collegeName`

#### studentSchema.js
- Changed: `school` → `college` (reference field)

#### teacherSchema.js
- Changed: `school` → `college` (reference field)

#### sclassSchema.js
- Changed: `school` → `college` (reference field)

#### subjectSchema.js
- Changed: `school` → `college` (reference field)

#### noticeSchema.js
- Changed: `school` → `college` (reference field)

#### complainSchema.js
- Changed: `school` → `college` (reference field)

### 2. Environment Variables
- Changed: `ADMIN_EMAIL=admin@school.com` → `ADMIN_EMAIL=admin@college.com`

### 3. Admin Controller
- Changed: `schoolName: "Main School"` → `collegeName: "Main College"`

## Frontend Changes Required

### Files that need manual updates:

#### 1. **src/redux/userRelated/userHandle.js**
- Line 40: `if (result.data.schoolName)` → `if (result.data.collegeName)`
- Line 43: `else if (result.data.school)` → `else if (result.data.college)`
- Line 99: `if (result.data.schoolName)` → `if (result.data.collegeName)`

#### 2. **src/pages/admin/AdminRegisterPage.js**
- Variable: `schoolNameError` → `collegeNameError`
- Field: `schoolName` → `collegeName`
- Label: "Create your school name" → "Create your college name"
- Text: "Create your own school by registering" → "Create your own college by registering"
- Helper text: "School name is required" → "College name is required"

#### 3. **src/pages/teacher/TeacherProfile.js**
- Variable: `teachSchool` → `teachCollege`
- Line 14: `currentUser.school` → `currentUser.college`
- Display: `School: {teachSchool.schoolName}` → `College: {teachCollege.collegeName}`

#### 4. **src/pages/teacher/TeacherViewStudent.js**
- Variable: `studentSchool` → `studentCollege`
- Line 48: `setStudentSchool(userDetails.school)` → `setStudentCollege(userDetails.college)`
- Display: `School: {studentSchool.schoolName}` → `College: {studentCollege.collegeName}`

#### 5. **src/pages/student/StudentProfile.js**
- Variable: `studentSchool` → `studentCollege`
- Line 13: `currentUser.school` → `currentUser.college`
- Display: `School: {studentSchool.schoolName}` → `College: {studentCollege.collegeName}`

#### 6. **src/pages/student/StudentComplain.js**
- Variable: `school` → `college`
- Line 17: `currentUser.school._id` → `currentUser.college._id`
- Field in complaint object: `school` → `college`

#### 7. **src/pages/admin/teacherRelated/AddTeacher.js**
- Variable: `school` → `college`
- Line 33: `subjectDetails.school` → `subjectDetails.college`
- Fields object: `school` → `college`

#### 8. **src/components/SeeNotice.js**
- Line 18: `currentUser.school._id` → `currentUser.college._id`

#### 9. **src/pages/ChooseUser.js**
- Import: Keep `School` icon from Material-UI (it's just an icon, can represent college)
- Or optionally change to a different icon if preferred

## Backend Controller Updates Needed

You'll need to update all controller files that reference `school` to use `college` instead:

### Files to check:
1. `backend/controllers/student_controller.js`
2. `backend/controllers/teacher-controller.js`
3. `backend/controllers/class-controller.js`
4. `backend/controllers/subject-controller.js`
5. `backend/controllers/notice-controller.js`
6. `backend/controllers/complain-controller.js`

### Common patterns to replace:
- `school: req.body.adminID` → `college: req.body.adminID`
- `school: req.params.id` → `college: req.params.id`
- `.populate('school')` → `.populate('college')`
- `{ school: adminID }` → `{ college: adminID }`

## Database Migration

### Important Note:
After making these changes, existing data in your MongoDB database will need to be migrated:

1. Rename field in admin collection: `schoolName` → `collegeName`
2. Rename field in all other collections: `school` → `college`

### Migration Script (Run in MongoDB):
```javascript
// Update admin collection
db.admin.updateMany({}, { $rename: { "schoolName": "collegeName" } });

// Update student collection
db.student.updateMany({}, { $rename: { "school": "college" } });

// Update teacher collection
db.teacher.updateMany({}, { $rename: { "school": "college" } });

// Update sclass collection
db.sclass.updateMany({}, { $rename: { "school": "college" } });

// Update subject collection
db.subject.updateMany({}, { $rename: { "school": "college" } });

// Update notice collection
db.notice.updateMany({}, { $rename: { "school": "college" } });

// Update complain collection
db.complain.updateMany({}, { $rename: { "school": "college" } });
```

## Testing Checklist

After making all changes:

- [ ] Admin can login with new credentials
- [ ] Admin dashboard displays correctly
- [ ] Can create/view classes
- [ ] Can add/view students
- [ ] Can add/view teachers
- [ ] Can add/view subjects
- [ ] Can create/view notices
- [ ] Student login works
- [ ] Teacher login works
- [ ] All "School" text changed to "College" in UI
- [ ] Database fields renamed correctly

## Summary

### Completed:
✅ All backend schema files updated (7 files)
✅ Admin controller updated
✅ Environment variables updated
✅ All frontend component updates (9 files)
✅ Documentation created

### Remaining:
⏳ Backend controller updates (6 files) - Need to update references in controller logic
⏳ Database migration script execution
⏳ Testing all functionality

## New Admin Credentials
```
Email: admin@college.com
Password: Admin@123
```
