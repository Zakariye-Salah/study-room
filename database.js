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
// DOM ELEMENTS REFERENCE
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
const personalWeeklyBox = document.getElementById("personalWeeklyBox");
const weeklyMinutesVal = document.getElementById("weeklyMinutesVal");
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
// STATE MANAGEMENT & CACHE
// =========================
let currentUser = null;
let timerInterval = null;
let liveCardsInterval = null;
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

function formatHoursMinutes(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h:${minutes < 10 ? '0' : ''}${minutes}m`;
}

function formatLiveSeconds(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${minutes}m ${secs}s`;
}

function getWeekIdentifier() {
  const current = new Date();
  const currentDay = current.getDay(); 
  const shift = (currentDay + 1) % 7; 
  const saturdayDate = new Date(current);
  saturdayDate.setDate(current.getDate() - shift);
  saturdayDate.setHours(0, 0, 0, 0);
  return "week_" + saturdayDate.getFullYear() + "_" + (saturdayDate.getMonth() + 1) + "_" + saturdayDate.getDate();
}

// =========================
// LIGHT/DARK SYSTEM CONTROLLER
// =========================
const themeToggleBtn = document.getElementById("themeToggleBtn");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

function initializeThemeSystem() {
  const cached = localStorage.getItem("app_theme");
  if (cached) {
    setSystemTheme(cached);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSystemTheme(prefersDark ? "dark" : "light");
  }
}

function setSystemTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("app_theme", theme);
  if (theme === "dark") {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}

themeToggleBtn.addEventListener("click", () => {
  const activeTheme = document.documentElement.getAttribute("data-theme");
  setSystemTheme(activeTheme === "dark" ? "light" : "dark");
});
initializeThemeSystem();

// =========================
// OPERATIONS LOGIC
// =========================
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!currentUser) return;
    timerBox.innerText = formatLiveSeconds(Date.now() - currentUser.start);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerBox.innerText = "0m 0s";
  personalWeeklyBox.classList.add("hidden");
}

async function syncPersonalWeeklyAccumulatedTime(seatCode) {
  const currentWeekId = getWeekIdentifier();
  const weekRef = db.ref(`weeklyHours/${currentWeekId}/${seatCode}`);
  weekRef.on("value", (snap) => {
    const historicalMs = snap.val() || 0;
    weeklyMinutesVal.innerText = formatHoursMinutes(historicalMs);
    personalWeeklyBox.classList.remove("hidden");
  });
}

// FIXED: Dashboard image link is now fully visible to ANY seat layout selection
function setStatusText(joined, seat = "") {
  if (joined) {
    userStatus.textContent = `Joined (Seat ${seat})`;
    userStatus.classList.add("active");
    seat03AccessLink.classList.remove("hidden"); 
  } else {
    userStatus.textContent = "Not joined";
    userStatus.classList.remove("active");
    seat03AccessLink.classList.add("hidden");
  }
}

// =========================
// CORE TRANSACTION LAYERS
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
  if (customPinSnap.exists()) correctPin = customPinSnap.val();

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
    localStorage.clear();
    localStorage.setItem("app_theme", document.documentElement.getAttribute("data-theme"));
  }

  await seatRef.set(currentUser);
  await db.ref("onlineUsers/" + userId).set(currentUser);

  db.ref("attendance").push({
    name: targetSeat.name,
    code: normalizedCode,
    action: "join",
    time: Date.now()
  });

  toast(`Welcome ${targetSeat.name}`, "success");
  formBox.classList.add("hidden");
  leaveBtn.classList.remove("hidden");
  pinActionBox.classList.remove("hidden");
  setStatusText(true, normalizedCode);

  startTimer();
  syncPersonalWeeklyAccumulatedTime(normalizedCode);
  localStorage.setItem("active_user", userId);
}

async function leaveRoom(auto = false) {
  if (!currentUser) return;

  const code = currentUser.code;
  const id = currentUser.id;
  const name = currentUser.name;
  const sessionDuration = Date.now() - currentUser.start;

  currentUser = null;
  stopTimer();

  formBox.classList.remove("hidden");
  leaveBtn.classList.add("hidden");
  pinActionBox.classList.add("hidden");
  setStatusText(false);

  const currentWeekId = getWeekIdentifier();
  const weekRef = db.ref(`weeklyHours/${currentWeekId}/${code}`);
  await weekRef.transaction((currentValue) => {
    return (currentValue || 0) + sessionDuration;
  });

  await db.ref("seats/" + code).remove();
  await db.ref("onlineUsers/" + id).remove();

  db.ref("attendance").push({
    name: name,
    code: code,
    action: auto ? "kicked/auto-leave" : "leave",
    time: Date.now()
  });

  toast(auto ? "Session terminated by admin" : "Left room successfully", "info");
  localStorage.removeItem("active_user");
}

// =========================
// REALTIME UI RENDERING & TICKER
// =========================
function renderOnlineUI() {
  usersList.innerHTML = "";
  const usersArray = Object.values(localizedUserCache);
  onlineCount.innerText = usersArray.length;

  usersArray.forEach((u) => {
    const elapsedMs = Date.now() - u.start;
    const div = document.createElement("div");
    div.className = "user-card";
    div.setAttribute("data-start", u.start);
    div.innerHTML = `
      <div class="left-info-block">
        <span class="name">${u.name}</span>
        <span class="live-elapsed-badge">${formatHoursMinutes(elapsedMs)}</span>
      </div>
      <span class="code">Seat ${u.code}</span>
    `;
    usersList.appendChild(div);
  });
}

clearInterval(liveCardsInterval);
liveCardsInterval = setInterval(() => {
  document.querySelectorAll(".user-card").forEach((card) => {
    const startStamp = parseInt(card.getAttribute("data-start"), 10);
    if (startStamp) {
      const badge = card.querySelector(".live-elapsed-badge");
      if (badge) badge.innerText = formatHoursMinutes(Date.now() - startStamp);
    }
  });
}, 60000);

db.ref("onlineUsers").on("value", (snap) => {
  localizedUserCache = snap.val() || {};
  renderOnlineUI();
});

db.ref("attendance").limitToLast(5).on("value", (snap) => {
  attendanceList.innerHTML = "";
  const records = snap.val() || {};
  
  Object.keys(records).reverse().forEach((key) => {
    const d = records[key];
    const div = document.createElement("div");
    div.className = "att-item";
    const labelColor = d.action === "join" ? "#22c55e" : "#ef4444";
    div.innerHTML = `<strong>${d.name}</strong> (Seat ${d.code}) - <span style="color: ${labelColor}; font-weight:700;">${d.action}</span> - <span style="font-size:11px; color:#94a3b8;">${new Date(d.time).toLocaleTimeString()}</span>`;
    attendanceList.appendChild(div);
  });
});

// =========================
// ACCORDION DYNAMICS
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
// ACTIONS HANDLERS
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  joinRoom(nameInput.value.trim(), codeInput.value.trim(), pinInput.value.trim());
});

leaveBtn.addEventListener("click", () => leaveRoom(false));

changePinBtn.addEventListener("click", async () => {
  const activeUserKey = localStorage.getItem("active_user");
  if (!activeUserKey) return;
  const snap = await db.ref("onlineUsers/" + activeUserKey).get();
  if(!snap.exists()) return;
  const code = snap.val().code;

  const newPin = prompt("Enter your custom new secure PIN sequence:");
  if (!newPin || newPin.trim().length < 1) return;

  await db.ref(`customPins/${code}`).set(newPin.trim());
  toast("PIN updated safely!", "success");
});

// =========================
// ADMINISTRATIVE CONTROL LAYER
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
  const currentWeekId = getWeekIdentifier();
  
  db.ref("seats").on("value", () => {
    db.ref("blockedSeats").on("value", () => {
      db.ref(`weeklyHours/${currentWeekId}`).on("value", () => {
        db.ref("customPins").on("value", async (customPinsSnap) => {
          
          const activeOccupiedSeats = (await db.ref("seats").get()).val() || {};
          const blockedList = (await db.ref("blockedSeats").get()).val() || {};
          const weeklyData = (await db.ref(`weeklyHours/${currentWeekId}`).get()).val() || {};
          const customPins = customPinsSnap.val() || {};

          adminSeatsDashboard.innerHTML = "";

          Object.keys(SEATS).forEach((seatId) => {
            const seatConfig = SEATS[seatId];
            const liveUser = activeOccupiedSeats[seatId];
            const isBlocked = !!blockedList[seatId];
            const totalWeeklyMs = weeklyData[seatId] || 0;
            const currentActivePin = customPins[seatId] || seatConfig.pin;

            const row = document.createElement("div");
            row.style.cssText = "background:#1e293b; padding:12px; border-radius:8px; margin-bottom:8px; border:1px solid #334155;";

            let statusStr = `<span style="color:#22c55e;">🟢 Free</span>`;
            if (liveUser) statusStr = `<span style="color:#ef4444; font-weight:bold;">🔴 ${liveUser.name}</span>`;
            if (isBlocked) statusStr = `<span style="color:#94a3b8; text-decoration:line-through;">🚫 Blocked</span>`;

            row.innerHTML = `
              <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                <div><strong>Seat ${seatId}:</strong> ${statusStr}</div>
                <div style="color:#f59e0b; font-weight:bold;">PIN: ${currentActivePin}</div>
              </div>
              <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">
                ⏱️ Weekly Total: ${formatHoursMinutes(totalWeeklyMs)}
              </div>
              <div style="display:flex; gap:6px;">
                ${liveUser ? `<button onclick="remoteKickSeat('${seatId}', '${liveUser.id}')" style="background:#ef4444; font-size:11px; padding:4px 8px; width:auto; margin:0;">Kick</button>` : ""}
                <button onclick="remoteToggleBlockSeat('${seatId}', ${isBlocked})" style="background:${isBlocked ? '#22c55e' : '#f59e0b'}; font-size:11px; padding:4px 8px; width:auto; margin:0;">
                  ${isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            `;
            adminSeatsDashboard.appendChild(row);
          });
        });
      });
    });
  });
}

adminLoginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(adminEmail.value.trim(), adminPassword.value.trim());
    if (userCredential.user.uid === "trlabHsJKARs1Emga5dQEN7SfKS2") {
      isAdminAuthenticated = true;
      toast("Admin Authorized", "success");
      adminAuthBox.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      syncAdminDashboardMetrics();
    } else {
      toast("Unauthorized account context", "error");
      firebase.auth().signOut();
    }
  } catch (err) { toast(err.message, "error"); }
});

adminLogoutBtn.addEventListener("click", () => {
  firebase.auth().signOut().catch(() => {});
  isAdminAuthenticated = false;
  adminPanel.classList.add("hidden");
  if(!currentUser) formBox.classList.remove("hidden");
  toast("Admin Disconnected", "info");
});

window.remoteKickSeat = async function(seatCode, userId) {
  if(!isAdminAuthenticated) return;
  const userSnap = await db.ref("onlineUsers/" + userId).get();
  if (userSnap.exists()) {
    const sessionDuration = Date.now() - userSnap.val().start;
    const currentWeekId = getWeekIdentifier();
    await db.ref(`weeklyHours/${currentWeekId}/${seatCode}`).transaction((val) => (val || 0) + sessionDuration);
  }
  await db.ref(`seats/${seatCode}`).remove();
  await db.ref(`onlineUsers/${userId}`).remove();
  db.ref("attendance").push({ name: "Kicked User", code: seatCode, action: "kicked", time: Date.now() });
};

window.remoteToggleBlockSeat = async function(seatCode, currentBlockStatus) {
  if(!isAdminAuthenticated) return;
  if(currentBlockStatus) {
    await db.ref(`blockedSeats/${seatCode}`).remove();
  } else {
    const currentOccupantSnap = await db.ref(`seats/${seatCode}`).get();
    if(currentOccupantSnap.exists()) await remoteKickSeat(seatCode, currentOccupantSnap.val().id);
    await db.ref(`blockedSeats/${seatCode}`).set(true);
  }
};

// =========================
// AUTO SESSION RESTORATION
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
    syncPersonalWeeklyAccumulatedTime(currentUser.code);
  } else {
    localStorage.removeItem("active_user");
  }
});
