import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const $ = (id) => document.getElementById(id);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let isAdmin = false;
let matches = [];
let predictions = [];
let myPredictions = {};
let activeFilter = "all";

const sampleMatches = [
  {
    "id": "M001",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-11T20:00",
    "teamA": "Mexico",
    "teamB": "South Africa",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M002",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-12T20:00",
    "teamA": "South Korea",
    "teamB": "Czechia",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M003",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-12T23:00",
    "teamA": "Canada",
    "teamB": "Bosnia and Herzegovina",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M004",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-13T20:00",
    "teamA": "United States",
    "teamB": "Paraguay",
    "status": "finished",
    "locked": true,
    "scoreA": 4,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M005",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-13T23:00",
    "teamA": "Qatar",
    "teamB": "Switzerland",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M006",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-14T02:00",
    "teamA": "Brazil",
    "teamB": "Morocco",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M007",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-14T20:00",
    "teamA": "Haiti",
    "teamB": "Scotland",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M008",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-14T23:00",
    "teamA": "Australia",
    "teamB": "Turkiye",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M009",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-15T02:00",
    "teamA": "Germany",
    "teamB": "Curacao",
    "status": "finished",
    "locked": true,
    "scoreA": 7,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M010",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-15T05:00",
    "teamA": "Netherlands",
    "teamB": "Japan",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M011",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-15T20:00",
    "teamA": "Ivory Coast",
    "teamB": "Ecuador",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M012",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-15T23:00",
    "teamA": "Sweden",
    "teamB": "Tunisia",
    "status": "finished",
    "locked": true,
    "scoreA": 5,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M013",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-16T02:00",
    "teamA": "Spain",
    "teamB": "Cape Verde",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M014",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-16T05:00",
    "teamA": "Egypt",
    "teamB": "Belgium",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M015",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-16T08:00",
    "teamA": "Saudi Arabia",
    "teamB": "Uruguay",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M016",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-16T20:00",
    "teamA": "Iran",
    "teamB": "New Zealand",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M017",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-16T23:00",
    "teamA": "France",
    "teamB": "Senegal",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M018",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-17T02:00",
    "teamA": "Iraq",
    "teamB": "Norway",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 4,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M019",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-17T20:00",
    "teamA": "Argentina",
    "teamB": "Algeria",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M020",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-17T23:00",
    "teamA": "Austria",
    "teamB": "Jordan",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M021",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-18T02:00",
    "teamA": "Portugal",
    "teamB": "DR Congo",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M022",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-18T05:00",
    "teamA": "England",
    "teamB": "Croatia",
    "status": "finished",
    "locked": true,
    "scoreA": 4,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M023",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-18T08:00",
    "teamA": "Ghana",
    "teamB": "Panama",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M024",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-18T10:00",
    "teamA": "Colombia",
    "teamB": "Uzbekistan",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M025",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-18T20:00",
    "teamA": "Czechia",
    "teamB": "South Africa",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M026",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-18T23:00",
    "teamA": "Switzerland",
    "teamB": "Bosnia and Herzegovina",
    "status": "finished",
    "locked": true,
    "scoreA": 4,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M027",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-19T02:00",
    "teamA": "Canada",
    "teamB": "Qatar",
    "status": "finished",
    "locked": true,
    "scoreA": 6,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M028",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-19T05:00",
    "teamA": "Mexico",
    "teamB": "South Korea",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M029",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-19T20:00",
    "teamA": "USA",
    "teamB": "Australia",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M030",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-19T23:00",
    "teamA": "Scotland",
    "teamB": "Morocco",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M031",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-20T02:00",
    "teamA": "Brazil",
    "teamB": "Haiti",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M032",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-20T05:00",
    "teamA": "Turkiye",
    "teamB": "Paraguay",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M033",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-20T20:00",
    "teamA": "Netherlands",
    "teamB": "Sweden",
    "status": "finished",
    "locked": true,
    "scoreA": 5,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M034",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-20T23:00",
    "teamA": "Germany",
    "teamB": "Ivory Coast",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M035",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-21T02:00",
    "teamA": "Ecuador",
    "teamB": "Curacao",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M036",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-21T05:00",
    "teamA": "Tunisia",
    "teamB": "Japan",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 4,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M037",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-21T20:00",
    "teamA": "Spain",
    "teamB": "Saudi Arabia",
    "status": "finished",
    "locked": true,
    "scoreA": 4,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M038",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-21T23:00",
    "teamA": "Belgium",
    "teamB": "Iran",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M039",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-22T02:00",
    "teamA": "Uruguay",
    "teamB": "Cape Verde",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M040",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-22T05:00",
    "teamA": "New Zealand",
    "teamB": "Egypt",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 3,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M041",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-22T20:00",
    "teamA": "Argentina",
    "teamB": "Austria",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M042",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-22T23:00",
    "teamA": "France",
    "teamB": "Iraq",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M043",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-23T02:00",
    "teamA": "Norway",
    "teamB": "Senegal",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M044",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-23T05:00",
    "teamA": "Jordan",
    "teamB": "Algeria",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M045",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-23T20:00",
    "teamA": "Portugal",
    "teamB": "Uzbekistan",
    "status": "finished",
    "locked": true,
    "scoreA": 5,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M046",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-23T23:00",
    "teamA": "England",
    "teamB": "Ghana",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M047",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-24T02:00",
    "teamA": "Croatia",
    "teamB": "Panama",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M048",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-24T05:00",
    "teamA": "Colombia",
    "teamB": "DR Congo",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M049",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-24T20:00",
    "teamA": "Bosnia and Herzegovina",
    "teamB": "Qatar",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M050",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-24T23:00",
    "teamA": "Switzerland",
    "teamB": "Canada",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M051",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-25T02:00",
    "teamA": "Morocco",
    "teamB": "Haiti",
    "status": "finished",
    "locked": true,
    "scoreA": 4,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M052",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-25T05:00",
    "teamA": "Scotland",
    "teamB": "Brazil",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 3,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M053",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-25T20:00",
    "teamA": "South Africa",
    "teamB": "South Korea",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M054",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-25T23:00",
    "teamA": "Czechia",
    "teamB": "Mexico",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 3,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M055",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T02:00",
    "teamA": "Curacao",
    "teamB": "Ivory Coast",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M056",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T05:00",
    "teamA": "Ecuador",
    "teamB": "Germany",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M057",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T08:00",
    "teamA": "Japan",
    "teamB": "Sweden",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M058",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T10:00",
    "teamA": "Tunisia",
    "teamB": "Netherlands",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 3,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M059",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T12:00",
    "teamA": "Turkey",
    "teamB": "United States",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M060",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T14:00",
    "teamA": "Paraguay",
    "teamB": "Australia",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M061",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T20:00",
    "teamA": "Norway",
    "teamB": "France",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 4,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M062",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-26T23:00",
    "teamA": "Senegal",
    "teamB": "Iraq",
    "status": "finished",
    "locked": true,
    "scoreA": 5,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M063",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-27T02:00",
    "teamA": "Cape Verde",
    "teamB": "Saudi Arabia",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M064",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-27T05:00",
    "teamA": "Uruguay",
    "teamB": "Spain",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M065",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-27T08:00",
    "teamA": "New Zealand",
    "teamB": "Belgium",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 5,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M066",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-27T10:00",
    "teamA": "Egypt",
    "teamB": "Iran",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M067",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-27T20:00",
    "teamA": "Panama",
    "teamB": "England",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 2,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M068",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-27T23:00",
    "teamA": "Croatia",
    "teamB": "Ghana",
    "status": "finished",
    "locked": true,
    "scoreA": 2,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M069",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-28T02:00",
    "teamA": "Colombia",
    "teamB": "Portugal",
    "status": "finished",
    "locked": true,
    "scoreA": 0,
    "scoreB": 0,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M070",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-28T05:00",
    "teamA": "DR Congo",
    "teamB": "Uzbekistan",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 1,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M071",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-28T08:00",
    "teamA": "Algeria",
    "teamB": "Austria",
    "status": "finished",
    "locked": true,
    "scoreA": 3,
    "scoreB": 3,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M072",
    "stage": "Vòng bảng",
    "kickoff": "2026-06-28T10:00",
    "teamA": "Jordan",
    "teamB": "Argentina",
    "status": "finished",
    "locked": true,
    "scoreA": 1,
    "scoreB": 3,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.2,
      "x": 3.2,
      "b": 3.0,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M073",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-28T21:00",
    "teamA": "South Africa",
    "teamB": "Canada",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.7,
      "x": 3.1,
      "b": 2.45,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M074",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-29T02:00",
    "teamA": "Brazil",
    "teamB": "Japan",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.62,
      "x": 3.75,
      "b": 5.2,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M075",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-29T05:00",
    "teamA": "Germany",
    "teamB": "Paraguay",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.78,
      "x": 3.45,
      "b": 4.25,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M076",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-29T08:00",
    "teamA": "Netherlands",
    "teamB": "Morocco",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.05,
      "x": 3.25,
      "b": 3.35,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M077",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-30T02:00",
    "teamA": "Ivory Coast",
    "teamB": "Norway",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 3.2,
      "x": 3.25,
      "b": 2.15,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M078",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-30T05:00",
    "teamA": "France",
    "teamB": "Sweden",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.72,
      "x": 3.5,
      "b": 4.8,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M079",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-06-30T08:00",
    "teamA": "Mexico",
    "teamB": "Ecuador",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.0,
      "x": 3.2,
      "b": 3.65,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M080",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-01T02:00",
    "teamA": "England",
    "teamB": "DR Congo",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.55,
      "x": 3.9,
      "b": 5.8,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M081",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-01T05:00",
    "teamA": "Belgium",
    "teamB": "Senegal",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.1,
      "x": 3.2,
      "b": 3.35,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M082",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-01T08:00",
    "teamA": "United States",
    "teamB": "Bosnia and Herzegovina",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.9,
      "x": 3.3,
      "b": 3.85,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M083",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-02T02:00",
    "teamA": "Spain",
    "teamB": "Austria",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.65,
      "x": 3.6,
      "b": 5.1,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M084",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-02T05:00",
    "teamA": "Portugal",
    "teamB": "Croatia",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.0,
      "x": 3.15,
      "b": 3.6,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M085",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-02T08:00",
    "teamA": "Switzerland",
    "teamB": "Algeria",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.05,
      "x": 3.2,
      "b": 3.45,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M086",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-03T02:00",
    "teamA": "Australia",
    "teamB": "Egypt",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.65,
      "x": 3.05,
      "b": 2.6,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M087",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-03T05:00",
    "teamA": "Argentina",
    "teamB": "Cape Verde",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 1.35,
      "x": 4.6,
      "b": 8.5,
      "handicap": "0",
      "total": "2.5"
    }
  },
  {
    "id": "M088",
    "stage": "Vòng 32 đội",
    "kickoff": "2026-07-03T08:00",
    "teamA": "Colombia",
    "teamB": "Ghana",
    "status": "scheduled",
    "locked": false,
    "scoreA": null,
    "scoreB": null,
    "penA": null,
    "penB": null,
    "odds": {
      "a": 2.0,
      "x": 3.15,
      "b": 3.7,
      "handicap": "0",
      "total": "2.5"
    }
  }
];

function cleanName(v){return (v||"").trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-zA-Z0-9._-]/g,"").toLowerCase();}
function emailOf(username){const u=cleanName(username); if(!u) throw new Error("Tên đăng nhập không hợp lệ"); return `${u}@worldcup.local`;}
function fmtTime(v){if(!v)return"Chưa có giờ";const d=new Date(v);return Number.isNaN(d.getTime())?v:d.toLocaleString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});}
function resultOf(a,b){if(a===null||a===undefined||b===null||b===undefined||a===""||b==="")return null;a=Number(a);b=Number(b);return a>b?"A":a<b?"B":"D";}
function pointsOf(pred,match){if(!pred||!match)return{pts:0,exact:false,outcome:false};const real=resultOf(match.scoreA,match.scoreB);const guess=resultOf(pred.predA,pred.predB);if(!real||!guess)return{pts:0,exact:false,outcome:false};const exact=Number(pred.predA)===Number(match.scoreA)&&Number(pred.predB)===Number(match.scoreB);const outcome=real===guess;return exact?{pts:5,exact:true,outcome:true}:outcome?{pts:3,exact:false,outcome:true}:{pts:0,exact:false,outcome:false};}
function labelOf(m){return m.status==="finished"?"Đã có KQ":m.status==="live"?"Đang đá":m.locked?"Đã khóa":"Đang mở";}
function classOf(m){return m.status==="live"?"live":(m.status==="finished"||m.locked)?"locked":"open";}

function setUserLabel(){$("userLabel").textContent=currentUser?`${currentUser.username}${isAdmin?" · Admin":""}`:"Chưa đăng nhập";$("logoutBtn").classList.toggle("hidden",!currentUser);$("loginCard").classList.toggle("hidden",!!currentUser);$("adminTabBtn").classList.toggle("hidden",!isAdmin);}
function setTab(name){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tabpage").forEach(x=>x.classList.remove("active"));document.querySelector(`.tab[data-tab="${name}"]`)?.classList.add("active");$(`${name}Tab`)?.classList.add("active");}
function refreshAll(){myPredictions={};if(currentUser)predictions.filter(p=>p.uid===currentUser.uid).forEach(p=>myPredictions[p.matchId]=p);setUserLabel();renderMatches();renderRanking();renderAdmin();}

function renderMatches(){
 const box=$("matchesList");
 if(!currentUser){box.innerHTML=`<div class="empty">Đăng nhập để xem lịch và nhập dự đoán.</div>`;return;}
 if(!matches.length){box.innerHTML=`<div class="empty">Chưa có lịch. Admin đăng nhập rồi bấm "Nạp 88 trận".</div>`;return;}
 let list=[...matches].sort((a,b)=>(a.kickoff||"").localeCompare(b.kickoff||""));
 if(activeFilter==="open")list=list.filter(m=>!m.locked&&m.status!=="finished");
 if(activeFilter==="finished")list=list.filter(m=>m.status==="finished");
 box.innerHTML=list.map(m=>{const p=myPredictions[m.id];const pts=pointsOf(p,m);const locked=m.locked||m.status==="finished";const odds=m.odds||{};
 return `<article class="match-card"><div class="match-head"><div><div class="teams">${m.teamA} vs ${m.teamB}</div><div class="meta">${m.stage} · ${fmtTime(m.kickoff)}</div></div><div class="badges"><span class="badge ${classOf(m)}">${labelOf(m)}</span><span class="badge">${pts.pts} điểm</span></div></div><div class="match-body"><div><div class="odds-grid"><div class="odd"><small>1</small><strong>${odds.a??"-"}</strong></div><div class="odd"><small>X</small><strong>${odds.x??"-"}</strong></div><div class="odd"><small>2</small><strong>${odds.b??"-"}</strong></div><div class="odd"><small>Châu Á</small><strong>${odds.handicap??"-"}</strong></div><div class="odd"><small>Tài/Xỉu</small><strong>${odds.total??"-"}</strong></div></div><div class="result-line">Kết quả: ${m.scoreA??"-"} - ${m.scoreB??"-"} ${m.penA!=null&&m.penB!=null?`(Pen ${m.penA}-${m.penB})`:""}</div></div><div class="pred-box"><strong>Dự đoán của bạn</strong><div class="pred-inputs"><input id="pa-${m.id}" type="number" min="0" value="${p?.predA??""}" ${locked?"disabled":""}/><span>-</span><input id="pb-${m.id}" type="number" min="0" value="${p?.predB??""}" ${locked?"disabled":""}/></div><div class="row"><button class="btn" onclick="window.savePrediction('${m.id}')" ${locked?"disabled":""}>Lưu dự đoán</button><span class="points">${pts.pts} pts</span></div></div></div></article>`;}).join("");
}

function renderRanking(){const body=$("rankingBody");const map={};matches.forEach(m=>map[m.id]=m);const stats={};predictions.forEach(p=>{if(!stats[p.uid])stats[p.uid]={username:p.username||"Người chơi",pts:0,exact:0,outcome:0,count:0};const rs=pointsOf(p,map[p.matchId]);stats[p.uid].pts+=rs.pts;stats[p.uid].exact+=rs.exact?1:0;stats[p.uid].outcome+=(!rs.exact&&rs.outcome)?1:0;stats[p.uid].count+=1;});const rows=Object.values(stats).sort((a,b)=>b.pts-a.pts||b.exact-a.exact);body.innerHTML=rows.length?rows.map((r,i)=>`<tr><td><strong>#${i+1}</strong></td><td>${r.username}</td><td><strong>${r.pts}</strong></td><td>${r.exact}</td><td>${r.outcome}</td><td>${r.count}</td></tr>`).join(""):`<tr><td colspan="6">Chưa có dự đoán.</td></tr>`;}

function fillForm(m={}){$("matchId").value=m.id||"";$("stage").value=m.stage||"";$("kickoff").value=m.kickoff||"";$("teamA").value=m.teamA||"";$("teamB").value=m.teamB||"";$("status").value=m.status||"scheduled";$("scoreA").value=m.scoreA??"";$("scoreB").value=m.scoreB??"";$("penA").value=m.penA??"";$("penB").value=m.penB??"";$("oddA").value=m.odds?.a??"";$("oddX").value=m.odds?.x??"";$("oddB").value=m.odds?.b??"";$("handicap").value=m.odds?.handicap??"";$("total").value=m.odds?.total??"";$("locked").checked=!!m.locked;}
function getFormMatch(){const id=$("matchId").value||`M-${Date.now()}`;return{id,stage:$("stage").value.trim(),kickoff:$("kickoff").value,teamA:$("teamA").value.trim(),teamB:$("teamB").value.trim(),status:$("status").value,locked:$("locked").checked,scoreA:$("scoreA").value===""?null:Number($("scoreA").value),scoreB:$("scoreB").value===""?null:Number($("scoreB").value),penA:$("penA").value===""?null:Number($("penA").value),penB:$("penB").value===""?null:Number($("penB").value),odds:{a:$("oddA").value===""?null:Number($("oddA").value),x:$("oddX").value===""?null:Number($("oddX").value),b:$("oddB").value===""?null:Number($("oddB").value),handicap:$("handicap").value.trim(),total:$("total").value.trim()}};}
function renderAdmin(){const box=$("adminList");if(!box||!isAdmin)return;if(!matches.length){box.innerHTML=`<div class="empty">Chưa có trận đấu.</div>`;return;}box.innerHTML=[...matches].sort((a,b)=>(a.kickoff||"").localeCompare(b.kickoff||"")).map(m=>`<div class="admin-item"><div><strong>${m.teamA} vs ${m.teamB}</strong><div class="meta">${m.id} · ${m.stage} · ${fmtTime(m.kickoff)} · ${labelOf(m)}</div></div><div class="row"><button class="btn secondary" onclick="window.editMatch('${m.id}')">Sửa</button><button class="btn ghost" onclick="window.removeMatch('${m.id}')">Xóa</button></div></div>`).join("");}

async function authAction(signup=false){const username=cleanName($("username").value);const pass=$("password").value;if(!username||pass.length<6)return alert("Tên đăng nhập không được trống, mật khẩu tối thiểu 6 ký tự.");try{if(signup){const cred=await createUserWithEmailAndPassword(auth,emailOf(username),pass);await setDoc(doc(db,"users",cred.user.uid),{uid:cred.user.uid,username,createdAt:serverTimestamp()});}else{await signInWithEmailAndPassword(auth,emailOf(username),pass);}}catch(e){alert((signup?"Không tạo được user: ":"Đăng nhập không thành công: ")+e.message);}}

window.savePrediction=async(matchId)=>{if(!currentUser)return alert("Vui lòng đăng nhập.");const m=matches.find(x=>x.id===matchId);if(!m)return;if(m.locked||m.status==="finished")return alert("Trận này đã khóa.");const predA=Number($(`pa-${matchId}`).value),predB=Number($(`pb-${matchId}`).value);if(!Number.isInteger(predA)||!Number.isInteger(predB)||predA<0||predB<0)return alert("Tỷ số phải là số nguyên không âm.");const data={uid:currentUser.uid,username:currentUser.username,matchId,predA,predB,updatedAt:serverTimestamp()};await setDoc(doc(db,"predictions",`${currentUser.uid}_${matchId}`),data);alert("Đã lưu dự đoán.");};
window.editMatch=(id)=>{const m=matches.find(x=>x.id===id);if(m)fillForm(m);};
window.removeMatch=async(id)=>{if(!isAdmin)return;if(confirm("Xóa trận này?"))await deleteDoc(doc(db,"matches",id));};

async function saveMatch(e){e.preventDefault();if(!isAdmin)return alert("Bạn không có quyền admin.");const m=getFormMatch();if(!m.stage||!m.kickoff||!m.teamA||!m.teamB)return alert("Nhập đủ giai đoạn, giờ đá, đội 1, đội 2.");const {id,...data}=m;await setDoc(doc(db,"matches",id),{...data,updatedAt:serverTimestamp()},{merge:true});fillForm();alert("Đã lưu trận.");}
async function seed(){if(!isAdmin)return alert("Bạn không có quyền admin.");for(const m of sampleMatches){const {id,...data}=m;await setDoc(doc(db,"matches",id),{...data,updatedAt:serverTimestamp()},{merge:true});}alert("Đã nạp 88 trận.");}
async function clearMatches(){if(!isAdmin)return;if(!confirm("Xóa toàn bộ lịch? Dự đoán cũ vẫn giữ nhưng không hiện nếu không có trận."))return;const snap=await getDocs(collection(db,"matches"));for(const d of snap.docs)await deleteDoc(doc(db,"matches",d.id));alert("Đã xóa lịch.");}

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderMatches();});
$("loginBtn").onclick=()=>authAction(false);
$("signupBtn").onclick=()=>authAction(true);
$("logoutBtn").onclick=()=>signOut(auth);
$("matchForm").onsubmit=saveMatch;
$("clearFormBtn").onclick=()=>fillForm();
$("seedBtn").onclick=seed;
$("clearMatchesBtn").onclick=clearMatches;

$("modeNote").textContent="Đang chạy Firebase. Tạo user tên admin để có quyền quản trị.";

onAuthStateChanged(auth, async user=>{if(!user){currentUser=null;isAdmin=false;matches=[];predictions=[];refreshAll();return;}const us=await getDoc(doc(db,"users",user.uid));currentUser={uid:user.uid,username:us.exists()?us.data().username:user.email.split("@")[0]};isAdmin=currentUser.username==="admin";onSnapshot(query(collection(db,"matches"),orderBy("kickoff","asc")),s=>{matches=s.docs.map(d=>({id:d.id,...d.data()}));refreshAll();},err=>{console.error(err);alert("Không đọc được collection matches: "+err.message);});onSnapshot(collection(db,"predictions"),s=>{predictions=s.docs.map(d=>({id:d.id,...d.data()}));refreshAll();},err=>{console.error(err);});refreshAll();});
