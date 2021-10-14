const firebaseConfig = {
    apiKey: "AIzaSyDPdnZuXcS4L1v_GdVGisYjJF3SDfPxbGc",
    authDomain: "o-ranger-cfe58.firebaseapp.com",
    databaseURL: "https://o-ranger-cfe58-default-rtdb.firebaseio.com",
    projectId: "o-ranger-cfe58",
    storageBucket: "o-ranger-cfe58.appspot.com",
    messagingSenderId: "1046323617212",
    appId: "1:1046323617212:web:0e6c279fc19e776707dfb9",
    measurementId: "G-87VL19MVC6"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: 'https://o-ranger-cfe58-default-rtdb.firebaseio.com'
// });
