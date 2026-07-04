// =========================
// CONFIGURATION & INITIALIZATION
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyBUbXO3lzelugz5J3PSk_BwrQYnrsT-m8s",
  authDomain: "study-room-647d5.firebaseapp.com",
  databaseURL: "https://study-room-647d5-default-rtdb.firebaseio.com",
  projectId: "study-room-647d5",
  storageBucket: "study-room-647d5.appspot.com",
  messagingSenderId: "528434627498",
  appId: "1:528434627498:web:a362835ce17bc914e521d3"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const SEATS = {
  "01": { name: "Eng Abuukar", pin: "1111" },
  "02": { name: "Eng Osman", pin: "2222" },
  "03": { name: "Eng Zaki", pin: "3333" },
  "04": { name: "Eng Abdi", pin: "4444" },
  "05": { name: "Eng Hassan", pin: "5555" }
};

const MOTIVATIONS = [
  "Consistency beats talent every single day. Keep working!",
  "Small daily steps lead to massive long-term results.",
  "Your future self will thank you for the focus you put in today.",
  "Mistakes are proof that you are trying and growing.",
  "Excellence is not an event, it is a habit. Stay locked in!"
];

// =========================
// DOM ELEMENTS
// =========================
const form = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");
const codeInput = document.getElementById("codeInput");
const pinInput = document.getElementById("pinInput");
const rememberMe = document.getElementById("rememberMe");

const formBox = document.getElementById("formBox");
const joinBtn = document.getElementById("joinBtn");
const leaveBtn = document.getElementById("leaveBtn");
const changePinBtn = document.getElementById("changePinBtn");
const pinActionBox = document.getElementById("pinActionBox");
const userStatus = document.getElementById("userStatus");
const seat03AccessLink = document.getElementById("seat03AccessLink");
const motivationBox = document.getElementById("motivationBox");

const onlineCount = document.getElementById("onlineCount");
const timerBox = document.getElementById("timer");
const usersList = document.getElementById("usersList");
const attendanceList = document.getElementById("attendanceList");

const attendanceHeaderBtn = document.getElementById("attendanceHeaderBtn");
const attendanceChevron = document.getElementById("attendanceChevron");
const attendanceContent = document.getElementById("attendanceContent");

const adminToggleBtn = document.getElementById("adminToggleBtn");
const adminAuthBox = document.getElementById("adminAuthBox");
const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminCancelBtn = document.getElementById("adminCancelBtn");
const adminPanel = document.getElementById("adminPanel");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const adminSeatsDashboard = document.getElementById("adminSeatsDashboard");

// =========================
// STATE MANAGEMENT
// =========================
let currentUser = null;
let timerInterval = null;
let isAdminAuthenticated = false;
let localizedUserCache = {};

function toast(msg, type = "info") {
  const box = document.getElementById("toastContainer");
  if (!box) return;
  const div = document.createElement("div");
  div.className = `toast ${type}`;
  div.textContent = msg;
  box.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!currentUser) return;
    timerBox.innerText = formatTime(Date.now() - currentUser.start);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerBox.innerText = "0m 0s";
}

function setStatusText(joined, seat = "") {
  if (joined) {
    userStatus.textContent = `Joined (Seat ${seat})`;
    userStatus.classList.add("active");
    if (seat === "03") {
      seat03AccessLink.classList.remove("hidden");
    }
  } else {
    userStatus.textContent = "Not joined";
    userStatus.classList.remove("active");
    seat03AccessLink.classList.add("hidden");
  }
}

// Rotate motivational quotes cleanly localizing experience
function rotateMotivationText() {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONS.length);
  motivationBox.textContent = `"${MOTIVATIONS[randomIndex]}"`;
}
rotateMotivationText();
setInterval(rotateMotivationText, 60000);

// =========================
// ACCORDION TOGGLE EVENT
// =========================
attendanceHeaderBtn.addEventListener("click", () => {
  const isHidden = attendanceContent.classList.contains("hidden");
  if (isHidden) {
    attendanceContent.classList.remove("hidden");
    attendanceChevron.style.transform = "rotate(180deg)";
  } else {
    attendanceContent.classList.add("hidden");
    attendanceChevron.style.transform = "rotate(0deg)";
  }
});

// =========================
// ROOM TRANSACTIONS
// =========================
async function joinRoom(name, code, pin) {
  const normalizedCode = code.trim();
  const targetSeat = SEATS[normalizedCode];

  if (!targetSeat) {
    toast("Invalid seat code", "error");
    return;
  }

  const blockSnap = await db.ref(`blockedSeats/${normalizedCode}`).get();
  if (blockSnap.val() === true) {
    toast("This seat is currently blocked by Admin", "error");
    return;
  }

  let correctPin = targetSeat.pin;
  const customPinSnap = await db.ref(`customPins/${normalizedCode}`).get();
  if (customPinSnap.exists()) {
    correctPin = customPinSnap.val();
  }

  if (correctPin.trim() !== pin.trim()) {
    toast("Wrong PIN for this seat", "error");
    return;
  }
  
  if (targetSeat.name.toLowerCase() !== name.trim().toLowerCase()) {
    toast("Name does not match this assigned seat", "error");
    return;
  }

  const seatRef = db.ref("seats/" + normalizedCode);
  const snap = await seatRef.get();

  if (snap.exists()) {
    toast("Seat already claimed/taken", "error");
    return;
  }

  const userId = "u_" + Math.random().toString(36).slice(2);
  currentUser = {
    id: userId,
    name: targetSeat.name,
    code: normalizedCode,
    start: Date.now()
  };

  if (rememberMe.checked) {
    localStorage.setItem("remembered_name", name);
    localStorage.setItem("remembered_code", normalizedCode);
    localStorage.setItem("remembered_pin", pin);
    localStorage.setItem("remember_checked", "true");
  } else {
    localStorage.removeItem("remembered_name");
    localStorage.removeItem("remembered_code");
    localStorage.removeItem("remembered_pin");
    localStorage.removeItem("remember_checked");
  }

  await seatRef.set(currentUser);
  await db.ref("onlineUsers/" + userId).set(currentUser);

  db.ref("attendance").push({
    name: targetSeat.name,
    code: normalizedCode,
    action: "join",
    time: Date.now()
  });

  toast(`Welcome ${targetSeat.name} (Seat ${normalizedCode})`, "success");
  
  formBox.classList.add("hidden");
  leaveBtn.classList.remove("hidden");
  pinActionBox.classList.remove("hidden");
  setStatusText(true, normalizedCode);

  startTimer();
  localStorage.setItem("active_user", userId);
}

async function leaveRoom(auto = false) {
  if (!currentUser) return;

  const code = currentUser.code;
  const id = currentUser.id;
  const name = currentUser.name;

  currentUser = null;
  stopTimer();

  formBox.classList.remove("hidden");
  leaveBtn.classList.add("hidden");
  pinActionBox.classList.add("hidden");
  setStatusText(false);

  await db.ref("seats/" + code).remove();
  await db.ref("onlineUsers/" + id).remove();

  db.ref("attendance").push({
    name: name,
    code: code,
    action: auto ? "kicked/auto-leave" : "leave",
    time: Date.now()
  });

  toast(auto ? "Session terminated by system/admin" : "Left room successfully", "info");
  localStorage.removeItem("active_user");
}

// =========================
// INTERFACE CONTROLLERS & HOOKS
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  joinRoom(nameInput.value.trim(), codeInput.value.trim(), pinInput.value.trim());
});

leaveBtn.addEventListener("click", () => leaveRoom(false));

changePinBtn.addEventListener("click", async () => {
  if (!localStorage.getItem("active_user") || !userStatus.classList.contains("active")) {
    toast("You must be actively inside a seat to alter configurations", "error");
    return;
  }

  const activeUserKey = localStorage.getItem("active_user");
  const snap = await db.ref("onlineUsers/" + activeUserKey).get();
  if(!snap.exists()) return;
  const code = snap.val().code;

  const newPin = prompt("Enter your custom new secure PIN sequence:");
  if (!newPin || newPin.trim().length < 1) {
    toast("Action cancelled or invalid PIN structure detected", "error");
    return;
  }

  await db.ref(`customPins/${code}`).set(newPin.trim());
  toast(`PIN changed for seat ${code} successfully!`, "success");
});

// =========================
// LOW-BANDWIDTH EVENT-BASED SYNCHRONIZATIONS
// =========================
function renderOnlineUI() {
  usersList.innerHTML = "";
  const usersArray = Object.values(localizedUserCache);
  onlineCount.innerText = usersArray.length;

  usersArray.forEach((u) => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `<span class="name">${u.name}</span><span class="code">Seat ${u.code}</span>`;
    usersList.appendChild(div);
  });

  const currentSavedSession = localStorage.getItem("active_user");
  if (currentSavedSession && !localizedUserCache[currentSavedSession] && currentUser) {
    leaveRoom(true);
  }
}

db.ref("onlineUsers").on("child_added", (snap) => {
  localizedUserCache[snap.key] = snap.val();
  renderOnlineUI();
});

db.ref("onlineUsers").on("child_removed", (snap) => {
  delete localizedUserCache[snap.key];
  renderOnlineUI();
});

db.ref("onlineUsers").on("child_changed", (snap) => {
  localizedUserCache[snap.key] = snap.val();
  renderOnlineUI();
});

// Sync Attendance Stream using child hooks (Avoids reloading the whole log)
db.ref("attendance").limitToLast(12).on("child_added", (snap) => {
  const d = snap.val();
  const div = document.createElement("div");
  div.className = "att-item";
  div.style.cssText = "padding: 6px 8px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #475569;";
  
  const labelColor = d.action === "join" ? "#22c55e" : "#ef4444";
  div.innerHTML = `<strong>${d.name}</strong> (Seat ${d.code}) - <span style="color: ${labelColor}; font-weight:600;">${d.action}</span> - <span style="font-size:11px; color:#94a3b8;">${new Date(d.time).toLocaleTimeString()}</span>`;
  
  attendanceList.insertBefore(div, attendanceList.firstChild);
});

// =========================
// AUTOMATED SESSION RESTORATION
// =========================
window.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("remember_checked") === "true") {
    nameInput.value = localStorage.getItem("remembered_name") || "";
    codeInput.value = localStorage.getItem("remembered_code") || "";
    pinInput.value = localStorage.getItem("remembered_pin") || "";
    rememberMe.checked = true;
  }

  const saved = localStorage.getItem("active_user");
  if (!saved) return;

  const snap = await db.ref("onlineUsers/" + saved).get();
  if (snap.exists()) {
    currentUser = snap.val();
    formBox.classList.add("hidden");
    leaveBtn.classList.remove("hidden");
    pinActionBox.classList.remove("hidden");
    setStatusText(true, currentUser.code);
    startTimer();
    toast("Active session synchronized", "success");
  } else {
    localStorage.removeItem("active_user");
  }
});

// =========================
// ADMINISTRATIVE PRIVILEGE MODULES
// =========================
adminToggleBtn.addEventListener("click", () => {
  adminAuthBox.classList.remove("hidden");
  formBox.classList.add("hidden");
});

adminCancelBtn.addEventListener("click", () => {
  adminAuthBox.classList.add("hidden");
  if(!currentUser) formBox.classList.remove("hidden");
});

function syncAdminDashboardMetrics() {
  db.ref("seats").on("value", async (seatsSnap) => {
    const activeOccupiedSeats = seatsSnap.val() || {};
    const blocksSnap = await db.ref("blockedSeats").get();
    const blockedList = blocksSnap.val() || {};

    adminSeatsDashboard.innerHTML = "";

    Object.keys(SEATS).forEach((seatId) => {
      const seatConfiguration = SEATS[seatId];
      const liveUserRecord = activeOccupiedSeats[seatId];
      const isBlocked = !!blockedList[seatId];

      const row = document.createElement("div");
      row.style.cssText = "background:#1e293b; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; gap:5px; margin-bottom:5px;";
      
      let occupancyStatusMessage = `<span style="color:#a7f3d0;">🟢 Free (${seatConfiguration.name})</span>`;
      if (liveUserRecord) {
        occupancyStatusMessage = `<span style="color:#f43f5e; font-weight:bold;">🔴 ${liveUserRecord.name}</span>`;
      }
      if (isBlocked) {
        occupancyStatusMessage = `<span style="color:#94a3b8; text-decoration:line-through;">🚫 Blocked</span>`;
      }

      row.innerHTML = `
        <div style="font-size:13px; color:white;">
          <strong>Seat ${seatId}:</strong> ${occupancyStatusMessage}
        </div>
        <div style="display:flex; gap:5px;">
          ${liveUserRecord ? `<button onclick="remoteKickSeat('${seatId}', '${liveUserRecord.id}')" style="background:#ef4444; font-size:11px; padding:4px 8px; width:auto; margin:0; color:white; border-radius:5px; cursor:pointer;">Kick</button>` : ""}
          <button onclick="remoteToggleBlockSeat('${seatId}', ${isBlocked})" style="background:${isBlocked ? '#22c55e' : '#f59e0b'}; font-size:11px; padding:4px 8px; width:auto; margin:0; color:white; border-radius:5px; cursor:pointer;">
            ${isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      `;
      adminSeatsDashboard.appendChild(row);
    });
  });
}

adminLoginBtn.addEventListener("click", async () => {
  const email = adminEmail.value.trim();
  const password = adminPassword.value.trim();

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const ADMIN_UID = "trlabHsJKARs1Emga5dQEN7SfKS2";

    if (userCredential.user.uid === ADMIN_UID) {
      isAdminAuthenticated = true;
      toast("Welcome Admin", "success");
      adminAuthBox.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      syncAdminDashboardMetrics();
    } else {
      toast("You are not an administrator.", "error");
      firebase.auth().signOut();
    }
  } catch (err) {
    toast(err.message, "error");
  }
});

adminLogoutBtn.addEventListener("click", () => {
  firebase.auth().signOut().catch(() => {});
  isAdminAuthenticated = false;
  adminPanel.classList.add("hidden");
  if(!currentUser) formBox.classList.remove("hidden");
  toast("Administrative safe logout finalized", "info");
});

window.remoteKickSeat = async function(seatCode, userId) {
  if(!isAdminAuthenticated) return;
  await db.ref(`seats/${seatCode}`).remove();
  await db.ref(`onlineUsers/${userId}`).remove();
  toast(`Evicted user from seat ${seatCode}`, "info");
};

window.remoteToggleBlockSeat = async function(seatCode, currentBlockStatus) {
  if(!isAdminAuthenticated) return;
  if(currentBlockStatus) {
    await db.ref(`blockedSeats/${seatCode}`).remove();
    toast(`Seat ${seatCode} is now unblocked`, "success");
  } else {
    const currentOccupantSnap = await db.ref(`seats/${seatCode}`).get();
    if(currentOccupantSnap.exists()){
      await db.ref(`onlineUsers/${currentOccupantSnap.val().id}`).remove();
      await db.ref(`seats/${seatCode}`).remove();
    }
    await db.ref(`blockedSeats/${seatCode}`).set(true);
    toast(`Seat ${seatCode} completely frozen/blocked`, "error");
  }
};
