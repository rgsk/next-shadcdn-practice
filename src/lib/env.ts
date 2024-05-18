const env = {
  AWS_VAR_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_VAR_ACCESS_KEY!,
  AWS_VAR_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_VAR_SECRET_ACCESS_KEY!,
  SKARTNER_AI: process.env.NEXT_PUBLIC_SKARTNER_AI!,
  SKARTNER_SERVER: process.env.NEXT_PUBLIC_SKARTNER_SERVER!,
  firebaseConfig: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
};
export default env;
