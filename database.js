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

// SESSION LIMITS & AUTO-KICK CONFIGURATION
const SESSION_LIMIT = 3.5 * 60 * 60 * 1000; 
let autoRemovalTimeoutInstance = null;
let courseTimerIntervalInstance = null;

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
const pinActionBox = document.getElementById("pinActionBox");
const userStatus = document.getElementById("userStatus");
const seat03AccessLink = document.getElementById("seat03AccessLink");
const courseActiveOccupantSublabel = document.getElementById("courseActiveOccupantSublabel");

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

const timeframeDropdownBtn = document.getElementById("timeframeDropdownBtn");
const timeframeChevron = document.getElementById("timeframeChevron");
const timeframeDropdownMenu = document.getElementById("timeframeDropdownMenu");
const selectedTimeframeLabel = document.getElementById("selectedTimeframeLabel");

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

const btnTriggerEnterCourseEmbed = document.getElementById("btnTriggerEnterCourseEmbed");

const headerNotificationBellBtn = document.getElementById("headerNotificationBellBtn");
const bellUnreadCounterBadge = document.getElementById("bellUnreadCounterBadge");
const bellNotificationsDropdownPanel = document.getElementById("bellNotificationsDropdownPanel");
const bellMessagesListContainer = document.getElementById("bellMessagesListContainer");
const btnLoadAllMessagesView = document.getElementById("btnLoadAllMessagesView");
const btnToggleAdminComposer = document.getElementById("btnToggleAdminComposer");
const adminMessageComposerArea = document.getElementById("adminMessageComposerArea");
const adminMsgTitleInput = document.getElementById("adminMsgTitleInput");
const adminMsgBodyInput = document.getElementById("adminMsgBodyInput");
const btnAdminBroadcastSubmit = document.getElementById("btnAdminBroadcastSubmit");

const quickStudentMessageModal = document.getElementById("quickStudentMessageModal");
const btnCloseMessageModal = document.getElementById("btnCloseMessageModal");
const btnCancelMessageModal = document.getElementById("btnCancelMessageModal");
const btnSubmitQuickStudentMessage = document.getElementById("btnSubmitQuickStudentMessage");
const lblRemainingMsgBudgetCounter = document.getElementById("lblRemainingMsgBudgetCounter");
let selectedQuickMessageText = "";

const mobileStudyRecapBtn = document.getElementById("mobileStudyRecapBtn");
const studyRecapModalOverlay = document.getElementById("studyRecapModalOverlay");
const closeRecapModalBtn = document.getElementById("closeRecapModalBtn");
const adminAddLessonTriggerBtn = document.getElementById("adminAddLessonTriggerBtn");
const adminLessonComposerArea = document.getElementById("adminLessonComposerArea");
const lessonTitleInput = document.getElementById("lessonTitleInput");
const lessonFilterSelect = document.getElementById("lessonFilterSelect");
const lessonStatusSelect = document.getElementById("lessonStatusSelect");
const lessonCountLimitSelect = document.getElementById("lessonCountLimitSelect");
const btnCancelLessonFormSubmit = document.getElementById("btnCancelLessonFormSubmit");
const btnSaveLessonDetailsData = document.getElementById("btnSaveLessonDetailsData");
const recapLessonsRenderView = document.getElementById("recapLessonsRenderView");
const lessonInfoBreakdownBox = document.getElementById("lessonInfoBreakdownBox");
const lblSelectedInfoLessonName = document.getElementById("lblSelectedInfoLessonName");
const lessonUsersRatingBreakdownList = document.getElementById("lessonUsersRatingBreakdownList");
const btnCloseInfoPaneTrigger = document.getElementById("btnCloseInfoPaneTrigger");
const lessonComposerTitle = document.getElementById("lessonComposerTitle");

const premiumUserCard = document.getElementById("premiumUserCard");
const lblPremiumUserName = document.getElementById("lblPremiumUserName");
const lblPremiumUserSeat = document.getElementById("lblPremiumUserSeat");

// ==========================================================================
// STATE MANAGEMENT ENGINE
// ==========================================================================
let currentUser = null;
let timerInterval = null;
let liveCardsInterval = null;
let isAdminAuthenticated = false;
let localizedUserCache = {};
let currentSelectedTimeframe = localStorage.getItem("user_selected_timeframe") || "week";
let pendingConfirmationAction = null;
let activeMessageTargetUser = null;
let showAllMessagesFlag = false;
let activeBroadcastsRef = null;

let activeRecapFilter = localStorage.getItem("recaps_active_language") || "html";
let targetEditLessonId = null;

const MOTIVATION_QUOTES = [
  "Errors and bugs are validation evidence that you are stretching operational capability boundaries. ⚙️",
  "Focus determines reality — Let us make every single block execution scale gracefully! 🎯",
  "Consistency beats talent explicitly every single day. Keep typing and iterating! 💻",
  "Small calculated steps layer incrementally into massive engineering production applications. 🚀",
  "Your systematic persistence today molds the high-tier full-stack developer you become tomorrow. 👑"
];
let typingTimerInstance = null;
let phraseRotationIntervalInstance = null;

// ==========================================================================
// TOAST NOTIFICATIONS DISPATCH
// ==========================================================================
function toast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  
  const div = document.createElement("div");
  div.className = `toast ${type}`;
  
  let iconHtml = '<i class="bi bi-info-circle-fill"></i>';
  if (type === "success") iconHtml = '<i class="bi bi-check-circle-fill"></i>';
  if (type === "error") iconHtml = '<i class="bi bi-exclamation-triangle-fill"></i>';
  if (type === "warning") iconHtml = '<i class="bi bi-exclamation-circle-fill"></i>';
  if (type === "danger-alert-occupied") iconHtml = '<i class="bi bi-shield-lock-fill"></i>';
  
  div.innerHTML = `${iconHtml}<span>${msg}</span>`;
  container.appendChild(div);
  
  setTimeout(() => div.classList.add("show"), 50);
  setTimeout(() => {
    div.classList.remove("show");
    setTimeout(() => div.remove(), 400);
  }, 4000);
}

// ==========================================================================
// FORM FIELD VISIBILITY TOGGLE (EYE CONTROL)
// ==========================================================================
function setupPasswordFieldToggleDriver(triggerIconId, targetInputFieldId) {
  const icon = document.getElementById(triggerIconId);
  const field = document.getElementById(targetInputFieldId);
  if (!icon || !field) return;
  
  icon.addEventListener("click", () => {
    if (field.type === "password") {
      field.type = "text";
      icon.className = "bi bi-eye-slash password-toggle-icon";
    } else {
      field.type = "password";
      icon.className = "bi bi-eye password-toggle-icon";
    }
  });
}
setupPasswordFieldToggleDriver("togglePinEye", "pinInput");
setupPasswordFieldToggleDriver("toggleAdminEye", "adminPassword");
setupPasswordFieldToggleDriver("toggleNewPinEye", "newPinInputField");

// ==========================================================================
// MODAL & DIALOG SYSTEMS
// ==========================================================================
function openConfirmationModal(title, msg, onConfirm, onCancel = null) {
  confirmModalTitle.innerHTML = `<i class="bi bi-exclamation-triangle text-danger"></i> ${title}`;
  confirmModalMessage.textContent = msg;
  pendingConfirmationAction = onConfirm;
  confirmationModalOverlay.classList.remove("hidden");
  
  cancelConfirmModalBtn.onclick = () => {
    if (typeof onCancel === "function") onCancel();
    closeConfirmationModal();
  };
  closeConfirmModalBtn.onclick = () => {
    if (typeof onCancel === "function") onCancel();
    closeConfirmationModal();
  };
}

function closeConfirmationModal() {
  confirmationModalOverlay.classList.add("hidden");
  pendingConfirmationAction = null;
}

acceptConfirmModalBtn.addEventListener("click", () => {
  if (typeof pendingConfirmationAction === "function") {
    pendingConfirmationAction();
  }
  closeConfirmationModal();
});

// ==========================================================================
// TIMEFRAME CALCULATORS
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

document.addEventListener("click", (e) => {
  if (!timeframeDropdownBtn.contains(e.target)) {
    timeframeDropdownMenu.classList.add("hidden");
    timeframeChevron.classList.remove("chevron-rotate");
  }
  if (!headerNotificationBellBtn.contains(e.target) && !bellNotificationsDropdownPanel.contains(e.target) && !quickStudentMessageModal.contains(e.target)) {
    bellNotificationsDropdownPanel.classList.add("hidden");
  }
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

// ==========================================================================
// SESSION MANAGEMENT TIMERS
// ==========================================================================
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!currentUser) return;
    const currentSessionMs = Date.now() - currentUser.start;
    timerBox.innerText = formatLiveSeconds(currentSessionMs);
  }, 1000);
}

// ==========================================================================
// RESET INDIVIDUAL SEAT CUSTOM PIN FUNCTION (ADMIN ACTION)
// ==========================================================================
window.resetUserSecurityPin = function(seatCode) {
  if (!isAdminAuthenticated) return;
  openConfirmationModal(
    "Reset Security Code PIN", 
    `Are you sure you want to restore Seat ${seatCode} back to its system default pin configuration standard?`,
    async () => {
      await db.ref(`customPins/${seatCode}`).remove();
      toast(`Security standard reset successful for seat code workspace entry slot: ${seatCode}`, "success");
    }
  );
};

function stopTimer() {
  clearInterval(timerInterval);
  clearTimeout(autoRemovalTimeoutInstance);
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
    if (currentUser && currentUser.code === seatCode) {
      historicalMs += (Date.now() - currentUser.start);
    }
    weeklyMinutesVal.innerText = formatHoursMinutes(historicalMs);
    personalWeeklyBox.classList.remove("hidden");
  });
}

function setStatusText(joined, seat = "", name = "") {
  if (joined) {
    userStatus.innerHTML = `<i class="bi bi-check-circle-fill"></i> Joined`;
    userStatus.className = "status-badge active";
    seat03AccessLink.classList.remove("hidden"); 
    
    lblPremiumUserName.innerText = name;
    lblPremiumUserSeat.innerText = `Seat Assignment: ${seat}`;
    premiumUserCard.classList.remove("hidden");
    
    initiateDynamicPremiumRotator(name);
  } else {
    userStatus.innerHTML = `<i class="bi bi-dash-circle"></i> Not joined`;
    userStatus.className = "status-badge";
    seat03AccessLink.classList.add("hidden");
    premiumUserCard.classList.add("hidden");
    initiateDynamicPremiumRotator("Guest");
  }
}

// ==========================================================================
// DYNAMIC MOTIVATION STRING ROTATION LOGIC (WITH REQUISITE SPACING & HIGHLIGHTS)
// ==========================================================================
function initiateDynamicPremiumRotator(username = "Guest") {
  clearInterval(phraseRotationIntervalInstance);
  renderRotatorTextFrame(username);
  phraseRotationIntervalInstance = setInterval(() => {
    renderRotatorTextFrame(username);
  }, 7000);
}

function renderRotatorTextFrame(username) {
  const element = document.getElementById("motivationText");
  if (!element) return;
  
  clearInterval(typingTimerInstance);
  
  let targetPhrase = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
  let completeHTMLString = "";

  if (username !== "Guest") {
    const greetingPool = [
      `👋 Welcome Back, Master Architect <span class="motivation-highlight-name">${username}</span> ! &nbsp;&nbsp;&nbsp; `,
      `⚡ Engineering Console Active: <span class="motivation-highlight-name">${username}</span> — &nbsp;&nbsp;&nbsp; `,
      `🚀 Space Deck Engaged for <span class="motivation-highlight-name">${username}</span> : &nbsp;&nbsp;&nbsp; `,
      `💎 Premium Access Active ( <span class="motivation-highlight-name">${username}</span> ) -> &nbsp;&nbsp;&nbsp; `,
      `🔥 Core Compile Initiated By <span class="motivation-highlight-name">${username}</span> — &nbsp;&nbsp;&nbsp; `
    ];
    completeHTMLString = greetingPool[Math.floor(Math.random() * greetingPool.length)] + targetPhrase;
  } else {
    completeHTMLString = targetPhrase;
  }
  
  element.innerHTML = "";
  let cursorIndex = 0;
  let isTagContext = false;
  let runningBuffer = "";

  typingTimerInstance = setInterval(() => {
    if (cursorIndex < completeHTMLString.length) {
      let char = completeHTMLString.charAt(cursorIndex);
      
      if (char === '<') {
        isTagContext = true;
      }
      
      if (isTagContext) {
        runningBuffer += char;
        if (char === '>') {
          isTagContext = false;
          element.innerHTML += runningBuffer;
          runningBuffer = "";
        }
      } else {
        if (char === '&' && completeHTMLString.substr(cursorIndex, 6) === '&nbsp;') {
          element.innerHTML += '&nbsp;';
          cursorIndex += 5;
        } else {
          element.innerHTML += char;
        }
      }
      cursorIndex++;
    } else {
      clearInterval(typingTimerInstance);
    }
  }, 20);
}

// ==========================================================================
// CORE SEAT TRANSACTIONS & CLEAN CLOSED TAB PROTECTION
// ==========================================================================
async function joinRoom(name, code, pin) {
  const normalizedCode = code.trim();
  const targetSeat = SEATS[normalizedCode];

  if (!targetSeat) {
    toast("Invalid space seat configuration assignment.", "error");
    return;
  }

  const blockSnap = await db.ref(`blockedSeats/${normalizedCode}`).get();
  if (blockSnap.val() === true) {
    toast("This workspace seat node is currently locked by admin command.", "error");
    return;
  }

  let correctPin = targetSeat.pin;
  const customPinSnap = await db.ref(`customPins/${normalizedCode}`).get();
  if (customPinSnap.exists()) correctPin = customPinSnap.val();

  if (correctPin.trim() !== pin.trim()) {
    toast("Invalid credentials code access PIN.", "error");
    return;
  }
  
  if (targetSeat.name.toLowerCase() !== name.trim().toLowerCase()) {
    toast("Assigned identity parameters mismatch.", "error");
    return;
  }

  const seatRef = db.ref("seats/" + normalizedCode);
  const snap = await seatRef.get();
  if (snap.exists()) {
    toast("Resource collision: Seat node is already occupied.", "error");
    return;
  }

  const userId = "u_" + Math.random().toString(36).slice(2);
  currentUser = {
    id: userId,
    name: targetSeat.name,
    code: normalizedCode,
    start: Date.now(),
    inCourse: false,
    courseEnteredAt: 0,
    activeCourseName: ""
  };

  if (rememberMe.checked) {
    localStorage.setItem("remembered_name", name);
    localStorage.setItem("remembered_code", normalizedCode);
    localStorage.setItem("remembered_pin", pin);
    localStorage.setItem("remember_checked", "true");
  } else {
    const cachedThemePreference = localStorage.getItem("app_theme");
    localStorage.clear();
    if(cachedThemePreference) localStorage.setItem("app_theme", cachedThemePreference);
    localStorage.setItem("user_selected_timeframe", currentSelectedTimeframe);
    localStorage.setItem("recaps_active_language", activeRecapFilter);
  }

  seatRef.onDisconnect().remove(); 
  db.ref("onlineUsers/" + userId).onDisconnect().remove(); 
  
  const attendanceDisconnectRef = db.ref("attendance").push();
  attendanceDisconnectRef.onDisconnect().set({
    name: targetSeat.name,
    code: normalizedCode,
    action: "leave (closed window)",
    time: firebase.database.ServerValue.TIMESTAMP
  });

  await seatRef.set(currentUser);
  await db.ref("onlineUsers/" + userId).set(currentUser);

  db.ref("attendance").push({
    name: targetSeat.name,
    code: normalizedCode,
    action: "join",
    time: Date.now()
  });

  toast(`Identity verified! Welcome ${targetSeat.name}`, "success");
  formBox.classList.add("hidden");
  pinActionBox.classList.remove("hidden");
  setStatusText(true, normalizedCode, targetSeat.name);

  startTimer();
  syncPersonalAccumulatedTime(normalizedCode);
  localStorage.setItem("active_user", userId);
  listenToActiveKicks(userId);
  renderLessonsUI();

  clearTimeout(autoRemovalTimeoutInstance);
  autoRemovalTimeoutInstance = setTimeout(() => {
    leaveRoom(true); 
  }, SESSION_LIMIT);
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
  pinActionBox.classList.add("hidden");
  setStatusText(false);

  db.ref("seats/" + code).onDisconnect().cancel();
  db.ref("onlineUsers/" + id).onDisconnect().cancel();
  db.ref("attendance").onDisconnect().cancel();

  await db.ref(`weeklyHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
  await db.ref(`dailyHours/${getTodayIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
  await db.ref(`monthlyHours/${getMonthIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
  await db.ref(`allTimeHours/${code}`).transaction(v => (v || 0) + sessionDuration);

  await db.ref("seats/" + code).remove();
  await db.ref("onlineUsers/" + id).remove();

  db.ref("attendance").push({
    name: name,
    code: code,
    action: auto ? "expired time" : "leave",
    time: Date.now()
  });

  toast(auto ? "Session runtime quota spent. Disconnected automatically." : "Workspace link destroyed successfully.", "info");
  localStorage.removeItem("active_user");
  renderLessonsUI();
}

function listenToActiveKicks(userId) {
  db.ref("onlineUsers/" + userId).on("value", (snap) => {
    if (!snap.exists() && currentUser) {
      leaveRoom(true);
    }
  });
}

// ==========================================================================
// COURSE ACCESSIBILITY CONTEXT ENGINE
// ==========================================================================
async function openCourseEmbedWindow() {
  if (!currentUser) return;
  
  const snap = await db.ref("onlineUsers").get();
  let currentOccupantName = "";
  let currentOccupantSeat = "";
  let courseOccupied = false;
  
  if (snap.exists()) {
    Object.values(snap.val()).forEach(u => {
      if (u.inCourse && u.id !== currentUser.id) {
        courseOccupied = true;
        currentOccupantName = u.name;
        currentOccupantSeat = u.code;
      }
    });
  }

  if (courseOccupied) {
    toast(`CRITICAL RISK ACCESS ERROR: Course resource currently claimed by ${currentOccupantName} (Seat ${currentOccupantSeat})!`, "danger-alert-occupied");
    triggerTitleDangerAlert("🚨 DANGER ALERT", "⚠️ WORKSPACE COLLISION");
    return;
  }

  currentUser.inCourse = true;
  currentUser.activeCourseName = "Full Stack AI Engineer";
  currentUser.courseEnteredAt = Date.now();
  
  await db.ref("onlineUsers/" + currentUser.id).update({
    inCourse: true,
    activeCourseName: "Full Stack AI Engineer",
    courseEnteredAt: currentUser.courseEnteredAt
  });
  
  await db.ref("seats/" + currentUser.code).update({
    inCourse: true,
    activeCourseName: "Full Stack AI Engineer",
    courseEnteredAt: currentUser.courseEnteredAt
  });
  
  window.open("https://dugsiiye.com/dashboard/student", "_blank");
}

function triggerTitleDangerAlert(buyerText, vendorText) {
  const originalTitle = "Study Room Pro - Secure Learning System";
  let elapsedCount = 0;
  
  const flashTimer = setInterval(() => {
    document.title = (elapsedCount % 2 === 0) ? buyerText : vendorText;
    elapsedCount++;
    if (elapsedCount >= 6) { 
      clearInterval(flashTimer);
      document.title = originalTitle;
    }
  }, 500);
}

btnTriggerEnterCourseEmbed.addEventListener("click", openCourseEmbedWindow);

// ==========================================================================
// BROADCAST PANEL CONTROLLER
// ==========================================================================
headerNotificationBellBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = bellNotificationsDropdownPanel.classList.contains("hidden");
  if (isHidden) {
    bellNotificationsDropdownPanel.classList.remove("hidden");
    db.ref("bellUnreadCounts/" + (currentUser ? currentUser.id : "guest")).set(0);
    bellUnreadCounterBadge.classList.add("hidden");
  } else {
    bellNotificationsDropdownPanel.classList.add("hidden");
  }
});

btnToggleAdminComposer.addEventListener("click", (e) => {
  e.stopPropagation(); 
  adminMessageComposerArea.classList.toggle("expanded");
  const isExpanded = adminMessageComposerArea.classList.contains("expanded");
  btnToggleAdminComposer.innerHTML = isExpanded ? `<i class="bi bi-dash-circle"></i>` : `<i class="bi bi-plus-circle"></i>`;
});

function listenToGlobalBroadcastAlerts() {
  const idKey = currentUser ? currentUser.id : "guest";
  
  db.ref("bellUnreadCounts/" + idKey).on("value", (snap) => {
    const counts = snap.val() || 0;
    if (counts > 0) {
      bellUnreadCounterBadge.innerText = counts;
      bellUnreadCounterBadge.classList.remove("hidden");
    } else {
      bellUnreadCounterBadge.classList.add("hidden");
    }
  });

  if (activeBroadcastsRef) activeBroadcastsRef.off();
  
  activeBroadcastsRef = db.ref("broadcastAlerts").orderByChild("timestamp");
  activeBroadcastsRef.on("value", (snap) => {
    bellMessagesListContainer.innerHTML = "";
    const data = snap.val() || {};
    
    let entries = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).reverse();
    
    if (!showAllMessagesFlag) {
      entries = entries.slice(0, 5); 
    }

    if (entries.length === 0) {
      bellMessagesListContainer.innerHTML = `<div class="empty-bell-fallback">No notifications found.</div>`;
      return;
    }

    entries.forEach(m => {
      const isOwnMessage = currentUser && currentUser.code === m.seatCode;
      const isMsgFromAdmin = m.seatCode === "Admin";
      
      let cardClass = "bell-msg-item";
      if (isMsgFromAdmin) cardClass += " warning-border";
      else cardClass += " student-broadcast";
      
      let actionButtons = `<div class="bell-msg-actions">`;
      if (isAdminAuthenticated) {
        if (isMsgFromAdmin) {
          actionButtons += `<a href="javascript:void(0)" onclick="editMessage(event, '${m.id}', '${escapeHtml(m.title)}', '${escapeHtml(m.body)}')" class="text-warning" title="Edit"><i class="bi bi-pencil-square"></i></a>`;
        }
        actionButtons += `<a href="javascript:void(0)" onclick="deleteMessage(event, '${m.id}')" class="text-danger" style="color:var(--color-danger) !important;" title="Delete"><i class="bi bi-trash"></i></a>`;
      } else if (isOwnMessage) {
        actionButtons += `<a href="javascript:void(0)" onclick="deleteMessage(event, '${m.id}')" class="text-danger" style="color:var(--color-danger) !important;" title="Delete"><i class="bi bi-trash"></i></a>`;
      }
      actionButtons += `</div>`;

      const card = document.createElement("div");
      card.className = cardClass;
      card.innerHTML = `
        <div class="bell-msg-meta">
          <div>
            <span class="bell-msg-sender"><i class="bi bi-hash"></i> ${m.seatCode === 'Admin' ? 'Admin' : 'Seat ' + m.seatCode}</span>
            <span class="bell-msg-time" style="margin-left:8px;">${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          ${actionButtons}
        </div>
        <h4 class="bell-msg-title" id="title-${m.id}">${escapeHtml(m.title)}</h4>
        <p class="bell-msg-body" id="body-${m.id}">${escapeHtml(m.body)}</p>
      `;
      bellMessagesListContainer.appendChild(card);
    });
  });
}

window.deleteMessage = function(e, messageId) {
  if (e) e.stopPropagation();
  openConfirmationModal(
    "Delete Alert Message",
    "Are you sure you want to completely delete this message broadcast alert?",
    async () => {
      await db.ref("broadcastAlerts/" + messageId).remove();
      toast("Message deleted successfully!", "success");
    }
  );
};

window.editMessage = function(e, messageId, currentTitle, currentBody) {
  if (e) e.stopPropagation();
  if (!isAdminAuthenticated) return;
  adminMsgTitleInput.value = currentTitle;
  adminMsgBodyInput.value = currentBody;
  
  if (!adminMessageComposerArea.classList.contains("expanded")) {
    adminMessageComposerArea.classList.add("expanded");
    btnToggleAdminComposer.innerHTML = `<i class="bi bi-dash-circle"></i>`;
  }
  
  btnAdminBroadcastSubmit.onclick = async (evt) => {
    if (evt) evt.stopPropagation();
    const updatedTitle = adminMsgTitleInput.value.trim();
    const updatedBody = adminMsgBodyInput.value.trim();
    
    if (!updatedTitle || !updatedBody) {
      toast("Please complete all message entry spaces first", "error");
      return;
    }

    await db.ref("broadcastAlerts/" + messageId).update({
      title: updatedTitle,
      body: updatedBody,
      timestamp: Date.now()
    });

    adminMsgTitleInput.value = "";
    adminMsgBodyInput.value = "";
    toast("Broadcast alert updated successfully!", "success");
  };
};

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

btnLoadAllMessagesView.addEventListener("click", (e) => {
  e.stopPropagation();
  showAllMessagesFlag = !showAllMessagesFlag;
  btnLoadAllMessagesView.innerText = showAllMessagesFlag ? "Show Less" : "View All";
  listenToGlobalBroadcastAlerts();
});

btnAdminBroadcastSubmit.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (!isAdminAuthenticated) return;
  const title = adminMsgTitleInput.value.trim();
  const body = adminMsgBodyInput.value.trim();

  if (!title || !body) {
    toast("Please enter both alert title and details", "error");
    return;
  }

  const alertPayload = {
    title: title,
    body: body,
    seatCode: "Admin",
    timestamp: Date.now()
  };

  await db.ref("broadcastAlerts").push(alertPayload);
  
  const usersSnap = await db.ref("onlineUsers").get();
  if (usersSnap.exists()) {
    Object.keys(usersSnap.val()).forEach(uid => {
      db.ref("bellUnreadCounts/" + uid).transaction(c => (c || 0) + 1);
    });
  }
  db.ref("bellUnreadCounts/guest").transaction(c => (c || 0) + 1);

  adminMsgTitleInput.value = "";
  adminMsgBodyInput.value = "";
  toast("Broadcast alert transmitted successfully!", "success");
});

// ==========================================================================
// SELECTION POPUP MESSAGING DRIVERS
// ==========================================================================
window.openQuickMessagingModal = async function(targetUserId, targetSeatCode) {
  if (!currentUser) {
    toast("You must claim a space seat to interact.", "error");
    return;
  }
  
  activeMessageTargetUser = { id: targetUserId, seat: targetSeatCode };
  
  const todayId = getTodayIdentifier();
  const budgetSnap = await db.ref(`messageBudgets/${todayId}/${currentUser.id}`).get();
  const currentUsed = budgetSnap.val() || 0;
  const remaining = Math.max(0, 3 - currentUsed);

  lblRemainingMsgBudgetCounter.innerText = remaining;
  selectedQuickMessageText = "";
  
  document.querySelectorAll(".template-msg-pill").forEach(p => p.style.border = "1px solid var(--border-color)");
  
  quickStudentMessageModal.classList.remove("hidden");
};

function closeQuickMessagingModalWindow() {
  quickStudentMessageModal.classList.add("hidden");
  activeMessageTargetUser = null;
}

[btnCloseMessageModal, btnCancelMessageModal].forEach(b => b.addEventListener("click", closeQuickMessagingModalWindow));

document.querySelectorAll(".template-msg-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    selectedQuickMessageText = pill.getAttribute("data-msg");
    document.querySelectorAll(".template-msg-pill").forEach(p => p.style.border = "1px solid var(--border-color)");
    pill.style.border = "2px solid var(--color-primary)";
  });
});

btnSubmitQuickStudentMessage.addEventListener("click", async () => {
  if (!currentUser || !activeMessageTargetUser) return;
  
  const todayId = getTodayIdentifier();
  const budgetRef = db.ref(`messageBudgets/${todayId}/${currentUser.id}`);
  const budgetSnap = await budgetRef.get();
  const currentUsed = budgetSnap.val() || 0;

  if (currentUsed >= 3) {
    toast("You have exhausted your daily allowance of 3 room messages.", "error");
    closeQuickMessagingModalWindow();
    return;
  }

  if (!selectedQuickMessageText) {
    toast("Please pick one of the template messages from the list first.", "warning");
    return;
  }

  const broadcastPayload = {
    title: `Status Update from ${currentUser.name} (Seat ${currentUser.code})`,
    body: selectedQuickMessageText,
    seatCode: currentUser.code,
    timestamp: Date.now()
  };

  await db.ref("broadcastAlerts").push(broadcastPayload);
  await budgetRef.set(currentUsed + 1);

  const usersSnap = await db.ref("onlineUsers").get();
  if (usersSnap.exists()) {
    Object.keys(usersSnap.val()).forEach(uid => {
      if (uid !== currentUser.id) {
        db.ref("bellUnreadCounts/" + uid).transaction(c => (c || 0) + 1);
      }
    });
  }
  db.ref("bellUnreadCounts/guest").transaction(c => (c || 0) + 1);

  closeQuickMessagingModalWindow();
  toast("Status message updated globally!", "success");
});

// ==========================================================================
// PIN ACTIONS
// ==========================================================================
const changePinBtn = document.getElementById("changePinBtn");
if (changePinBtn) {
  changePinBtn.addEventListener("click", () => {
    if (!currentUser) return;
    newPinInputField.value = "";
    pinModalOverlay.classList.remove("hidden");
  });
}

function closePinUpdateModalWindow() {
  pinModalOverlay.classList.add("hidden");
}
[closePinModalBtn, cancelPinModalBtn].forEach(btn => {
  if (btn) btn.addEventListener("click", closePinUpdateModalWindow);
});

securePinUpdateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const newPinValue = newPinInputField.value.trim();
  if (!newPinValue) return;

  await db.ref(`customPins/${currentUser.code}`).set(newPinValue);
  
  if (localStorage.getItem("remember_checked") === "true") {
    localStorage.setItem("remembered_pin", newPinValue);
  }

  closePinUpdateModalWindow();
  toast("Security access PIN updated successfully!", "success");
});

// ==========================================================================
// ACCORDION ATTENDANCE ACTION HANDLERS
// ==========================================================================
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

function initRealtimeDatabaseListeners() {
  db.ref("seats").on("value", (snap) => {
    const activeSeats = snap.val() || {};
    let count = Object.keys(activeSeats).length;
    onlineCount.innerText = count;

    let isOccupied = false;
    let userCourseName = "";
    let occupantSeatLabel = "";
    let entryTimestamp = 0;

    Object.values(activeSeats).forEach(u => {
      if (u.inCourse) {
        isOccupied = true;
        userCourseName = u.activeCourseName || "Full Stack AI Engineer";
        occupantSeatLabel = u.code;
        entryTimestamp = u.courseEnteredAt || Date.now();
      }
    });

    if (isOccupied) {
      let formattedTime = new Date(entryTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      courseActiveOccupantSublabel.innerHTML = `<span class="course-alert-occupied-tag"><i class="bi bi-exclamation-triangle-fill"></i> Resource Engaged: ${userCourseName} (Seat ${occupantSeatLabel}) at ${formattedTime}</span>`;
    } else {
      courseActiveOccupantSublabel.innerHTML = `<span class="course-alert-available-tag"><i class="bi bi-check-circle-fill"></i> Workspace Available Now</span>`;
    }
  });

  db.ref("onlineUsers").on("value", (snap) => {
    usersList.innerHTML = "";
    const users = snap.val() || {};
    
    if (Object.keys(users).length === 0) {
      usersList.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:13px;">No developers currently active in workspace.</div>';
      return;
    }

    Object.values(users).forEach(u => {
      const card = document.createElement("div");
      card.className = "user-card";
      
      let badgeHtml = "";
      if (u.inCourse) {
        let pathTime = u.courseEnteredAt ? new Date(u.courseEnteredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
        badgeHtml = `<span class="in-course-indicator-tag"><i class="bi bi-book-half"></i> ${u.activeCourseName || 'In Course'} (${pathTime})</span>`;
      }

      card.innerHTML = `
        <div class="left-info-block">
          <div class="name">${escapeHtml(u.name)} ${badgeHtml}</div>
          <div class="live-elapsed-badge" data-start="${u.start}">00:00</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="student-msg-icon-trigger" onclick="openQuickMessagingModal('${u.id}', '${u.code}')" title="Send quick message option">
            <i class="bi bi-chat-left-text"></i>
          </button>
          <div class="code">Seat ${escapeHtml(u.code)}</div>
        </div>
      `;
      usersList.appendChild(card);
    });

    updateLiveCardElapsedTimers();
  });
  
  db.ref("attendance").limitToLast(5).on("value", (snap) => {
    attendanceList.innerHTML = "";
    const events = snap.val() || {};
    const sortedEvents = Object.values(events).sort((a, b) => b.time - a.time);

    sortedEvents.forEach(e => {
      const timeStr = new Date(e.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const rowBlock = document.createElement("div");
      rowBlock.className = "clean-attendance-row";

      const nameHtml = `<strong class="clean-att-name">${escapeHtml(e.name)}</strong>`;
      const seatHtml = `<span class="clean-att-seat-pill">Seat ${e.code}</span>`;

      if (e.action === "join") {
        rowBlock.innerHTML = `
          <div class="clean-att-left flex-alignment-gap">
            <div class="clean-att-icon icon-join"><i class="bi bi-box-arrow-in-right"></i></div>
            <div>${nameHtml} checked into workspace slot ${seatHtml}</div>
          </div>
          <div class="clean-att-time"><i class="bi bi-clock"></i> ${timeStr}</div>
        `;
      } else {
        const isAutoEx = e.action.includes("expired");
        rowBlock.innerHTML = `
          <div class="clean-att-left flex-alignment-gap">
            <div class="clean-att-icon icon-leave"><i class="bi ${isAutoEx ? 'bi-hourglass-bottom' : 'bi-box-arrow-left'}"></i></div>
            <div>${nameHtml} terminated workspace assignment ${seatHtml}</div>
          </div>
          <div class="clean-att-time"><i class="bi bi-clock"></i> ${timeStr}</div>
        `;
      }
      attendanceList.appendChild(rowBlock);
    });
  });
}

function updateLiveCardElapsedTimers() {
  document.querySelectorAll(".live-elapsed-badge").forEach(badge => {
    const startTimeStamp = parseInt(badge.getAttribute("data-start"));
    if (!startTimeStamp) return;
    const difference = Date.now() - startTimeStamp;
    
    const totalSecs = Math.floor(difference / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    badge.innerText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${secs}s`;
  });
}

clearInterval(liveCardsInterval);
liveCardsInterval = setInterval(updateLiveCardElapsedTimers, 1000);

// ==========================================================================
// ADMINISTRATION CONTROL TERMINAL
// ==========================================================================
adminToggleBtn.addEventListener("click", () => {
  if (isAdminAuthenticated) {
    adminPanel.classList.toggle("hidden");
    if (!adminPanel.classList.contains("hidden")) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  } else {
    adminAuthBox.classList.remove("hidden");
    setTimeout(() => {
      adminAuthBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
  }
});

adminCancelBtn.addEventListener("click", () => {
  adminAuthBox.classList.add("hidden");
  adminEmail.value = "";
  adminPassword.value = "";
});

adminLoginBtn.addEventListener("click", async () => {
  if (adminLoginBtn.classList.contains("button-submitting-state")) return;
  const email = adminEmail.value.trim();
  const password = adminPassword.value.trim();

  if (!email || !password) {
    toast("Please enter administrative credentials.", "error");
    return;
  }

  adminLoginBtn.classList.add("button-submitting-state");
  adminLoginBtn.innerHTML = `<i class="bi bi-hourglass-split"></i> Authorizing...`;

  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    isAdminAuthenticated = true;
    toast("Clearance verified. Admin deck online.", "success");
    adminAuthBox.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    btnToggleAdminComposer.classList.remove("hidden");
    adminAddLessonTriggerBtn.classList.remove("hidden");
    
    buildAdminDashboardDeck();
    listenToGlobalBroadcastAlerts();
    renderLessonsUI();
  } catch (err) {
    toast(`Clearance error: ${err.message}`, "error");
  } finally {
    adminLoginBtn.classList.remove("button-submitting-state");
    adminLoginBtn.innerHTML = `<i class="bi bi-shield-lock"></i> Authorize Admin`;
  }
});
adminLogoutBtn.addEventListener("click", async () => {
  await firebase.auth().signOut();
  isAdminAuthenticated = false;
  toast("Administrative terminal disconnected.", "info");
  adminPanel.classList.add("hidden");
  btnToggleAdminComposer.classList.add("hidden");
  adminMessageComposerArea.classList.remove("expanded");
  adminAddLessonTriggerBtn.classList.add("hidden");
  adminLessonComposerArea.classList.remove("expanded");
  
  listenToGlobalBroadcastAlerts();
  renderLessonsUI();
});

function buildAdminDashboardDeck() {
  adminSeatsDashboard.innerHTML = "";
  
  Object.keys(SEATS).forEach(code => {
    const config = SEATS[code];
    const row = document.createElement("div");
    row.className = "recap-analytics-row";
    row.style.gridTemplateColumns = "1.2fr 0.8fr 1.5fr";
    row.style.padding = "10px 0";
    
    row.innerHTML = `
      <div style="font-weight:700; font-size:13px;">Seat ${code} (${config.name})</div>
      <div id="admin-seat-status-${code}" style="font-size:12px; color:var(--text-secondary);">Offline</div>
      <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center;">
        <button onclick="resetUserSecurityPin('${code}')" class="action-btn primary-btn compact-btn" style="padding:4px 8px; font-size:11px; width:auto; background-color:#2563eb;" title="Reset user pin to default setup"><i class="bi bi-arrow-counterclockwise"></i> Reset PIN</button>
        <button id="btn-lock-${code}" onclick="toggleSeatBlock('${code}')" class="premium-btn compact-btn" style="padding:4px 8px; font-size:11px; margin:0;"><i class="bi bi-lock"></i> Lock</button>
        <button id="btn-kick-${code}" onclick="kickSeatUser('${code}')" class="action-btn danger-btn compact-btn hidden" style="padding:4px 8px; font-size:11px; width:auto; margin:0;"><i class="bi bi-power"></i> Kick</button>
      </div>
    `;
    adminSeatsDashboard.appendChild(row);
  });

  db.ref("seats").on("value", (snap) => {
    const active = snap.val() || {};
    Object.keys(SEATS).forEach(code => {
      const statusText = document.getElementById(`admin-seat-status-${code}`);
      const kickBtn = document.getElementById(`btn-kick-${code}`);
      if (!statusText) return;

      if (active[code]) {
        statusText.innerHTML = '<span class="text-success" style="color:var(--color-success); font-weight:700;">Active</span>';
        if (kickBtn) kickBtn.classList.remove("hidden");
      } else {
        statusText.innerText = "Offline";
        if (kickBtn) kickBtn.classList.add("hidden");
      }
    });
  });

  db.ref("blockedSeats").on("value", (snap) => {
    const blocked = snap.val() || {};
    Object.keys(SEATS).forEach(code => {
      const lockBtn = document.getElementById(`btn-lock-${code}`);
      if (!lockBtn) return;
      if (blocked[code] === true) {
        lockBtn.innerHTML = '<i class="bi bi-unlock"></i> Unlock';
        lockBtn.className = "action-btn warning-btn compact-btn";
        lockBtn.style.width = "auto";
        lockBtn.style.padding = "4px 8px";
        lockBtn.style.fontSize = "11px";
      } else {
        lockBtn.innerHTML = '<i class="bi bi-lock"></i> Lock';
        lockBtn.className = "premium-btn compact-btn";
        lockBtn.style.padding = "4px 8px";
        lockBtn.style.fontSize = "11px";
      }
    });
  });
}

window.toggleSeatBlock = async function(code) {
  if (!isAdminAuthenticated) return;
  const ref = db.ref(`blockedSeats/${code}`);
  const snap = await ref.get();
  const currentState = snap.val() || false;
  
  await ref.set(!currentState);
  toast(`Seat ${code} configuration updated successfully.`, "success");
};

window.kickSeatUser = function(code) {
  if (!isAdminAuthenticated) return;
  openConfirmationModal(
    "Terminate Student Session",
    `Are you absolutely sure you want to eject the user from Seat ${code}?`,
    async () => {
      const snap = await db.ref(`seats/${code}`).get();
      if (snap.exists()) {
        const userData = snap.val();
        await db.ref(`seats/${code}`).remove();
        await db.ref(`onlineUsers/${userData.id}`).remove();
        toast(`Seat ${code} cleared by administrative command.`, "info");
      }
    }
  );
};

// ==========================================================================
// RECAP MATRIX CONTROLLERS 
// ==========================================================================
mobileStudyRecapBtn.addEventListener("click", () => {
  studyRecapModalOverlay.classList.remove("hidden");
  document.body.classList.add("modal-open"); // Locks the background
  renderLessonsUI();
});

// Replace the close recap modal button listener block with this code:
closeRecapModalBtn.addEventListener("click", () => {
  studyRecapModalOverlay.classList.add("hidden");
  document.body.classList.remove("modal-open"); // Unlocks the background
  adminLessonComposerArea.classList.remove("expanded");
  targetEditLessonId = null;
});

adminAddLessonTriggerBtn.addEventListener("click", () => {
  lessonComposerTitle.innerText = "Create New Dynamic Lesson";
  lessonTitleInput.value = "";
  targetEditLessonId = null;
  adminLessonComposerArea.classList.toggle("expanded");
});

btnCancelLessonFormSubmit.addEventListener("click", () => {
  adminLessonComposerArea.classList.remove("expanded");
  lessonTitleInput.value = "";
  targetEditLessonId = null;
});

document.querySelectorAll(".filter-chip").forEach(chip => {
  chip.addEventListener("click", function() {
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    this.classList.add("active");
    activeRecapFilter = this.getAttribute("data-filter");
    localStorage.setItem("recaps_active_language", activeRecapFilter);
    renderLessonsUI();
  });
});

lessonCountLimitSelect.addEventListener("change", renderLessonsUI);

btnSaveLessonDetailsData.addEventListener("click", async () => {
  if (!isAdminAuthenticated) return;
  const title = lessonTitleInput.value.trim();
  const lang = lessonFilterSelect.value;
  const status = lessonStatusSelect.value;

  if (!title) {
    toast("Please specify a valid topic title.", "warning");
    return;
  }

  if (targetEditLessonId) {
    await db.ref(`lessons/${targetEditLessonId}`).update({
      title: title,
      language: lang,
      status: status
    });
    toast("Lesson matrix updated successfully!", "success");
  } else {
    await db.ref("lessons").push({
      title: title,
      language: lang,
      status: status,
      timestamp: Date.now()
    });
    toast("New custom lesson module registered successfully!", "success");
  }

  lessonTitleInput.value = "";
  adminLessonComposerArea.classList.remove("expanded");
  targetEditLessonId = null;
  renderLessonsUI();
});

function renderLessonsUI() {
  const limitValue = lessonCountLimitSelect.value;
  
  db.ref("lessons").off();
  db.ref("lessons").on("value", async (snap) => {
    recapLessonsRenderView.innerHTML = "";
    const data = snap.val() || {};
    
    let list = Object.keys(data).map(k => ({ id: k, ...data[k] }))
                     .filter(item => item.language === activeRecapFilter);
                     
    list.sort((a, b) => b.timestamp - a.timestamp);
    if (limitValue !== "all") {
      list = list.slice(0, parseInt(limitValue));
    }

    if (list.length === 0) {
      recapLessonsRenderView.innerHTML = '<div style="text-align:center; padding:12px; font-size:12px; color:var(--text-secondary);">No topics created under this framework indicator.</div>';
      return;
    }

    const userRatingsSnap = await db.ref("lessonRatings").get();
    const allRatings = userRatingsSnap.val() || {};

    list.forEach(item => {
      const block = document.createElement("div");
      block.className = "bell-msg-item";
      block.style.borderLeft = "3px solid var(--color-primary)";
      
      let currentLessonRatings = allRatings[item.id] || {};
      let totalUsersRated = Object.keys(currentLessonRatings).length;
      
      let badgeClass = totalUsersRated > 0 ? "rating-badge-status rated" : "rating-badge-status unrated";
      let badgeLabel = totalUsersRated > 0 ? `✅ Reviewed (${totalUsersRated})` : `⚠️ Unrated`;
      
      // Compute status dynamic class values
      let currentStatus = (item.status || 'complete').toLowerCase();
      let statusClass = "complete";
      if(currentStatus === 'pending') statusClass = "pending";
      if(currentStatus === 'in review' || currentStatus === 'review') statusClass = "review";

      let adminControlsHtml = "";
      if (isAdminAuthenticated) {
        adminControlsHtml = `
          <div style="display:flex; gap:8px; align-items:center;">
            <a href="javascript:void(0)" onclick="triggerEditLessonModule(event, '${item.id}', '${escapeHtml(item.title)}', '${item.language}', '${item.status}')" style="color:var(--color-warning);"><i class="bi bi-pencil-square"></i></a>
            <a href="javascript:void(0)" onclick="triggerDeleteLessonModule(event, '${item.id}')" style="color:var(--color-danger);"><i class="bi bi-trash-fill"></i></a>
          </div>
        `;
      }

      let starInteractiveHtml = "";
      if (currentUser) {
        let assignedUserRatingScore = currentLessonRatings[currentUser.code] || 0;
        starInteractiveHtml = `<div class="star-rating-container">`;
        for (let i = 1; i <= 5; i++) {
          let activeStarClass = i <= assignedUserRatingScore ? "bi-star-fill active" : "bi-star";
          starInteractiveHtml += `<i class="bi ${activeStarClass}" onclick="toggleUserLessonRating('${item.id}', ${i})"></i>`;
        }
        starInteractiveHtml += `</div>`;
      }

      block.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="${badgeClass}" style="cursor:pointer;" onclick="displayLessonBreakdownMetrics('${item.id}', '${escapeHtml(item.title)}')">${badgeLabel}</span>
          ${adminControlsHtml}
        </div>
        <h4 style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${escapeHtml(item.title)}</h4>
        <div style="display:flex; justify-content:between; align-items:center; width:100%; flex-wrap:wrap; gap:6px;">
          <span class="status-pill-indicator ${statusClass}">Status: ${currentStatus}</span>
          <div style="margin-left:auto;">
            ${starInteractiveHtml}
          </div>
        </div>
      `;
      recapLessonsRenderView.appendChild(block);
    });
  });
}

// Replace this function with the code below:
window.toggleUserLessonRating = async function(lessonId, specificScore = 5) {
  if (!currentUser) return;
  const path = `lessonRatings/${lessonId}/${currentUser.code}`;
  const snap = await db.ref(path).get();
  
  if (snap.exists() && snap.val() === specificScore) {
    await db.ref(path).remove();
    toast("Review milestone feedback removed.", "info");
  } else {
    await db.ref(path).set(specificScore);
    toast(`Lesson marked reviewed with ${specificScore}/5 Stars!`, "success");
  }
  renderLessonsUI();
};

// Replace this function with the code below:
window.displayLessonBreakdownMetrics = async function(lessonId, lessonName) {
  lblSelectedInfoLessonName.innerText = lessonName;
  lessonUsersRatingBreakdownList.innerHTML = "";
  
  const snap = await db.ref(`lessonRatings/${lessonId}`).get();
  const ratings = snap.val() || {};
  const codes = Object.keys(ratings);

  if (codes.length === 0) {
    lessonUsersRatingBreakdownList.innerHTML = '<div style="font-size:12px; color:var(--text-secondary);">No student developer has reviewed this topic module yet.</div>';
  } else {
    codes.forEach(c => {
      let studentName = SEATS[c] ? SEATS[c].name : "Unknown User";
      let starsGiven = ratings[c] || 5;
      
      const div = document.createElement("div");
      div.className = "rated-person-row"; // Turns text green automatically for completion
      div.innerHTML = `<i class="bi bi-person-check-fill"></i> <span><strong>${studentName}</strong> (Seat ${c}) marked complete — <strong>${starsGiven}/5 ⭐</strong></span>`;
      lessonUsersRatingBreakdownList.appendChild(div);
    });
  }
  lessonInfoBreakdownBox.classList.remove("hidden");
};

btnCloseInfoPaneTrigger.addEventListener("click", () => {
  lessonInfoBreakdownBox.classList.add("hidden");
});

window.triggerDeleteLessonModule = function(e, id) {
  if (e) e.stopPropagation();
  openConfirmationModal(
    "Drop Lesson Module",
    "Are you absolutely certain you want to remove this topic profile permanently?",
    async () => {
      await db.ref(`lessons/${id}`).remove();
      await db.ref(`lessonRatings/${id}`).remove();
      toast("Lesson dropped from tracking record index.", "info");
      renderLessonsUI();
    }
  );
};

window.triggerEditLessonModule = function(e, id, title, language, status) {
  if (e) e.stopPropagation();
  lessonComposerTitle.innerText = "Modify Current Module Metrics";
  lessonTitleInput.value = title;
  lessonFilterSelect.value = language;
  lessonStatusSelect.value = status || "complete";
  targetEditLessonId = id;
  
  adminLessonComposerArea.classList.add("expanded");
};

// ==========================================================================
// CORE SUBMIT HANDLERS
// ==========================================================================
// Replace the join form submission event handler with this code:
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const joinBtn = document.getElementById("joinBtn");
  if (joinBtn.classList.contains("button-submitting-state")) return;

  joinBtn.classList.add("button-submitting-state");
  joinBtn.innerHTML = `<i class="bi bi-hourglass-split"></i> Joining...`;

  try {
    const name = nameInput.value;
    const code = codeInput.value;
    const pin = pinInput.value;
    await joinRoom(name, code, pin);
  } finally {
    joinBtn.classList.remove("button-submitting-state");
    joinBtn.innerHTML = `<i class="bi bi-box-arrow-in-right"></i> Claim Seat Space`;
  }
});



leaveBtn.addEventListener("click", () => {
  openConfirmationModal(
    "Disconnect Space Link",
    "Are you sure you want to terminate your current workspace session runtime?",
    async () => {
      await leaveRoom(false);
    }
  );
});

// ==========================================================================
// PRE-AUTHENTICATION BOOTSTRAPPER
// ==========================================================================
async function bootstrapApplicationWorkspaceRuntime() {
  const targetTheme = localStorage.getItem("app_theme") || "dark";
  document.documentElement.setAttribute("data-theme", targetTheme);
  
  const sun = document.getElementById("sunIcon");
  const moon = document.getElementById("moonIcon");
  if (targetTheme === "dark") {
    if (sun) sun.classList.remove("hidden");
    if (moon) moon.classList.add("hidden");
  } else {
    if (sun) sun.classList.add("hidden");
    if (moon) moon.classList.remove("hidden");
  }

  const savedLanguageFilter = localStorage.getItem("recaps_active_language") || "html";
  activeRecapFilter = savedLanguageFilter;
  document.querySelectorAll(".filter-chip").forEach(c => {
    if (c.getAttribute("data-filter") === activeRecapFilter) c.classList.add("active");
    else c.classList.remove("active");
  });

  updateTimeframeButtonLabelText();

  const cacheUserId = localStorage.getItem("active_user");
  if (cacheUserId) {
    const onlineSnap = await db.ref("onlineUsers/" + cacheUserId).get();
    if (onlineSnap.exists()) {
      currentUser = onlineSnap.val();
      
      formBox.classList.add("hidden");
      leaveBtn.classList.remove("hidden");
      pinActionBox.classList.remove("hidden");
      setStatusText(true, currentUser.code, currentUser.name);

      startTimer();
      syncPersonalAccumulatedTime(currentUser.code);
      listenToActiveKicks(cacheUserId);

      db.ref("seats/" + currentUser.code).onDisconnect().remove();
      db.ref("onlineUsers/" + cacheUserId).onDisconnect().remove();
      
      const sessionQuotaSpent = Date.now() - currentUser.start;
      const remainingTime = SESSION_LIMIT - sessionQuotaSpent;
      
      if (remainingTime <= 0) {
        leaveRoom(true);
      } else {
        clearTimeout(autoRemovalTimeoutInstance);
        autoRemovalTimeoutInstance = setTimeout(() => { leaveRoom(true); }, remainingTime);
      }
    } else {
      localStorage.removeItem("active_user");
      setStatusText(false);
    }
  } else {
    setStatusText(false);
  }

  if (localStorage.getItem("remember_checked") === "true") {
    nameInput.value = localStorage.getItem("remembered_name") || "";
    codeInput.value = localStorage.getItem("remembered_code") || "";
    pinInput.value = localStorage.getItem("remembered_pin") || "";
    rememberMe.checked = true;
  }

  initRealtimeDatabaseListeners();
  listenToGlobalBroadcastAlerts();
  renderLessonsUI();
}

document.getElementById("themeToggleBtn").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const target = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", target);
  localStorage.setItem("app_theme", target);

  const sun = document.getElementById("sunIcon");
  const moon = document.getElementById("moonIcon");
  if (target === "dark") {
    if (sun) sun.classList.remove("hidden");
    if (moon) moon.classList.add("hidden");
  } else {
    if (sun) sun.classList.add("hidden");
    if (moon) moon.classList.remove("hidden");
  }
});

window.addEventListener("DOMContentLoaded", bootstrapApplicationWorkspaceRuntime);
