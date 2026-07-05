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

// DYNAMIC CORE INTEGRATION ARCHITECTURE NODES
const btnTriggerEnterCourseEmbed = document.getElementById("btnTriggerEnterCourseEmbed");
const courseEmbedContainer = document.getElementById("courseEmbedContainer");
const courseIframeElement = document.getElementById("courseIframeElement");
const btnCloseCourseEmbed = document.getElementById("btnCloseCourseEmbed");
const btnToggleFullScreen = document.getElementById("btnToggleFullScreen");
const btnMinimizeCourse = document.getElementById("btnMinimizeCourse");
const courseFrameUserSeatBadge = document.getElementById("courseFrameUserSeatBadge");

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
const customQuickTextMessageInput = document.getElementById("customQuickTextMessageInput");

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
let activeMessageTargetUser = null;
let showAllMessagesFlag = false;

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
    courseFrameUserSeatBadge.innerText = `Seat ${seat}`;
  } else {
    userStatus.innerHTML = `<i class="bi bi-dash-circle"></i> Not joined`;
    userStatus.className = "status-badge";
    seat03AccessLink.classList.add("hidden");
    courseFrameUserSeatBadge.innerText = `Seat --`;
    closeCourseEmbedWindow();
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
    start: Date.now(),
    inCourse: false
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
  listenToActiveKicks(userId);
}

async function leaveRoom(auto = false) {
  if (!currentUser) return;

  const code = currentUser.code;
  const id = currentUser.id;
  const name = currentUser.name;
  const sessionDuration = Date.now() - currentUser.start;

  currentUser = null;
  stopTimer();
  closeCourseEmbedWindow();

  formBox.classList.remove("hidden");
  leaveBtn.classList.add("hidden");
  pinActionBox.classList.add("hidden");
  setStatusText(false);

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

function listenToActiveKicks(userId) {
  db.ref("onlineUsers/" + userId).on("value", (snap) => {
    if (!snap.exists() && currentUser) {
      leaveRoom(true);
    }
  });
}

// ==========================================================================
// EMBEDDED IFRAME COURSE CONTAINER MANAGEMENT ENGINE
// ==========================================================================
async function openCourseEmbedWindow() {
  if (!currentUser) return;
  
  const snap = await db.ref("onlineUsers").get();
  let courseOccupied = false;
  if (snap.exists()) {
    Object.values(snap.val()).forEach(u => {
      if (u.inCourse && u.id !== currentUser.id) courseOccupied = true;
    });
  }

  if (courseOccupied) {
    toast("Course access is limited to 1 user concurrently across rooms.", "error");
    return;
  }

  currentUser.inCourse = true;
  await db.ref("onlineUsers/" + currentUser.id + "/inCourse").set(true);
  
  courseIframeElement.src = "https://dugsiiye.com/dashboard/student";
  courseEmbedContainer.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

async function closeCourseEmbedWindow() {
  courseEmbedContainer.classList.add("hidden");
  courseIframeElement.src = "";
  document.body.style.overflow = "";
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
  if (currentUser && currentUser.inCourse) {
    currentUser.inCourse = false;
    await db.ref("onlineUsers/" + currentUser.id + "/inCourse").set(false);
  }
}

btnTriggerEnterCourseEmbed.addEventListener("click", openCourseEmbedWindow);
btnCloseCourseEmbed.addEventListener("click", closeCourseEmbedWindow);
btnMinimizeCourse.addEventListener("click", () => {
  courseEmbedContainer.classList.add("hidden");
  document.body.style.overflow = "";
});

btnToggleFullScreen.addEventListener("click", () => {
  const frame = document.querySelector(".course-window-frame");
  if (!document.fullscreenElement) {
    frame.requestFullscreen().catch(err => {
      toast(`Error enabling fullscreen: ${err.message}`, "error");
    });
  } else {
    document.exitFullscreen();
  }
});

// ==========================================================================
// DYNAMIC BROADCAST SYSTEM & BELL SYSTEMS ENGINE (WITH ACTION SEPARATIONS)
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

btnToggleAdminComposer.addEventListener("click", () => {
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

  db.ref("broadcastAlerts").orderByChild("timestamp").on("value", (snap) => {
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
      const card = document.createElement("div");
      card.className = m.seatCode === "Admin" ? "bell-msg-item warning-border" : "bell-msg-item";
      
      const isOwnMessage = currentUser && currentUser.code === m.seatCode;
      const isMsgFromAdmin = m.seatCode === "Admin";
      
      let actionButtons = `<div class="bell-msg-actions">`;
      
      if (isAdminAuthenticated) {
        if (isMsgFromAdmin) {
          actionButtons += `<a href="javascript:void(0)" onclick="editMessage('${m.id}', '${escapeHtml(m.title)}', '${escapeHtml(m.body)}')" class="text-warning" title="Edit"><i class="bi bi-pencil-square"></i></a>`;
        }
        actionButtons += `<a href="javascript:void(0)" onclick="deleteMessage('${m.id}')" class="text-danger" style="color:var(--color-danger) !important;" title="Delete"><i class="bi bi-trash"></i></a>`;
      } else if (isOwnMessage) {
        actionButtons += `<a href="javascript:void(0)" onclick="deleteMessage('${m.id}')" class="text-danger" style="color:var(--color-danger) !important;" title="Delete"><i class="bi bi-trash"></i></a>`;
      }
      
      actionButtons += `</div>`;

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

window.deleteMessage = function(messageId) {
  openConfirmationModal(
    "Delete Alert Message",
    "Are you sure you want to completely delete this message broadcast alert?",
    async () => {
      await db.ref("broadcastAlerts/" + messageId).remove();
      toast("Message deleted successfully!", "success");
    }
  );
};

window.editMessage = function(messageId, currentTitle, currentBody) {
  if (!isAdminAuthenticated) return;
  adminMsgTitleInput.value = currentTitle;
  adminMsgBodyInput.value = currentBody;
  
  if (!adminMessageComposerArea.classList.contains("expanded")) {
    btnToggleAdminComposer.click();
  }
  
  btnAdminBroadcastSubmit.onerror = btnAdminBroadcastSubmit.onclick; 
  btnAdminBroadcastSubmit.onclick = async () => {
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
    btnToggleAdminComposer.click();
    toast("Broadcast alert updated successfully!", "success");
    
    btnAdminBroadcastSubmit.onclick = btnAdminBroadcastSubmit.onerror; 
  };
  
  toast("Message loaded into composer context for editing.", "info");
};

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

btnLoadAllMessagesView.addEventListener("click", () => {
  showAllMessagesFlag = !showAllMessagesFlag;
  btnLoadAllMessagesView.innerText = showAllMessagesFlag ? "Show Less" : "View All";
});

btnAdminBroadcastSubmit.addEventListener("click", async () => {
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
  btnToggleAdminComposer.click();
  toast("Broadcast alert transmitted successfully!", "success");
});

// ==========================================================================
// STUDENT QUICK TEMPLATE MESSAGING SYSTEM CONTROLLERS
// ==========================================================================
window.openQuickMessagingModal = async function(targetUserId, targetSeatCode) {
  if (!currentUser) {
    toast("You must claim a space seat to interact.", "error");
    return;
  }
  if (currentUser.id !== targetUserId) {
    toast("You can only transmit alerts from your own assigned seat workspace dashboard profile.", "error");
    return;
  }
  
  activeMessageTargetUser = { id: targetUserId, seat: targetSeatCode };
  
  const todayId = getTodayIdentifier();
  const budgetSnap = await db.ref(`messageBudgets/${todayId}/${currentUser.id}`).get();
  const currentUsed = budgetSnap.val() || 0;
  const remaining = Math.max(0, 3 - currentUsed);

  lblRemainingMsgBudgetCounter.innerText = remaining;
  customQuickTextMessageInput.value = "";
  quickStudentMessageModal.classList.remove("hidden");
};

function closeQuickMessagingModalWindow() {
  quickStudentMessageModal.classList.add("hidden");
  activeMessageTargetUser = null;
}

[btnCloseMessageModal, btnCancelMessageModal].forEach(b => b.addEventListener("click", closeQuickMessagingModalWindow));

document.querySelectorAll(".template-msg-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    customQuickTextMessageInput.value = pill.getAttribute("data-msg");
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

  const msgText = customQuickTextMessageInput.value.trim();
  if (!msgText) {
    toast("Please pick or type a message content snippet first", "warning");
    return;
  }

  const broadcastPayload = {
    title: `${currentUser.name} Status Alert`,
    body: msgText,
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

  toast("Quick status warning transmitted!", "success");
  closeQuickMessagingModalWindow();
});

// ==========================================================================
// PIN ACTIONS
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
    
    const courseStatusBadge = u.inCourse ? `<span class="in-course-indicator-tag"><i class="bi bi-mortarboard-fill"></i> Signed In</span>` : '';
    const messageActionBtn = (currentUser && currentUser.id === u.id) 
      ? `<button onclick="openQuickMessagingModal('${u.id}', '${u.code}')" class="student-msg-icon-trigger" title="Send Status Alert"><i class="bi bi-envelope"></i></button>` 
      : '';

    div.innerHTML = `
      <div class="left-info-block">
        <span class="name"><i class="bi bi-person-workspace"></i> ${u.name} ${courseStatusBadge}</span>
        <span class="live-elapsed-badge"><i class="bi bi-clock-history"></i> ${formatHoursMinutes(elapsedMs)}</span>
      </div>
      <div class="right-action-block" style="display:flex; align-items:center; gap:8px;">
        ${messageActionBtn}
        <span class="code"><i class="bi bi-pin-angle"></i> Seat ${u.code}</span>
      </div>
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
      if (badge) badge.innerHTML = `<i class="bi bi-clock-history"></i> ${formatHoursMinutes(Date.now() - startStamp)}`;
    }
  });
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
// ADMINISTRATIVE PRIVILEGE DASHBOARD METRICS
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
                <div><strong>Seat ${seatId}:</strong> ${statusStr}</div>
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
      btnToggleAdminComposer.classList.remove("hidden"); 
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
      btnToggleAdminComposer.classList.add("hidden");
      adminMessageComposerArea.classList.remove("expanded");
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
// LIGHT/DARK THEME MANAGEMENT
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
// PERSISTENT REFRESH GUARD ENGINES
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  initializeThemeSystem();
  updateTimeframeButtonLabelText();

  if (localStorage.getItem("remember_checked") === "true") {
    nameInput.value = localStorage.getItem("remembered_name") || "";
    codeInput.value = localStorage.getItem("remembered_code") || "";
    pinInput.value = localStorage.getItem("remembered_pin") || "";
    rememberMe.checked = true;
  }

  // Persistent Admin/Student State Authentication Refresh Guard
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user && user.uid === "trlabHsJKARs1Emga5dQEN7SfKS2") {
      isAdminAuthenticated = true;
      adminAuthBox.classList.add("hidden");
      formBox.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      btnToggleAdminComposer.classList.remove("hidden");
      syncAdminDashboardMetrics();
    }
    
    // Sync active student profile logic cleanly
    const savedStudentId = localStorage.getItem("active_user");
    if (savedStudentId) {
      const snap = await db.ref("onlineUsers/" + savedStudentId).get();
      if (snap.exists()) {
        currentUser = snap.val();
        formBox.classList.add("hidden");
        leaveBtn.classList.remove("hidden");
        pinActionBox.classList.remove("hidden");
        setStatusText(true, currentUser.code);
        startTimer();
        syncPersonalAccumulatedTime(currentUser.code);
        listenToActiveKicks(savedStudentId);
      } else {
        localStorage.removeItem("active_user");
      }
    }
    
    listenToGlobalBroadcastAlerts();
  });
});
