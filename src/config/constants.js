import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD0wO9FUbBf_CUL-dhSV00ttaAlE1a31tA",
    authDomain: "instafilter-123.firebaseapp.com",
    databaseURL: "https://instafilter-123.firebaseio.com",
    projectId: "instafilter-123",
    storageBucket: "instafilter-123.appspot.com",
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = firebase.auth;
export const db = firebase.firestore().settings({ timestampsInSnapshots: true });
