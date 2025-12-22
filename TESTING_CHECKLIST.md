# Routiva Testing Checklist

## ✨ Habit Creation & Management
### Creating Habits
- [ error message needed] Try creating a habit with very long name (60+ chars)

## 🎨 Groups Management
### Creating Groups
- [ error message needed] Try creating duplicate group name (should fail)

### Editing Groups
- [ Doesnt change to none] Remove a group icon (set to None)

### Deleting Groups
- [ no warning message] Try deleting a group with habits (should fail with warning)

## 📊 Dashboard Features
### Completion Rings
- [ circle animation isn't equal to percentage ( full ring)] Verify rings animate on page load

## 📈 Analytics Page
- [ overall completion stays on 100] Verify habit statistics are accurate

## ⚙️ Settings Page
### Theme Settings
- [ light mode still just filtered] Toggle dark mode on/off

### Profile Settings
- [ time zone names are in white] Update profile settings (if editable)

ALSO OVERLAPPING GROUP HABIT DROPDOWN FROM BOTTOM TO TOP.
ALSO WHEN DROP DOWN IS CLICKED AND I CLICK OFF, SHOULD GO AWAY WHEN CLICKED OFF.

## 🌐 Cross-Browser Testing
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in mobile Safari (iOS)
- [ ] Test in mobile Chrome (Android)

## 📱 Responsive Design
### Mobile (375px - 767px)
- [ ] Check navigation is accessible
- [ ] Verify forms are usable
- [ ] Test habit list layout
- [ ] Check group cards layout
- [ ] Test modals fit on screen
- [ ] Verify buttons are tap-friendly
- [ ] Check onboarding modal on mobile
