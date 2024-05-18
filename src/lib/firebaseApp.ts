import firebase from "firebase/compat/app";
import env from "./env";
export const firebaseApp = firebase.initializeApp(env.firebaseConfig);
