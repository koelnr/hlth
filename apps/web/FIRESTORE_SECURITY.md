# Firestore Security Rules — Developer Notes

## Current state

Firestore security rules have **not yet been configured**. The application
currently relies on the Firebase Admin SDK (server-side, bypasses rules) for
all data access. This is safe as long as every data operation goes through a
server action or route handler that calls `requireOrganization()` first.

**Do not enable direct client-side Firestore access until the rules below are
implemented and tested.**

## Expected tenancy model

Every document in every collection carries an `organizationId` field equal to
the Clerk organization ID. All reads and writes must be scoped to the caller's
active organization.

## Rules to implement before client-side access

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: caller's Clerk org ID from the JWT custom claim
    // Requires Clerk → Firebase JWT template with `org_id` claim
    function callerOrgId() {
      return request.auth.token.org_id;
    }

    // All org-scoped collections share the same access pattern
    match /patients/{docId} {
      allow read, write: if request.auth != null
        && resource.data.organizationId == callerOrgId();
      allow create: if request.auth != null
        && request.resource.data.organizationId == callerOrgId();
    }

    match /appointments/{docId} {
      allow read, write: if request.auth != null
        && resource.data.organizationId == callerOrgId();
      allow create: if request.auth != null
        && request.resource.data.organizationId == callerOrgId();
    }

    match /follow_ups/{docId} {
      allow read, write: if request.auth != null
        && resource.data.organizationId == callerOrgId();
      allow create: if request.auth != null
        && request.resource.data.organizationId == callerOrgId();
    }

    match /clinic_profiles/{docId} {
      allow read, write: if request.auth != null
        && resource.data.organizationId == callerOrgId();
      allow create: if request.auth != null
        && request.resource.data.organizationId == callerOrgId();
    }

    match /clinic_memberships/{docId} {
      allow read, write: if request.auth != null
        && resource.data.organizationId == callerOrgId();
      allow create: if request.auth != null
        && request.resource.data.organizationId == callerOrgId();
    }
  }
}
```

## Clerk → Firebase JWT setup (required for the rules above)

1. In Clerk Dashboard → JWT Templates → create a "Firebase" template
2. Add the claim: `"org_id": "{{org.id}}"`
3. In your client code, use `useAuth().getToken({ template: 'firebase' })` to
   get a Firebase-compatible token, then call `signInWithCustomToken()` on the
   Firebase client SDK
4. The rules above will then resolve `request.auth.token.org_id` correctly

## Composite indexes required

Run the following Firestore index creates (or let the emulator auto-create
them from query errors):

- `patients`: `organizationId ASC, createdAt DESC`
- `appointments`: `organizationId ASC, scheduledAt DESC`
- `appointments`: `organizationId ASC, patientId ASC, scheduledAt DESC`
- `appointments`: `organizationId ASC, scheduledAt ASC` (for today's query)
- `follow_ups`: `organizationId ASC, status ASC, dueAt ASC`
- `follow_ups`: `organizationId ASC, patientId ASC, dueAt DESC`
