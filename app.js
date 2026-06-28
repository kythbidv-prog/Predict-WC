import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app); const $ = id => document.getElementById(id);
let currentUser=null,isAdmin=false,matches=[],myPredictions={},allPredictions=[],activeFilter="all";
const sampleMatches=[
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
];
function usernameToEmail(username){const key=username.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9._-]/g,"");if(!key)throw new Error("Tên đăng nhập không hợp lệ");return `${key}@worldcup.local`;}
function cleanUsername(username){return username.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-zA-Z0-9._-]/g,"");}
function formatDateTime(v){if(!v)return"Chưa có giờ";const d=new Date(v);if(Number.isNaN(d.getTime()))return v;return d.toLocaleString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});}
function matchResult(m){if(m.scoreA===null||m.scoreA===undefined||m.scoreB===null||m.scoreB===undefined)return null;if(Number(m.scoreA)>Number(m.scoreB))return"A";if(Number(m.scoreA)<Number(m.scoreB))return"B";return"D";}
function predictionResult(p){if(p.predA===null||p.predA===undefined||p.predB===null||p.predB===undefined)return null;if(Number(p.predA)>Number(p.predB))return"A";if(Number(p.predA)<Number(p.predB))return"B";return"D";}
function calcPoints(p,m){if(!p||!m||m.scoreA===null||m.scoreA===undefined||m.scoreB===null||m.scoreB===undefined)return{points:0,exact:false,outcome:false};const exact=Number(p.predA)===Number(m.scoreA)&&Number(p.predB)===Number(m.scoreB);const outcome=predictionResult(p)===matchResult(m);if(exact)return{points:5,exact:true,outcome:true};if(outcome)return{points:3,exact:false,outcome:true};return{points:0,exact:false,outcome:false};}
function statusLabel(m){if(m.status==="finished")return"Đã có KQ";if(m.status==="live")return"Đang đá";if(m.locked)return"Đã khóa";return"Đang mở";}function statusClass(m){if(m.status==="finished")return"locked";if(m.status==="live")return"live";if(m.locked)return"locked";return"open";}
async function handleSignup(){const username=cleanUsername($("usernameInput").value),password=$("passwordInput").value;if(!username||password.length<6)return alert("Tên đăng nhập không được trống và mật khẩu tối thiểu 6 ký tự.");try{const cred=await createUserWithEmailAndPassword(auth,usernameToEmail(username),password);await setDoc(doc(db,"users",cred.user.uid),{uid:cred.user.uid,username,usernameKey:username.toLowerCase(),createdAt:serverTimestamp()});alert("Tạo user thành công.");}catch(err){alert("Không tạo được user: "+err.message);}}
async function handleLogin(){const username=cleanUsername($("usernameInput").value),password=$("passwordInput").value;if(!username||!password)return alert("Vui lòng nhập tên đăng nhập và mật khẩu.");try{await signInWithEmailAndPassword(auth,usernameToEmail(username),password);}catch(err){alert("Đăng nhập không thành công: "+err.message);}}
async function checkAdmin(uid){return (await getDoc(doc(db,"admins",uid))).exists();}
function setTab(name){document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active"));document.querySelector(`.tab[data-tab="${name}"]`)?.classList.add("active");if(name==="matches")$("matchesTab").classList.add("active");if(name==="leaderboard")$("leaderboardTab").classList.add("active");if(name==="admin")$("adminTabContent").classList.add("active");}
function subscribeData(){onSnapshot(query(collection(db,"matches"),orderBy("kickoff","asc")),snap=>{matches=snap.docs.map(d=>({id:d.id,...d.data()}));renderMatches();renderLeaderboard();if(isAdmin)renderAdminMatches();});onSnapshot(collection(db,"predictions"),snap=>{allPredictions=snap.docs.map(d=>({id:d.id,...d.data()}));myPredictions={};allPredictions.filter(p=>currentUser&&p.uid===currentUser.uid).forEach(p=>myPredictions[p.matchId]=p);renderMatches();renderLeaderboard();});}
function renderMatches(){const list=$("matchesList");if(!currentUser){list.innerHTML='<div class="skeleton">Đăng nhập để xem lịch và dự đoán.</div>';return;}if(!matches.length){list.innerHTML='<div class="skeleton">Chưa có lịch thi đấu. Admin vào tab Quản trị để nạp lịch mẫu.</div>';return;}let view=[...matches];if(activeFilter==="open")view=view.filter(m=>!m.locked&&m.status!=="finished");if(activeFilter==="finished")view=view.filter(m=>m.status==="finished");list.innerHTML=view.map(m=>{const p=myPredictions[m.id],pts=calcPoints(p,m),locked=m.locked||m.status==="finished",o=m.odds||{},res=m.status==="finished"?`Kết quả: ${m.teamA} ${m.scoreA??"-"} - ${m.scoreB??"-"} ${m.teamB}`:"Chưa có kết quả chính thức";return `<article class="match-card"><div class="match-head"><div><div class="teams">${m.teamA||"Đội 1"} vs ${m.teamB||"Đội 2"}</div><div class="meta">${m.stage||""} • ${formatDateTime(m.kickoff)}</div></div><div class="badges"><span class="badge ${statusClass(m)}">${statusLabel(m)}</span><span class="badge">${pts.points} điểm</span></div></div><div class="match-body"><div><div class="odds-grid"><div class="odd"><small>1</small><strong>${o.teamA??"-"}</strong></div><div class="odd"><small>X</small><strong>${o.draw??"-"}</strong></div><div class="odd"><small>2</small><strong>${o.teamB??"-"}</strong></div><div class="odd"><small>Châu Á</small><strong>${o.handicap??"-"}</strong></div><div class="odd"><small>Tài/Xỉu</small><strong>${o.total??"-"}</strong></div></div><div class="result-line">${res}</div></div><div class="pred-box"><strong>Dự đoán của bạn</strong><div class="pred-inputs"><input type="number" min="0" id="predA-${m.id}" value="${p?.predA??""}" ${locked?"disabled":""}/><span>-</span><input type="number" min="0" id="predB-${m.id}" value="${p?.predB??""}" ${locked?"disabled":""}/></div><div class="pred-actions"><button onclick="window.savePrediction('${m.id}')" ${locked?"disabled":""}>Lưu dự đoán</button><span class="points">${pts.points} pts</span></div></div></div></article>`}).join("");}
window.savePrediction=async function(matchId){if(!currentUser)return alert("Vui lòng đăng nhập.");const m=matches.find(x=>x.id===matchId);if(!m)return alert("Không tìm thấy trận đấu.");if(m.locked||m.status==="finished")return alert("Trận này đã khóa dự đoán.");const predA=Number($(`predA-${matchId}`).value),predB=Number($(`predB-${matchId}`).value);if(!Number.isInteger(predA)||!Number.isInteger(predB)||predA<0||predB<0)return alert("Tỷ số dự đoán phải là số nguyên không âm.");const userSnap=await getDoc(doc(db,"users",currentUser.uid));const username=userSnap.exists()?userSnap.data().username:currentUser.email.split("@")[0];await setDoc(doc(db,"predictions",`${currentUser.uid}_${matchId}`),{uid:currentUser.uid,username,matchId,predA,predB,updatedAt:serverTimestamp()});alert("Đã lưu dự đoán.");};
function renderLeaderboard(){const body=$("leaderboardBody");if(!body)return;const matchMap={};matches.forEach(m=>matchMap[m.id]=m);const stats={};for(const p of allPredictions){if(!stats[p.uid])stats[p.uid]={username:p.username||"Người chơi",points:0,exact:0,outcome:0,count:0};const r=calcPoints(p,matchMap[p.matchId]);stats[p.uid].points+=r.points;stats[p.uid].exact+=r.exact?1:0;stats[p.uid].outcome+=(!r.exact&&r.outcome)?1:0;stats[p.uid].count+=1;}const rows=Object.values(stats).sort((a,b)=>b.points-a.points||b.exact-a.exact);body.innerHTML=rows.length?rows.map((r,i)=>`<tr><td><strong>#${i+1}</strong></td><td>${r.username}</td><td><strong>${r.points}</strong></td><td>${r.exact}</td><td>${r.outcome}</td><td>${r.count}</td></tr>`).join(""):`<tr><td colspan="6">Chưa có dự đoán nào.</td></tr>`;}
function fillAdminForm(m=null){$("matchId").value=m?.id||"";$("stageInput").value=m?.stage||"";$("kickoffInput").value=m?.kickoff||"";$("teamAInput").value=m?.teamA||"";$("teamBInput").value=m?.teamB||"";$("statusInput").value=m?.status||"scheduled";$("scoreAInput").value=m?.scoreA??"";$("scoreBInput").value=m?.scoreB??"";$("penAInput").value=m?.penA??"";$("penBInput").value=m?.penB??"";$("oddAInput").value=m?.odds?.teamA??"";$("oddDrawInput").value=m?.odds?.draw??"";$("oddBInput").value=m?.odds?.teamB??"";$("handicapInput").value=m?.odds?.handicap??"";$("totalInput").value=m?.odds?.total??"";$("lockedInput").checked=Boolean(m?.locked);}
async function saveMatchFromForm(e){e.preventDefault();if(!isAdmin)return alert("Bạn không có quyền admin.");const id=$("matchId").value||`M-${Date.now()}`;const data={stage:$("stageInput").value.trim(),kickoff:$("kickoffInput").value,teamA:$("teamAInput").value.trim(),teamB:$("teamBInput").value.trim(),status:$("statusInput").value,locked:$("lockedInput").checked,scoreA:$("scoreAInput").value===""?null:Number($("scoreAInput").value),scoreB:$("scoreBInput").value===""?null:Number($("scoreBInput").value),penA:$("penAInput").value===""?null:Number($("penAInput").value),penB:$("penBInput").value===""?null:Number($("penBInput").value),odds:{teamA:$("oddAInput").value===""?null:Number($("oddAInput").value),draw:$("oddDrawInput").value===""?null:Number($("oddDrawInput").value),teamB:$("oddBInput").value===""?null:Number($("oddBInput").value),handicap:$("handicapInput").value.trim(),total:$("totalInput").value.trim()},updatedAt:serverTimestamp()};if(!data.stage||!data.kickoff||!data.teamA||!data.teamB)return alert("Vui lòng nhập đủ giai đoạn, thời gian và 2 đội.");await setDoc(doc(db,"matches",id),data,{merge:true});fillAdminForm(null);alert("Đã lưu trận đấu.");}
function renderAdminMatches(){const box=$("adminMatches");if(!box||!isAdmin)return;if(!matches.length){box.innerHTML='<div class="skeleton">Chưa có trận đấu.</div>';return;}box.innerHTML=matches.map(m=>`<div class="admin-match"><div><strong>${m.teamA} vs ${m.teamB}</strong><div class="meta">${m.id} • ${m.stage} • ${formatDateTime(m.kickoff)} • ${statusLabel(m)}</div></div><div class="row"><button class="secondary" onclick="window.editMatch('${m.id}')">Sửa</button><button class="ghost" onclick="window.deleteMatch('${m.id}')">Xóa</button></div></div>`).join("");}
window.editMatch=id=>{fillAdminForm(matches.find(m=>m.id===id));window.scrollTo({top:0,behavior:"smooth"});};window.deleteMatch=async id=>{if(isAdmin&&confirm("Xóa trận này?"))await deleteDoc(doc(db,"matches",id));};
async function seedSampleMatches(){if(!isAdmin)return alert("Bạn không có quyền admin.");for(const m of sampleMatches){const{id,...data}=m;await setDoc(doc(db,"matches",id),{...data,createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});}alert("Đã nạp lịch mẫu. Bạn có thể sửa lại đội, giờ đá, tỷ lệ cược và kết quả.");}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>setTab(btn.dataset.tab)));document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;renderMatches();}));
$("signupBtn").addEventListener("click",handleSignup);$("loginBtn").addEventListener("click",handleLogin);$("logoutBtn").addEventListener("click",()=>signOut(auth));$("matchForm").addEventListener("submit",saveMatchFromForm);$("newMatchBtn").addEventListener("click",()=>fillAdminForm(null));$("seedBtn").addEventListener("click",seedSampleMatches);
onAuthStateChanged(auth,async user=>{currentUser=user;isAdmin=false;if(!user){$("currentUserLabel").textContent="Chưa đăng nhập";$("logoutBtn").classList.add("hidden");$("authPanel").classList.remove("hidden");$("adminTab").classList.add("hidden");setTab("matches");renderMatches();return;}$("logoutBtn").classList.remove("hidden");$("authPanel").classList.add("hidden");const snap=await getDoc(doc(db,"users",user.uid));const username=snap.exists()?snap.data().username:user.email.split("@")[0];$("currentUserLabel").textContent=`${username} | UID: ${user.uid}`;isAdmin=await checkAdmin(user.uid);$("adminTab").classList.toggle("hidden",!isAdmin);subscribeData();});
