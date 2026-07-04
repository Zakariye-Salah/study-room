// ==========================================================================
// CONFIGURATION & LEGACY STANDARDS INITIALIZATION
// ==========================================================================
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

// ==========================================================================
// DOM ARCHITECTURE NODES REFERENCE
// ==========================================================================
const form = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");
const codeInput = document.getElementById("codeInput");
const pinInput = document.getElementById("pinInput");
const rememberMe = document.getElementById("rememberMe");

const formBox = document.getElementById("formBox");
const leaveBtn = document.getElementById("leaveBtn");
const changePinBtn = document.getElementById("changePinBtn");
const pinActionBox = document.getElementById("pinActionBox");
const userStatus = document.getElementById("userStatus");
const seat03AccessLink = document.getElementById("seat03AccessLink");

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

// INTERACTIVE TIMEFRAME ELEMENTS
const timeframeDropdownBtn = document.getElementById("timeframeDropdownBtn");
const timeframeChevron = document.getElementById("timeframeChevron");
const timeframeDropdownMenu = document.getElementById("timeframeDropdownMenu");
const selectedTimeframeLabel = document.getElementById("selectedTimeframeLabel");

// MODAL WINDOW INTERFACE OBJECTS
const pinModalOverlay = document.getElementById("pinModalOverlay");
const securePinUpdateForm = document.getElementById("securePinUpdateForm");
const newPinInputField = document.getElementById("newPinInputField");
const closePinModalBtn = document.getElementById("closePinModalBtn");
const cancelPinModalBtn = document.getElementById("cancelPinModalBtn");

const confirmationModalOverlay = document.getElementById("confirmationModalOverlay");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const cancelConfirmModalBtn = document.getElementById("cancelConfirmModalBtn");
const acceptConfirmModalBtn = document.getElementById("acceptConfirmModalBtn");
const closeConfirmModalBtn = document.getElementById("closeConfirmModalBtn");

// ==========================================================================
// STATE MANAGEMENT CACHE ENGINE
// ==========================================================================
let currentUser = null;
let timerInterval = null;
let liveCardsInterval = null;
let isAdminAuthenticated = false;
let localizedUserCache = {};
let currentSelectedTimeframe = localStorage.getItem("user_selected_timeframe") || "week";
let pendingConfirmationAction = null;

function toast(msg, type = "info") {
  const box = document.getElementById("toastContainer");
  if (!box) return;
  const div = document.createElement("div");
  div.className = `toast ${type}`;
  div.textContent = msg;
  box.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// ==========================================================================
// MODAL & DIALOG SYSTEMS IMPLEMENTATION LAYER
// ==========================================================================
function openConfirmationModal(title, msg, onConfirm) {
  confirmModalTitle.innerHTML = `<i class="bi bi-exclamation-triangle text-danger"></i> ${title}`;
  confirmModalMessage.textContent = msg;
  pendingConfirmationAction = onConfirm;
  confirmationModalOverlay.classList.remove("hidden");
}

function closeConfirmationModal() {
  confirmationModalOverlay.classList.add("hidden");
  pendingConfirmationAction = null;
}

[cancelConfirmModalBtn, closeConfirmModalBtn].forEach(btn => {
  btn.addEventListener("click", closeConfirmationModal);
});

acceptConfirmModalBtn.addEventListener("click", () => {
  if (typeof pendingConfirmationAction === "function") {
    pendingConfirmationAction();
  }
  closeConfirmationModal();
});

// ==========================================================================
// TIMEFRAME CALCULATOR CONTROLLERS
// ==========================================================================
function getWeekIdentifier() {
  const current = new Date();
  const shift = (current.getDay() + 1) % 7;
  const saturdayDate = new Date(current);
  saturdayDate.setDate(current.getDate() - shift);
  saturdayDate.setHours(0, 0, 0, 0);
  return `week_${saturdayDate.getFullYear()}_${saturdayDate.getMonth() + 1}_${saturdayDate.getDate()}`;
}

function getTodayIdentifier() {
  const d = new Date();
  return `day_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
}

function getMonthIdentifier() {
  const d = new Date();
  return `month_${d.getFullYear()}_${d.getMonth() + 1}`;
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

// DROPDOWN BOX TOGGLE INTERACTIVE RUNTIME
timeframeDropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = timeframeDropdownMenu.classList.contains("hidden");
  if (isHidden) {
    timeframeDropdownMenu.classList.remove("hidden");
    timeframeChevron.classList.add("chevron-rotate");
  } else {
    timeframeDropdownMenu.classList.add("hidden");
    timeframeChevron.classList.remove("chevron-rotate");
  }
});

document.addEventListener("click", () => {
  timeframeDropdownMenu.classList.add("hidden");
  timeframeChevron.classList.remove("chevron-rotate");
});

timeframeDropdownMenu.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", function() {
    currentSelectedTimeframe = this.getAttribute("data-value");
    localStorage.setItem("user_selected_timeframe", currentSelectedTimeframe);
    updateTimeframeButtonLabelText();
    if (currentUser) {
      syncPersonalAccumulatedTime(currentUser.code);
    }
  });
});

function updateTimeframeButtonLabelText() {
  let labelText = "Weekly Total:";
  let iconClass = "bi-calendar-week";
  if (currentSelectedTimeframe === "today") { labelText = "Today's Total:"; iconClass = "bi-calendar-day"; }
  if (currentSelectedTimeframe === "month") { labelText = "Monthly Total:"; iconClass = "bi-calendar-month"; }
  if (currentSelectedTimeframe === "all") { labelText = "All-Time Total:"; iconClass = "bi-infinity"; }
  selectedTimeframeLabel.innerHTML = `<i class="bi ${iconClass}"></i> Your ${labelText}`;
}

// ==========================================================================
// OPERATIONS LOGIC & TIMERS
// ==========================================================================
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!currentUser) return;
    const currentSessionMs = Date.now() - currentUser.start;
    timerBox.innerText = formatLiveSeconds(currentSessionMs);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerBox.innerText = "0m 0s";
  personalWeeklyBox.classList.add("hidden");
}

async function syncPersonalAccumulatedTime(seatCode) {
  let path = `weeklyHours/${getWeekIdentifier()}/${seatCode}`;
  if (currentSelectedTimeframe === "today") path = `dailyHours/${getTodayIdentifier()}/${seatCode}`;
  if (currentSelectedTimeframe === "month") path = `monthlyHours/${getMonthIdentifier()}/${seatCode}`;
  if (currentSelectedTimeframe === "all") path = `allTimeHours/${seatCode}`;

  db.ref(path).off(); 
  db.ref(path).on("value", async (snap) => {
    let historicalMs = snap.val() || 0;
    
    // LOGICAL ASSURANCE ENGINE: If user is actively logged in, add their live counter
    if (currentUser && currentUser.code === seatCode) {
      historicalMs += (Date.now() - currentUser.start);
    }
    
    weeklyMinutesVal.innerText = formatHoursMinutes(historicalMs);
    personalWeeklyBox.classList.remove("hidden");
  });
}

function setStatusText(joined, seat = "") {
  if (joined) {
    userStatus.innerHTML = `<i class="bi bi-check-circle-fill"></i> Joined (Seat ${seat})`;
    userStatus.className = "status-badge active";
    seat03AccessLink.classList.remove("hidden"); 
  } else {
    userStatus.innerHTML = `<i class="bi bi-dash-circle"></i> Not joined`;
    userStatus.className = "status-badge";
    seat03AccessLink.classList.add("hidden");
  }
}

// ==========================================================================
// CORE TRANSACTIONS & SECURE FORM VALIDATIONS
// ==========================================================================
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
    localStorage.setItem("user_selected_timeframe", currentSelectedTimeframe);
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
  syncPersonalAccumulatedTime(normalizedCode);
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

  // Securely update structural session tracking dimensions across paths
  await db.ref(`weeklyHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
  await db.ref(`dailyHours/${getTodayIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
  await db.ref(`monthlyHours/${getMonthIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
  await db.ref(`allTimeHours/${code}`).transaction(v => (v || 0) + sessionDuration);

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

// ==========================================================================
// SECURE MODAL INTERACTION CONFIGURATION FOR PIN PASSCODE CHANGES
// ==========================================================================
changePinBtn.addEventListener("click", () => {
  newPinInputField.value = "";
  pinModalOverlay.classList.remove("hidden");
});

function closePinModal() {
  pinModalOverlay.classList.add("hidden");
}

[closePinModalBtn, cancelPinModalBtn].forEach(btn => {
  btn.addEventListener("click", closePinModal);
});

securePinUpdateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const activeUserKey = localStorage.getItem("active_user");
  if (!activeUserKey) return;
  
  const snap = await db.ref("onlineUsers/" + activeUserKey).get();
  if (!snap.exists()) return;
  const code = snap.val().code;
  const verifiedNewPin = newPinInputField.value.trim();

  await db.ref(`customPins/${code}`).set(verifiedNewPin);
  
  if (localStorage.getItem("remember_checked") === "true") {
    localStorage.setItem("remembered_pin", verifiedNewPin);
  }

  toast("PIN passcode updated safely!", "success");
  closePinModal();
});

// ==========================================================================
// REALTIME UI RENDERING CONTROLLERS
// ==========================================================================
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
        <span class="name"><i class="bi bi-person-workspace"></i> ${u.name}</span>
        <span class="live-elapsed-badge"><i class="bi bi-clock-history"></i> ${formatHoursMinutes(elapsedMs)}</span>
      </div>
      <span class="code"><i class="bi bi-pin-angle"></i> Seat ${u.code}</span>
    `;
    usersList.appendChild(div);
  });
}

// Update runtime counters smoothly every minute
clearInterval(liveCardsInterval);
liveCardsInterval = setInterval(() => {
  document.querySelectorAll(".user-card").forEach((card) => {
    const startStamp = parseInt(card.getAttribute("data-start"), 10);
    if (startStamp) {
      const badge = card.querySelector(".live-elapsed-badge");
      if (badge) badge.innerHTML = `<i class="bi bi-clock-history"></i> ${formatHoursMinutes(Date.now() - startStamp)}`;
    }
  });
  // Also keep dropdown stats synced live while logged in
  if (currentUser) {
    syncPersonalAccumulatedTime(currentUser.code);
  }
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
    const iconType = d.action === "join" ? "bi-box-arrow-in-right" : "bi-box-arrow-left";
    
    div.innerHTML = `<strong>${d.name}</strong> (Seat ${d.code}) - <span style="color: ${labelColor}; font-weight:700;"><i class="bi ${iconType}"></i> ${d.action}</span> - <span style="font-size:11px; color:#94a3b8;">${new Date(d.time).toLocaleTimeString()}</span>`;
    attendanceList.appendChild(div);
  });
});

// ACCORDION BOX HANDLING
attendanceHeaderBtn.addEventListener("click", () => {
  const isHidden = attendanceContent.classList.contains("hidden");
  if (isHidden) {
    attendanceContent.classList.remove("hidden");
    attendanceChevron.classList.add("rotate-180");
  } else {
    attendanceContent.classList.add("hidden");
    attendanceChevron.classList.remove("rotate-180");
  }
});

// ==========================================================================
// CLICK ACTION EVENT CAPTURING HANDLERS
// ==========================================================================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  joinRoom(nameInput.value.trim(), codeInput.value.trim(), pinInput.value.trim());
});

leaveBtn.addEventListener("click", () => {
  openConfirmationModal(
    "Confirm Workspace Exit",
    "Are you sure you want to end your current session and exit this study room?",
    () => { leaveRoom(false); }
  );
});

// ==========================================================================
// ADMINISTRATIVE PRIVILEGE CONTROL OVERLAYS
// ==========================================================================
adminToggleBtn.addEventListener("click", () => {
  adminAuthBox.classList.remove("hidden");
  formBox.classList.add("hidden");
});

adminCancelBtn.addEventListener("click", () => {
  adminAuthBox.classList.add("hidden");
  if (!currentUser) formBox.classList.remove("hidden");
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
            row.style.cssText = "background:var(--bg-surface-elevated); padding:12px; border-radius:8px; margin-bottom:8px; border:1px solid var(--border-color);";

            let statusStr = `<span style="color:#22c55e;">🟢 Free</span>`;
            if (liveUser) statusStr = `<span style="color:#ef4444; font-weight:bold;">🔴 ${liveUser.name}</span>`;
            if (isBlocked) statusStr = `<span style="color:#94a3b8; text-decoration:line-through;">🚫 Blocked</span>`;

            row.innerHTML = `
              <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                <div><strong>Seat ${seatId}:</strong> statusStr</div>
                <div style="color:#ea580c; font-weight:bold;"><i class="bi bi-shield-lock"></i> PIN: ${currentActivePin}</div>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">
                <i class="bi bi-clock"></i> Weekly Total: ${formatHoursMinutes(totalWeeklyMs)}
              </div>
              <div style="display:flex; gap:6px;">
                ${liveUser ? `<button onclick="remoteKickSeat('${seatId}', '${liveUser.id}')" class='action-btn danger-btn' style='padding:4px 8px; font-size:11px; width:auto;'><i class="bi bi-person-x"></i> Kick</button>` : ""}
                <button onclick="remoteToggleBlockSeat('${seatId}', ${isBlocked})" class='action-btn' style='padding:4px 8px; font-size:11px; width:auto; background:${isBlocked ? '#22c55e' : '#ea580c'}; color:#fff;'>
                  ${isBlocked ? '<i class="bi bi-unlock"></i> Unblock' : '<i class="bi bi-slash-circle"></i> Block'}
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
      toast("Admin Authorized Successfully", "success");
      adminAuthBox.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      syncAdminDashboardMetrics();
    } else {
      toast("Unauthorized account context profile detected.", "error");
      firebase.auth().signOut();
    }
  } catch (err) { toast(err.message, "error"); }
});

adminLogoutBtn.addEventListener("click", () => {
  openConfirmationModal(
    "Disconnect Admin Dashboard",
    "Are you sure you want to completely log out of the admin console dashboard?",
    () => {
      firebase.auth().signOut().catch(() => {});
      isAdminAuthenticated = false;
      adminPanel.classList.add("hidden");
      if (!currentUser) formBox.classList.remove("hidden");
      toast("Admin Disconnected Safely", "info");
    }
  );
});

window.remoteKickSeat = async function(seatCode, userId) {
  if (!isAdminAuthenticated) return;
  openConfirmationModal(
    "Force Seat Removal",
    `Are you sure you want to disconnect user session on Seat ${seatCode}?`,
    async () => {
      const userSnap = await db.ref("onlineUsers/" + userId).get();
      if (userSnap.exists()) {
        const sessionDuration = Date.now() - userSnap.val().start;
        await db.ref(`weeklyHours/${getWeekIdentifier()}/${seatCode}`).transaction((val) => (val || 0) + sessionDuration);
        await db.ref(`dailyHours/${getTodayIdentifier()}/${seatCode}`).transaction((val) => (val || 0) + sessionDuration);
        await db.ref(`monthlyHours/${getMonthIdentifier()}/${seatCode}`).transaction((val) => (val || 0) + sessionDuration);
        await db.ref(`allTimeHours/${seatCode}`).transaction((val) => (val || 0) + sessionDuration);
      }
      await db.ref(`seats/${seatCode}`).remove();
      await db.ref(`onlineUsers/${userId}`).remove();
      db.ref("attendance").push({ name: "Kicked User", code: seatCode, action: "kicked", time: Date.now() });
      toast("User terminated by administrative command", "info");
    }
  );
};

window.remoteToggleBlockSeat = async function(seatCode, currentBlockStatus) {
  if (!isAdminAuthenticated) return;
  if (currentBlockStatus) {
    await db.ref(`blockedSeats/${seatCode}`).remove();
    toast(`Seat ${seatCode} unblocked`, "success");
  } else {
    const currentOccupantSnap = await db.ref(`seats/${seatCode}`).get();
    if (currentOccupantSnap.exists()) {
      toast("Cannot block an occupied seat. Kick the student first.", "error");
      return;
    }
    await db.ref(`blockedSeats/${seatCode}`).set(true);
    toast(`Seat ${seatCode} blocked explicitly`, "warning");
  }
};

// ==========================================================================
// LIGHT/DARK MODE CONTROLLERS
// ==========================================================================
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

// ==========================================================================
// AUTO-PERSISTENT APPLICATION STATE LOADING ENGINES
// ==========================================================================
window.addEventListener("DOMContentLoaded", async () => {
  initializeThemeSystem();
  updateTimeframeButtonLabelText();

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
    syncPersonalAccumulatedTime(currentUser.code);
  } else {
    localStorage.removeItem("active_user");
  }
});
