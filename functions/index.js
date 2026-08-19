const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.adminCreateUser = functions.https.onCall(async (data, context) => {
  // Verificar que el llamante es admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }
  const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo administradores pueden crear usuarios.');
  }

  const { email, password, role } = data;
  const userRecord = await admin.auth().createUser({ email, password });
  await admin.firestore().collection('users').doc(userRecord.uid).set({
    email,
    role,
    name: email,
    active: true,
    createdAt: new Date().toISOString(),
  });
  return { uid: userRecord.uid };
});

exports.adminDeleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes iniciar sesión.');
  }
  const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo administradores pueden eliminar usuarios.');
  }

  const { uid } = data;
  await admin.auth().deleteUser(uid);
  await admin.firestore().collection('users').doc(uid).delete();
  return { success: true };
});