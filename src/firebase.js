import firebase from "firebase"


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA5TDLioBa8CHmBODXPKfZF9X6gnwkHhQg",
    authDomain: "instagram-clone-react-a4c60.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-a4c60.firebaseio.com",
    projectId: "instagram-clone-react-a4c60",
    storageBucket: "instagram-clone-react-a4c60.appspot.com",
    messagingSenderId: "402993276301",
    appId: "1:402993276301:web:b4b0a047b503d512e009c4",
    measurementId: "G-BLBVTV7TVQ"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db,auth,storage }