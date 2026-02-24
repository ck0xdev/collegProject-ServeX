import { auth } from './firebase';

const setAdminClaim = async (uid: string) => {
  try {
    // This attaches the admin role to the user's token securely
    await auth.setCustomUserClaims(uid, { role: 'admin' });
    console.log(`Success! Admin claim set for user UID: ${uid}`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  }
};

// Paste the UID you copied from Firebase Console right here
const targetUid = 'oKewJpZ0GxYSkzh0imD9g70DU4x1'; 

setAdminClaim(targetUid);