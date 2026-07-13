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
const SESSION_LIMIT = 3 * 60 * 60 * 1000; 
const MIN_VISIBLE_SESSION_MS = 1000;
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
const adminMoreBtn = document.getElementById("adminMoreBtn");
const btnOpenAttendanceReportModal = document.getElementById("btnOpenAttendanceReportModal");
const attendanceReportModalOverlay = document.getElementById("attendanceReportModalOverlay");
const closeAttendanceReportModalBtn = document.getElementById("closeAttendanceReportModalBtn");
const btnDownloadAttendancePdf = document.getElementById("btnDownloadAttendancePdf");
const attendanceReportRangeSelect = document.getElementById("attendanceReportRangeSelect");
const attendanceReportUserSelect = document.getElementById("attendanceReportUserSelect");
const attendanceReportLimitSelect = document.getElementById("attendanceReportLimitSelect");
const attendanceReportSessionsList = document.getElementById("attendanceReportSessionsList");
const attendanceReportTopUsersList = document.getElementById("attendanceReportTopUsersList");
const attendanceReportSummaryGrid = document.getElementById("attendanceReportSummaryGrid");
const courseAttendanceList = document.getElementById("courseAttendanceList");
const attendanceLogLimitSelect = document.getElementById("attendanceLogLimitSelect");
const handRaiseBoardTitle = document.getElementById("handRaiseBoardTitle");
const raisedHandsCount = document.getElementById("raisedHandsCount");
const raisedHandsList = document.getElementById("raisedHandsList");
const quickMessageRecipientLabel = document.getElementById("quickMessageRecipientLabel");

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
let activeMessageMode = "private";
let showAllMessagesFlag = false;
let activeBroadcastsRef = null;
let activePrivateMessagesRef = null;
let notificationRefreshTimeout = null;

let activeRecapFilter = localStorage.getItem("recaps_active_language") || "html";
let targetEditLessonId = null;
let currentCourseSessionId = null;
let sessionHeartbeatInterval = null;
let activeAttendanceReportRange = "today";
let activeAttendanceReportUser = "all";
let activeAttendanceReportLimit = 10;
const ACTIVE_PRESENCE_GRACE_MS = 90000;
const HEARTBEAT_INTERVAL_MS = 15000;
const COURSE_SESSION_COLLECTION = "courseSessions";

let activeAttendanceEventsCache = [];
let liveAttendanceLogLimit = parseInt(localStorage.getItem("attendance_log_limit") || "5", 10);
let attendanceRefreshInterval = null;
let staleSessionMonitorInterval = null;
const ATTENDANCE_REFRESH_INTERVAL_MS = 10000; // safer for Firebase free plan
const STALE_SESSION_SWEEP_INTERVAL_MS = 30000;

const JOIN_WELCOME_MESSAGES = [
  "Welcome aboard — great progress starts here.",
  "You are in the right place to build something new.",
  "Today is a good day to learn one more thing.",
  "Your workspace is ready — let us keep moving forward.",
  "Stay focused and enjoy the journey.",
  "Small steps now become big results later.",
  "Nice to see you here — keep the momentum going.",
  "Let us make this session count.",
  "New seat, new progress, new results.",
  "Welcome to Study Room Pro — let us learn something new."
];

let currentDeviceId = localStorage.getItem("device_id") || "";
let currentTabId = sessionStorage.getItem("active_tab_id") || "";
let currentSessionToken = sessionStorage.getItem("active_session_token") || "";
let isSessionTeardownInProgress = false;

const MOTIVATION_QUOTES = [
  "Errors and bugs are validation evidence that you are stretching operational capability boundaries. ⚙️",
  "Focus determines reality — Let us make every single block execution scale gracefully! 🎯",
  "Consistency beats talent explicitly every single day. Keep typing and iterating! 💻",
  "Small calculated steps layer incrementally into massive engineering production applications. 🚀",
  "Your systematic persistence today molds the high-tier full-stack developer you become tomorrow. 👑"
];
let typingTimerInstance = null;
let phraseRotationIntervalInstance = null;

currentDeviceId = getOrCreateDeviceId();
currentTabId = getOrCreateTabId();

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

function showJoinWelcomePopup(name, code) {
  const overlay = document.getElementById("welcomePopupOverlay");
  const title = document.getElementById("welcomePopupTitle");
  const body = document.getElementById("welcomePopupBody");
  if (!overlay || !title || !body) return;

  const message = JOIN_WELCOME_MESSAGES[Math.floor(Math.random() * JOIN_WELCOME_MESSAGES.length)];
  title.innerHTML = `Welcome <span>${escapeHtml(name)}</span>`;
  body.innerHTML = `<strong>Seat ${escapeHtml(code)}</strong><br><span>Study Room Pro</span><br>${escapeHtml(message)}`;
  overlay.classList.remove("hidden");
  overlay.classList.add("show");

  clearTimeout(window.__welcomePopupTimer);
  window.__welcomePopupTimer = setTimeout(() => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.classList.add("hidden"), 260);
  }, 3000);
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

function pad2(num) {
  return String(num).padStart(2, '0');
}

function formatClockDateTime(timestamp) {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const stampDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (stampDay === startOfToday) return `Today ${time}`;
  if (stampDay === startOfYesterday) return `Yesterday ${time}`;
  const day = pad2(d.getDate());
  const month = d.toLocaleDateString([], { month: 'short' });
  return `${day}/${month} ${time}`;
}

function formatSessionDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}:${pad2(minutes)}m`;
}

function getRangeBounds(range) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  if (range === 'week') {
    const shift = (start.getDay() + 1) % 7;
    start.setDate(start.getDate() - shift);
    start.setHours(0, 0, 0, 0);
    return { start: start.getTime(), end: end.getTime() };
  }
  if (range === 'month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return { start: start.getTime(), end: end.getTime() };
  }
  if (range === 'year') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    return { start: start.getTime(), end: end.getTime() };
  }
  start.setHours(0, 0, 0, 0);
  return { start: start.getTime(), end: end.getTime() };
}

function isTimestampInSelectedRange(timestamp, range) {
  const { start, end } = getRangeBounds(range);
  return timestamp >= start && timestamp <= end;
}

function isPresenceFresh(user) {
  if (!user) return false;
  const lastSeen = user.lastSeen || user.heartbeatAt || user.start || 0;
  if ((Date.now() - lastSeen) > ACTIVE_PRESENCE_GRACE_MS) return false;
  return !isSessionOverLimit(user);
}

function createStableId(prefix) {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}_${window.crypto.randomUUID()}`;
    }
  } catch (_) {}
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = createStableId("dev");
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
}

function getOrCreateTabId() {
  let tabId = sessionStorage.getItem("active_tab_id");
  if (!tabId) {
    tabId = createStableId("tab");
    sessionStorage.setItem("active_tab_id", tabId);
  }
  return tabId;
}

function clearActiveSessionStorage() {
  sessionStorage.removeItem("active_session_token");
  localStorage.removeItem("active_session_token");
  localStorage.removeItem("active_user");
}

function buildPresencePayload(extra = {}) {
  if (!currentUser) return null;
  return {
    ...currentUser,
    ...extra,
    lastSeen: Date.now(),
    heartbeatAt: Date.now(),
    deviceId: currentDeviceId,
    tabId: currentTabId,
    sessionToken: currentSessionToken,
    inCourse: !!currentUser.inCourse,
    courseEnteredAt: currentUser.courseEnteredAt || 0,
    activeCourseName: currentUser.activeCourseName || ""
  };
}

function isLeaseFresh(lease) {
  if (!lease) return false;
  const marker = lease.heartbeatAt || lease.lastSeen || lease.start || 0;
  return lease.sessionToken && (Date.now() - marker) <= ACTIVE_PRESENCE_GRACE_MS;
}

function getPresenceMapFromSeatsSnapshot(seats = {}) {
  const map = {};
  Object.keys(seats || {}).forEach(code => {
    const seat = seats[code] || {};
    map[code] = {
      fresh: isPresenceFresh(seat),
      inCourse: !!seat.inCourse,
      name: seat.name || "",
      code
    };
  });
  return map;
}

function isLeaveAction(action = "") {
  const value = String(action || "").toLowerCase();
  return value.startsWith("leave") || value.includes("terminated") || value.includes("expired");
}

function buildResolvedAttendanceEvents(events = [], presenceMap = {}, now = Date.now()) {
  const ordered = events.filter(Boolean).slice().sort((a, b) => (a.time || 0) - (b.time || 0));
  const resolved = [];
  const openRooms = new Map();
  const openCourses = new Map();

  ordered.forEach((event) => {
    const code = event.code || "--";
    const action = String(event.action || "");
    if (action === "join") {
      openRooms.set(code, event);
      resolved.push(event);
      return;
    }
    if (action === "course-enter") {
      openCourses.set(code, event);
      resolved.push(event);
      return;
    }
    if (action === "course-leave") {
      openCourses.delete(code);
      resolved.push(event);
      return;
    }
    if (isLeaveAction(action)) {
      openRooms.delete(code);
      resolved.push(event);
      return;
    }
    resolved.push(event);
  });

  const synthesizeRoomExit = (joinEvent, reason = "auto-synced") => ({
    name: joinEvent.name || "Unknown",
    code: joinEvent.code || "--",
    action: "terminated",
    time: now,
    reason,
    sessionDuration: Math.max(0, now - (joinEvent.time || now))
  });

  const synthesizeCourseExit = (courseEvent, reason = "auto-synced") => ({
    name: courseEvent.name || "Unknown",
    code: courseEvent.code || "--",
    action: "course-leave",
    time: now,
    reason,
    sessionDuration: Math.max(0, now - (courseEvent.time || now)),
    courseName: courseEvent.courseName || "Full Stack AI Engineer"
  });

  for (const [code, joinEvent] of openRooms.entries()) {
    if (presenceMap?.[code]?.fresh) continue;
    const courseEvent = openCourses.get(code);
    if (courseEvent) {
      resolved.push(synthesizeCourseExit(courseEvent));
      openCourses.delete(code);
    }
    resolved.push(synthesizeRoomExit(joinEvent));
  }

  return resolved.slice().sort((a, b) => (a.time || 0) - (b.time || 0));
}

function buildStaleSessionSummary(seatData = {}, leaseData = null) {
  const now = Date.now();
  const code = seatData.code || leaseData?.seat || leaseData?.code || "--";
  const name = seatData.name || leaseData?.name || "Unknown";
  const ownerId = seatData.id || leaseData?.ownerId || seatData.ownerId || seatData.userId || "";
  const sessionStart = seatData.start || leaseData?.start || now;
  const sessionDuration = Math.min(SESSION_LIMIT, Math.max(0, now - sessionStart));
  const courseStart = seatData.courseEnteredAt || leaseData?.courseEnteredAt || sessionStart;
  const activeCourseName = seatData.activeCourseName || leaseData?.activeCourseName || "Full Stack AI Engineer";
  return { now, code, name, ownerId, sessionStart, sessionDuration, courseStart, activeCourseName };
}

async function closeStalePresenceSession(seatData, leaseData = null) {
  if (!seatData || !seatData.code || !seatData.sessionToken) return false;
  if ((isPresenceFresh(seatData) || seatData.exitLoggedAt) && !isSessionOverLimit(seatData)) return false;

  const { now, code, name, ownerId, sessionStart, sessionDuration, courseStart, activeCourseName } = buildStaleSessionSummary(seatData, leaseData);
  const hasCourse = !!seatData.inCourse || !!leaseData?.inCourse || !!courseStart;

  if (hasCourse) {
    try {
      const courseSnap = await db.ref(COURSE_SESSION_COLLECTION).orderByChild("code").equalTo(code).get();
      const sessions = courseSnap.val() || {};
      const activeIds = Object.keys(sessions).filter(id => {
        const s = sessions[id] || {};
        return !s.end || s.status === "active";
      });
      const targetId = activeIds.sort((a, b) => (sessions[b].start || 0) - (sessions[a].start || 0))[0];
      if (targetId) {
        await db.ref(`${COURSE_SESSION_COLLECTION}/${targetId}`).update({
          end: now,
          duration: Math.max(0, now - (sessions[targetId].start || courseStart || now)),
          status: "terminated",
          endLabel: formatClockDateTime(now)
        }).catch(() => {});
      }
    } catch (_) {}
  }

  await db.ref("attendance").push({
    name,
    code,
    action: "terminated",
    time: now,
    sessionDuration,
    start: sessionStart,
    reason: "stale-session-sweep"
  });

  if (hasCourse) {
    await db.ref("attendance").push({
      name,
      code,
      action: "course-leave",
      time: now,
      sessionDuration: Math.min(SESSION_LIMIT, Math.max(0, now - (courseStart || sessionStart))),
      reason: "stale-session-sweep",
      courseName: activeCourseName
    });
  }

  const removals = [];
  removals.push(db.ref(`seats/${code}`).remove().catch(() => {}));
  if (ownerId) removals.push(db.ref(`onlineUsers/${ownerId}`).remove().catch(() => {}));
  removals.push(db.ref(`seatLeases/${code}`).remove().catch(() => {}));
  await Promise.all(removals);
  return true;
}

// ==========================================================================

// SESSION MANAGEMENT TIMERS
// ==========================================================================
function startTimer() {
  clearInterval(timerInterval);
  if (currentUser && timerBox) {
    timerBox.innerText = formatLiveSeconds(getVisibleElapsedSessionMs(currentUser.start));
  }
  timerInterval = setInterval(() => {
    if (!currentUser) return;

    if (isSessionOverLimit(currentUser)) {
      leaveRoom(true, "session-expired");
      return;
    }

    if (currentUser.inCourse && isSessionOverLimit({ start: currentUser.courseEnteredAt })) {
      leaveCourse(true, "course-expired", {
        silent: true,
        skipConfirm: true,
        allowDuringTeardown: true,
        suppressAttendanceLog: false
      }).then(() => {
        leaveRoom(true, "session-expired");
      });
      return;
    }

    const currentSessionMs = getVisibleElapsedSessionMs(currentUser.start);
    timerBox.innerText = formatLiveSeconds(currentSessionMs);
  }, 1000);
}


async function refreshAllPresenceHeartbeats() {
  if (!currentUser || !currentSessionToken) return;

  if (isSessionOverLimit(currentUser)) {
    leaveRoom(true, "session-expired");
    return;
  }

  if (currentUser.inCourse && isSessionOverLimit({ start: currentUser.courseEnteredAt })) {
    await leaveCourse(true, "course-expired", {
      silent: true,
      skipConfirm: true,
      allowDuringTeardown: true,
      suppressAttendanceLog: false
    });
    await leaveRoom(true, "session-expired");
    return;
  }

  const leaseRef = db.ref(`seatLeases/${currentUser.code}`);
  const leaseSnap = await leaseRef.get().catch(() => null);
  const lease = leaseSnap && leaseSnap.val ? leaseSnap.val() : null;
  if (!lease || lease.sessionToken !== currentSessionToken) {
    await leaveRoom(true, "lease-lost");
    return;
  }

  const payload = buildPresencePayload();
  if (!payload) return;

  await leaseRef.update({
    seat: currentUser.code,
    name: currentUser.name,
    ownerId: currentUser.id,
    deviceId: currentDeviceId,
    tabId: currentTabId,
    sessionToken: currentSessionToken,
    inCourse: !!currentUser.inCourse,
    activeCourseName: currentUser.activeCourseName || "",
    courseEnteredAt: currentUser.courseEnteredAt || 0,
    start: currentUser.start || Date.now(),
    lastSeen: Date.now(),
    heartbeatAt: Date.now()
  }).catch(() => {});

  await db.ref(`seats/${currentUser.code}`).update(payload).catch(() => {});
  await db.ref(`onlineUsers/${currentUser.id}`).update(payload).catch(() => {});
}

function startSessionHeartbeat() {
  clearInterval(sessionHeartbeatInterval);
  refreshAllPresenceHeartbeats();
  sessionHeartbeatInterval = setInterval(refreshAllPresenceHeartbeats, HEARTBEAT_INTERVAL_MS);
}

function stopSessionHeartbeat() {
  clearInterval(sessionHeartbeatInterval);
  sessionHeartbeatInterval = null;
}

async function registerSessionDisconnectHandlers() {
  if (!currentUser) return;
  const code = currentUser.code;
  const id = currentUser.id;
  const leaseRef = db.ref(`seatLeases/${code}`);
  const seatRef = db.ref(`seats/${code}`);
  const onlineRef = db.ref(`onlineUsers/${id}`);
  await Promise.all([
    leaseRef.onDisconnect().remove().catch(() => {}),
    seatRef.onDisconnect().remove().catch(() => {}),
    onlineRef.onDisconnect().remove().catch(() => {})
  ]).catch(() => {});
}

async function cancelSessionDisconnectHandlers(code = "", id = "") {
  const removals = [];
  if (code) {
    removals.push(db.ref(`seatLeases/${code}`).onDisconnect().cancel().catch(() => {}));
    removals.push(db.ref(`seats/${code}`).onDisconnect().cancel().catch(() => {}));
  }
  if (id) {
    removals.push(db.ref(`onlineUsers/${id}`).onDisconnect().cancel().catch(() => {}));
  }
  await Promise.all(removals.map(p => Promise.resolve(p).catch(() => {}))).catch(() => {});
}

function focusDefaultCourseAction() {
  if (!seat03AccessLink || !btnTriggerEnterCourseEmbed) return;
  seat03AccessLink.scrollIntoView({ behavior: "smooth", block: "center" });
  btnTriggerEnterCourseEmbed.focus({ preventScroll: true });
}

function updateCourseActionButton() {
  if (!btnTriggerEnterCourseEmbed) return;
  if (!currentUser) {
    btnTriggerEnterCourseEmbed.innerHTML = 'Enter Course <i class="bi bi-arrow-right"></i>';
    btnTriggerEnterCourseEmbed.disabled = true;
    btnTriggerEnterCourseEmbed.classList.remove("leave-course-mode");
    return;
  }

  btnTriggerEnterCourseEmbed.disabled = false;
  if (currentUser.inCourse) {
    btnTriggerEnterCourseEmbed.innerHTML = 'Leave Course <i class="bi bi-box-arrow-left"></i>';
    btnTriggerEnterCourseEmbed.classList.add("leave-course-mode");
  } else {
    btnTriggerEnterCourseEmbed.innerHTML = 'Enter Course <i class="bi bi-arrow-right"></i>';
    btnTriggerEnterCourseEmbed.classList.remove("leave-course-mode");
  }
}

async function leaveCourse(auto = false, reason = "manual-course-leave", opts = {}) {
  const { silent = false, skipConfirm = false, allowDuringTeardown = false, suppressAttendanceLog = false } = opts;
  if (!currentUser || !currentUser.inCourse || (isSessionTeardownInProgress && !allowDuringTeardown)) return false;

  if (!auto && !skipConfirm) {
    return new Promise((resolve) => {
      openConfirmationModal(
        "Leave Course",
        "Are you sure you want to leave this course?",
        async () => {
          const result = await leaveCourse(false, reason, { silent: false, skipConfirm: true });
          resolve(result);
        },
        () => resolve(false)
      );
    });
  }

  const activeCourseName = currentUser.activeCourseName || "Full Stack AI Engineer";
  const courseStartTime = currentUser.courseEnteredAt || Date.now();
  currentUser.inCourse = false;
  currentUser.activeCourseName = "";
  currentUser.courseEnteredAt = 0;
  currentUser.lastSeen = Date.now();
  currentUser.heartbeatAt = Date.now();
  const code = currentUser.code;
  const id = currentUser.id;
  const sessionToken = currentSessionToken;
  const leaveTime = Date.now();

  if (currentCourseSessionId) {
    await finalizeActiveCourseSession(auto ? "terminated" : reason, courseStartTime);
  }

  await db.ref(`seatLeases/${code}`).transaction((current) => {
    if (!current || (current.sessionToken && current.sessionToken !== sessionToken)) {
      return current;
    }
    return {
      ...current,
      inCourse: false,
      activeCourseName: "",
      courseEnteredAt: 0,
      lastSeen: leaveTime,
      heartbeatAt: leaveTime
    };
  }).catch(() => {});

  await db.ref(`onlineUsers/${id}`).update({
    inCourse: false,
    activeCourseName: "",
    courseEnteredAt: 0,
    lastSeen: leaveTime,
    heartbeatAt: leaveTime
  }).catch(() => {});

  await db.ref(`seats/${code}`).update({
    inCourse: false,
    activeCourseName: "",
    courseEnteredAt: 0,
    lastSeen: leaveTime,
    heartbeatAt: leaveTime
  }).catch(() => {});

  if (!suppressAttendanceLog) {
    db.ref("attendance").push({
      name: currentUser.name,
      code,
      action: auto ? "terminated" : "course-leave",
      time: leaveTime,
      sessionDuration: Math.max(0, leaveTime - (currentUser.start || leaveTime)),
      reason: auto ? "stale-session-sweep" : reason,
      courseName: activeCourseName
    });
  }

  if (!silent) {
    toast("You left the course successfully.", "success");
  }

  updateCourseActionButton();
  setStatusText(true, code, currentUser.name);
  focusDefaultCourseAction();
  return true;
}

async function finalizeActiveCourseSession(reason = "leave", startOverride = null) {
  if (!currentUser || !currentCourseSessionId) return;
  const endTime = Date.now();
  const startTime = getSafeTimestamp(startOverride || currentUser.courseEnteredAt, endTime);
  const duration = Math.max(0, endTime - startTime);
  await db.ref(`${COURSE_SESSION_COLLECTION}/${currentCourseSessionId}`).update({
    end: endTime,
    duration,
    status: reason,
    endLabel: formatClockDateTime(endTime)
  }).catch(() => {});
  currentCourseSessionId = null;
}

function buildRoomSessionsFromAttendance(events) {
  const openSessions = {};
  const sessions = [];
  events.forEach(event => {
    if (!event || !event.time) return;
    if (event.action === 'join') {
      openSessions[event.code] = { name: event.name, code: event.code, start: event.time };
      return;
    }
    if (String(event.action || '').startsWith('leave') || String(event.action || '').includes('expired') || String(event.action || '').includes('terminated')) {
      const open = openSessions[event.code];
      if (open) {
        sessions.push({ ...open, end: event.time, duration: Math.min(SESSION_LIMIT, Math.max(0, event.time - open.start)), action: event.action });
        delete openSessions[event.code];
      }
    }
  });
  return sessions;
}

function buildCourseSessions(events, presenceMap = {}, now = Date.now()) {
  return events
    .filter(Boolean)
    .map(item => {
      const start = item.start || item.time || 0;
      let end = item.end || 0;
      let status = item.status || 'active';
      const code = item.code || '--';
      const isFresh = !!presenceMap?.[code]?.fresh;

      if ((!end || end <= 0 || status === 'active') && !isFresh) {
        end = end || now;
        status = 'terminated';
      }

      const computedDuration = Math.max(0, (end || now) - start);
      const duration = Math.min(SESSION_LIMIT, computedDuration);

      return {
        id: item.id,
        name: item.name || 'Unknown',
        code,
        start,
        end,
        duration,
        courseName: item.courseName || item.activeCourseName || 'Full Stack AI Engineer',
        status,
        startLabel: item.startLabel || formatClockDateTime(start),
        endLabel: item.endLabel || (end ? formatClockDateTime(end) : '—')
      };
    })
    .sort((a, b) => b.start - a.start);
}

function formatAttendanceActionLabel(event) {
  const name = escapeHtml(event.name || 'Unknown');
  const code = escapeHtml(event.code || '--');
  const nameHtml = `<strong class="clean-att-name">${name}</strong>`;
  const seatHtml = `<span class="clean-att-seat-pill">Seat ${code}</span>`;
  const timeStr = formatClockDateTime(event.time || Date.now());
  let body = '';
  let icon = 'bi-clock';
  let iconClass = 'icon-leave';

  if (event.action === 'join') {
    icon = 'bi-box-arrow-in-right';
    iconClass = 'icon-join';
    body = `${nameHtml} checked into workspace slot ${seatHtml}`;
  } else if (event.action === 'course-enter') {
    icon = 'bi-mortarboard-fill';
    iconClass = 'icon-join';
    body = `${nameHtml} entered the course ${seatHtml}`;
  } else if (event.action === 'course-leave') {
    icon = 'bi-laptop';
    iconClass = 'icon-leave';
    const durationText = event.sessionDuration ? formatSessionDuration(event.sessionDuration) : '0m';
    body = `${nameHtml} left the course ${seatHtml} <span class="clean-att-duration-pill">${durationText}</span>`;
  } else if (event.action === 'hand-raise') {
    icon = 'bi-hand-index-thumb';
    iconClass = 'icon-hand-raise';
    body = `${nameHtml} raised hand ✋ ${seatHtml}`;
  } else if (event.action === 'hand-lower') {
    icon = 'bi-hand-index-thumb';
    iconClass = 'icon-hand-lower';
    body = `${nameHtml} lowered hand ✋ ${seatHtml}`;
  } else if (event.action === 'leave' || event.action === 'terminated') {
    const isAutoEx = String(event.action || '').includes('expired') || String(event.reason || '').includes('page-close') || String(event.reason || '').includes('tab-closed') || String(event.reason || '').includes('removed') || String(event.reason || '').includes('auto-synced');
    icon = isAutoEx ? 'bi-box-arrow-left' : 'bi-box-arrow-left';
    iconClass = 'icon-leave';
    body = `${nameHtml} left the room ${seatHtml}`;
    if (event.reason) {
      body += ` <span class="clean-att-duration-pill">${escapeHtml(event.reason)}</span>`;
    }
  } else {
    const isAutoEx = String(event.action || '').includes('expired') || String(event.reason || '').includes('page-close') || String(event.reason || '').includes('tab-closed') || String(event.reason || '').includes('removed') || String(event.reason || '').includes('auto-synced');
    icon = isAutoEx ? 'bi-hourglass-bottom' : 'bi-box-arrow-left';
    iconClass = 'icon-leave';
    body = `${nameHtml} left the room ${seatHtml}`;
    if (event.reason) {
      body += ` <span class="clean-att-duration-pill">${escapeHtml(event.reason)}</span>`;
    }
  }

  return { body, icon, iconClass, timeStr };
}

function renderAttendanceRow(event) {
  const rowBlock = document.createElement("div");
  rowBlock.className = "clean-attendance-row";
  const data = formatAttendanceActionLabel(event);
  rowBlock.innerHTML = `
    <div class="clean-att-left flex-alignment-gap">
      <div class="clean-att-icon ${data.iconClass}"><i class="bi ${data.icon}"></i></div>
      <div>${data.body}</div>
    </div>
    <div class="clean-att-time"><i class="bi bi-clock"></i> ${data.timeStr}</div>
  `;
  return rowBlock;
}

function renderAttendanceRows(targetEl, events, limit) {
  if (!targetEl) return;
  targetEl.innerHTML = '';
  events
    .slice()
    .sort((a, b) => (b.time || 0) - (a.time || 0))
    .slice(0, limit)
    .forEach(event => targetEl.appendChild(renderAttendanceRow(event)));
}

async function refreshAttendanceViews(options = {}) {
  const { silentReportRefresh = false } = options;
  try {
    const [attendanceSnap, seatsSnap] = await Promise.all([
      db.ref('attendance').get(),
      db.ref('seats').get()
    ]);
    const presenceMap = getPresenceMapFromSeatsSnapshot(seatsSnap.val() || {});
    const rawEvents = Object.values(attendanceSnap.val() || {});
    activeAttendanceEventsCache = buildResolvedAttendanceEvents(rawEvents, presenceMap);
    renderAttendanceRows(attendanceList, activeAttendanceEventsCache, liveAttendanceLogLimit);

    if (attendanceReportModalOverlay && !attendanceReportModalOverlay.classList.contains('hidden')) {
      await renderAttendanceReportModal({ silent: silentReportRefresh });
    }
  } catch (_) {}
}

function aggregateTopUsers(sessionList) {
  const map = new Map();
  sessionList.forEach(session => {
    const key = session.code;
    const prev = map.get(key) || { name: session.name, code: session.code, totalMs: 0, sessions: 0 };
    prev.totalMs += session.duration || 0;
    prev.sessions += 1;
    map.set(key, prev);
  });
  return [...map.values()].sort((a, b) => b.totalMs - a.totalMs);
}

async function renderAttendanceReportModal(options = {}) {
  if (!attendanceReportModalOverlay) return;
  const isSilent = !!options.silent;
  if (!isSilent) {
    attendanceReportSessionsList.innerHTML = '<div style="padding:12px; color:var(--text-secondary); font-size:12px;">Loading attendance report...</div>';
    attendanceReportTopUsersList.innerHTML = '';
    attendanceReportSummaryGrid.innerHTML = '';
  }

  const [attendanceSnap, courseSnap, seatsSnap] = await Promise.all([
    db.ref('attendance').get(),
    db.ref(COURSE_SESSION_COLLECTION).get(),
    db.ref('seats').get()
  ]);

  const presenceMap = getPresenceMapFromSeatsSnapshot(seatsSnap.val() || {});
  const rawAttendanceEvents = Object.values(attendanceSnap.val() || {}).sort((a, b) => (a.time || 0) - (b.time || 0));
  const attendanceEvents = buildResolvedAttendanceEvents(rawAttendanceEvents, presenceMap);
  const roomSessions = buildRoomSessionsFromAttendance(attendanceEvents);
  const courseSessions = buildCourseSessions(Object.values(courseSnap.val() || {}), presenceMap);

  const range = activeAttendanceReportRange;
  const userFilter = activeAttendanceReportUser;
  const limitValue = activeAttendanceReportLimit === 'all' ? Infinity : Math.max(1, parseInt(activeAttendanceReportLimit || 20, 10));
  const seatMatch = (item) => userFilter === 'all' || item.code === userFilter || item.name === userFilter;

  const filteredRoomSessions = roomSessions.filter(item => isTimestampInSelectedRange(item.start, range) && seatMatch(item));
  const filteredCourseSessions = courseSessions.filter(item => isTimestampInSelectedRange(item.start, range) && seatMatch(item));

  const limitedRoomSessions = Number.isFinite(limitValue) ? filteredRoomSessions.slice(0, limitValue) : filteredRoomSessions;
  const limitedCourseSessions = Number.isFinite(limitValue) ? filteredCourseSessions.slice(0, limitValue) : filteredCourseSessions;

  const roomRank = aggregateTopUsers(filteredRoomSessions);
  const courseRank = aggregateTopUsers(filteredCourseSessions);

  const totalRoomMs = filteredRoomSessions.reduce((sum, s) => sum + Math.min(SESSION_LIMIT, Math.max(0, s.duration || 0)), 0);
  const totalCourseMs = filteredCourseSessions.reduce((sum, s) => sum + Math.min(SESSION_LIMIT, Math.max(0, s.duration || 0)), 0);
  const totalJoinEvents = attendanceEvents.filter(e => e.action === 'join' && isTimestampInSelectedRange(e.time || 0, range) && seatMatch(e)).length;
  const totalCourseEnterEvents = attendanceEvents.filter(e => e.action === 'course-enter' && isTimestampInSelectedRange(e.time || 0, range) && seatMatch(e)).length;
  const totalRoomLeaveEvents = attendanceEvents.filter(e => (String(e.action || '').startsWith('leave') || String(e.action || '').includes('terminated') || String(e.action || '').includes('expired')) && isTimestampInSelectedRange(e.time || 0, range) && seatMatch(e)).length;
  const totalCourseLeaveEvents = attendanceEvents.filter(e => e.action === 'course-leave' && isTimestampInSelectedRange(e.time || 0, range) && seatMatch(e)).length;
  const bestRoomUser = roomRank[0];
  const bestCourseUser = courseRank[0];

  attendanceReportSummaryGrid.innerHTML = `
    <div class="report-summary-card"><span>Total room time</span><strong>${formatSessionDuration(totalRoomMs)}</strong></div>
    <div class="report-summary-card"><span>Total course time</span><strong>${formatSessionDuration(totalCourseMs)}</strong></div>
    <div class="report-summary-card"><span>Join events</span><strong>${totalJoinEvents}</strong></div>
    <div class="report-summary-card"><span>Course entered</span><strong>${totalCourseEnterEvents}</strong></div>
    <div class="report-summary-card"><span>Room left/terminated</span><strong>${totalRoomLeaveEvents}</strong></div>
    <div class="report-summary-card"><span>Course left</span><strong>${totalCourseLeaveEvents}</strong></div>
    <div class="report-summary-card"><span>Best room user</span><strong>${bestRoomUser ? `${escapeHtml(bestRoomUser.name)} (${formatSessionDuration(bestRoomUser.totalMs)})` : 'No data'}</strong></div>
    <div class="report-summary-card"><span>Best course user</span><strong>${bestCourseUser ? `${escapeHtml(bestCourseUser.name)} (${formatSessionDuration(bestCourseUser.totalMs)})` : 'No data'}</strong></div>
  `;

  if (courseSessions.length === 0 && roomSessions.length === 0) {
    attendanceReportSessionsList.innerHTML = '<div style="text-align:center; color:var(--text-secondary); font-size:12px; padding:12px;">No attendance history found in this filter.</div>';
  } else {
    const rows = [];
    limitedCourseSessions.forEach(session => {
      rows.push(`
        <div class="report-session-row">
          <div>
            <div class="report-session-title">${escapeHtml(session.name)} <span class="report-session-seat">Seat ${escapeHtml(session.code)}</span></div>
            <div class="report-session-sub">Course: ${escapeHtml(session.courseName)} • ${session.startLabel} → ${session.end ? session.endLabel : 'Active'} • Total time: ${formatSessionDuration(session.duration || (Date.now() - session.start))}</div>
          </div>
          <span class="report-session-pill course">Course</span>
        </div>
      `);
    });
    limitedRoomSessions.forEach(session => {
      rows.push(`
        <div class="report-session-row">
          <div>
            <div class="report-session-title">${escapeHtml(session.name)} <span class="report-session-seat">Seat ${escapeHtml(session.code)}</span></div>
            <div class="report-session-sub">Room: ${formatClockDateTime(session.start)} → ${formatClockDateTime(session.end)} • Total time: ${formatSessionDuration(session.duration)}</div>
          </div>
          <span class="report-session-pill room">Room</span>
        </div>
      `);
    });
    attendanceReportSessionsList.innerHTML = rows.join('') || '<div style="text-align:center; color:var(--text-secondary); font-size:12px; padding:12px;">No rows for the selected filter.</div>';
  }

  const rankHtml = [];
  const rankSource = courseRank.length ? courseRank : roomRank;
  rankSource.slice(0, 10).forEach((user, index) => {
    rankHtml.push(`
      <div class="report-rank-row">
        <div class="report-rank-index">#${index + 1}</div>
        <div class="report-rank-name">${escapeHtml(user.name)} <span>Seat ${escapeHtml(user.code)}</span></div>
        <div class="report-rank-ms">${formatSessionDuration(user.totalMs)}</div>
      </div>
    `);
  });
  attendanceReportTopUsersList.innerHTML = rankHtml.join('') || '<div style="text-align:center; color:var(--text-secondary); font-size:12px; padding:12px;">No ranking data yet.</div>';

  window.__lastAttendanceReportData = {
    range,
    userFilter,
    totalRoomMs,
    totalCourseMs,
    totalJoinEvents,
    totalCourseEnterEvents,
    totalRoomLeaveEvents,
    totalCourseLeaveEvents,
    roomSessions: limitedRoomSessions,
    courseSessions: limitedCourseSessions,
    topUsers: rankSource.slice(0, 10)
  };

  return window.__lastAttendanceReportData;
}

function openAttendanceReportModal(mode = 'admin') {
  if (!currentUser && !isAdminAuthenticated) {
    toast('Please join the room first to view reports.', 'warning');
    return;
  }

  attendanceReportModalOverlay.classList.remove('hidden');
  if (attendanceReportRangeSelect) attendanceReportRangeSelect.value = 'today';
  if (attendanceReportUserSelect) {
    if (mode === 'user' && currentUser) {
      attendanceReportUserSelect.innerHTML = `<option value="${currentUser.code}" selected>${escapeHtml(currentUser.name)} (Seat ${escapeHtml(currentUser.code)})</option>`;
      attendanceReportUserSelect.value = currentUser.code;
      attendanceReportUserSelect.disabled = true;
      attendanceReportUserSelect.setAttribute('aria-readonly', 'true');
    } else {
      attendanceReportUserSelect.innerHTML = `
        <option value="all" selected>All Users</option>
        <option value="01">Eng Abuukar</option>
        <option value="02">Eng Osman</option>
        <option value="03">Eng Zaki</option>
        <option value="04">Eng Abdi</option>
        <option value="05">Eng Hassan</option>
      `;
      attendanceReportUserSelect.value = 'all';
      attendanceReportUserSelect.disabled = false;
      attendanceReportUserSelect.removeAttribute('aria-readonly');
    }
  }
  if (attendanceReportLimitSelect) attendanceReportLimitSelect.value = mode === 'user' ? '10' : '20';
  activeAttendanceReportRange = 'today';
  activeAttendanceReportUser = mode === 'user' && currentUser ? currentUser.code : 'all';
  activeAttendanceReportLimit = mode === 'user' ? '10' : '20';
  renderAttendanceReportModal();
}

function closeAttendanceReportModal() {
  attendanceReportModalOverlay.classList.add('hidden');
  if (attendanceReportUserSelect) {
    attendanceReportUserSelect.disabled = false;
    attendanceReportUserSelect.removeAttribute('aria-readonly');
  }
}

function escapePdfText(text) {
  return String(text || '')
    .split('\\').join('\\\\')
    .split('(').join('\\(')
    .split(')').join('\\)');
}

function buildPdfPages(lines) {
  const NL = String.fromCharCode(10);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 34;
  const contentWidth = pageWidth - margin * 2;
  const pageItems = [];

  const maxRows = 24;
  for (let i = 0; i < lines.length; i += maxRows) {
    pageItems.push(lines.slice(i, i + maxRows));
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const fontObj = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldFontObj = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const contentIndexes = [];

  const esc = escapePdfText;

  pageItems.forEach((pageLines, pageIndex) => {
    const c = [];
    const pushText = (x, y, size, text, bold = false, rgb = [0.16, 0.22, 0.35]) => {
      c.push('BT');
      c.push(`${bold ? '/F2' : '/F1'} ${size} Tf`);
      c.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg`);
      c.push(`${x} ${y} Td`);
      c.push(`(${esc(text)}) Tj`);
      c.push('ET');
    };
    const drawRect = (x, y, w, h, rgb) => {
      c.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg`);
      c.push(`${x} ${y} ${w} ${h} re f`);
    };

    let y = pageHeight - margin - 18;
    // Header band
    drawRect(margin, pageHeight - 72, contentWidth, 34, [0.08, 0.18, 0.45]);
    pushText(margin + 14, pageHeight - 50, 16, 'Study Room Pro', true, [1, 1, 1]);
    pushText(pageWidth - margin - 160, pageHeight - 50, 10, `Page ${pageIndex + 1}`, true, [0.86, 0.92, 1]);
    y -= 26;

    pageLines.forEach((line, idx) => {
      const trimmed = String(line || '').trim();
      if (!trimmed) {
        y -= 8;
        return;
      }

      if (trimmed === 'Attendance & Course Report') {
        pushText(margin, y, 14, trimmed, true, [0.08, 0.18, 0.45]);
        y -= 18;
        return;
      }

      if (trimmed === 'Top users' || trimmed === 'Course sessions' || trimmed === 'Room sessions') {
        drawRect(margin, y - 4, contentWidth, 16, [0.15, 0.47, 0.96]);
        pushText(margin + 8, y + 7, 10, trimmed.toUpperCase(), true, [1, 1, 1]);
        y -= 22;
        return;
      }

      const isTableRow = trimmed.includes(' | ');
      if (isTableRow) {
        const bg = idx % 2 === 0 ? [0.95, 0.97, 1] : [0.91, 0.94, 0.99];
        drawRect(margin, y - 5, contentWidth, 18, bg);
        const textColor = trimmed.startsWith('Room |') ? [0.10, 0.55, 0.28] : trimmed.startsWith('Course |') ? [0.15, 0.32, 0.70] : [0.15, 0.17, 0.22];
        pushText(margin + 8, y + 6, 9.8, trimmed, false, textColor);
        y -= 20;
        return;
      }

      const titleLike = trimmed === 'Study Room Pro' || trimmed.startsWith('Range:') || trimmed.startsWith('User:') || trimmed.startsWith('Generated:') || trimmed.startsWith('Total ') || trimmed.startsWith('Join events:') || trimmed.startsWith('Course entered:') || trimmed.startsWith('Room left/terminated:') || trimmed.startsWith('Course left:');
      if (titleLike) {
        pushText(margin, y, trimmed === 'Study Room Pro' ? 13 : 10, trimmed, trimmed === 'Study Room Pro' || trimmed.startsWith('Total '), trimmed.startsWith('Total ') ? [0.08, 0.18, 0.45] : [0.18, 0.22, 0.28]);
        y -= trimmed.startsWith('Total ') ? 16 : 14;
        return;
      }

      pushText(margin, y, 9.6, trimmed, false, [0.18, 0.22, 0.28]);
      y -= 13;
    });

    const content = c.join(NL);
    contentIndexes.push(addObject(`<< /Length ${content.length} >>${NL}stream${NL}${content}${NL}endstream`));
  });

  const pagesObj = addObject('<< /Type /Pages /Kids [] /Count 0 >>');
  const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);
  const pageIndexes = [];
  pageItems.forEach((_, idx) => {
    pageIndexes.push(addObject(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObj} 0 R /F2 ${boldFontObj} 0 R >> >> /Contents ${contentIndexes[idx]} 0 R >>`));
  });
  objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageIndexes.map(n => `${n} 0 R`).join(' ')}] /Count ${pageIndexes.length} >>`;

  let pdf = '%PDF-1.4' + NL;
  const offsets = [0];
  objects.forEach((obj, idx) => {
    offsets.push(pdf.length);
    pdf += `${idx + 1} 0 obj${NL}${obj}${NL}endobj${NL}`;
  });
  const xrefPos = pdf.length;
  pdf += `xref${NL}0 ${objects.length + 1}${NL}0000000000 65535 f ${NL}`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n ${NL}`;
  }
  pdf += `trailer${NL}<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R >>${NL}startxref${NL}${xrefPos}${NL}%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

function buildAttendancePdfLines() {
  const report = window.__lastAttendanceReportData || {};
  const rangeLabel = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year"
  }[activeAttendanceReportRange] || activeAttendanceReportRange;
  const userLabel = activeAttendanceReportUser === "all" ? "All Users" : `Seat ${activeAttendanceReportUser}`;

  const lines = [
    'Study Room Pro',
    'Attendance & Course Report',
    `Range: ${rangeLabel}`,
    `User: ${userLabel}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    `Total room time: ${formatSessionDuration(report.totalRoomMs || 0)}`,
    `Total course time: ${formatSessionDuration(report.totalCourseMs || 0)}`,
    `Join events: ${report.totalJoinEvents || 0}`,
    `Course entered: ${report.totalCourseEnterEvents || 0}`,
    `Room left/terminated: ${report.totalRoomLeaveEvents || 0}`,
    `Course left: ${report.totalCourseLeaveEvents || 0}`,
    '',
    'Top users'
  ];
  (report.topUsers || []).forEach((u, idx) => {
    lines.push(`${String(idx + 1).padStart(2, '0')}. ${u.name} | Seat ${u.code} | ${formatSessionDuration(u.totalMs || 0)}`);
  });
  lines.push('', 'Course sessions');
  (report.courseSessions || []).forEach(s => {
    lines.push(`Course | ${s.name} | Seat ${s.code} | ${s.startLabel} -> ${s.end ? s.endLabel : 'Active'} | ${formatSessionDuration(s.duration || 0)}`);
  });
  lines.push('', 'Room sessions');
  (report.roomSessions || []).forEach(s => {
    lines.push(`Room | ${s.name} | Seat ${s.code} | ${formatClockDateTime(s.start)} -> ${formatClockDateTime(s.end)} | ${formatSessionDuration(s.duration || 0)}`);
  });
  return lines;
}

function downloadAttendanceReportPdf() {
  if (!window.__lastAttendanceReportData) {
    renderAttendanceReportModal().then(() => downloadAttendanceReportPdf());
    return;
  }
  const blob = buildPdfPages(buildAttendancePdfLines());
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-room-attendance-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function sweepStaleSessions() {
  try {
    const seatsSnap = await db.ref("seats").get();
    const seats = seatsSnap.val() || {};
    for (const [code, seatData] of Object.entries(seats)) {
      if (!seatData || !seatData.sessionToken) continue;
      if ((isPresenceFresh(seatData) || seatData.exitLoggedAt) && !isSessionOverLimit(seatData)) continue;
      await closeStalePresenceSession({ ...seatData, code });
    }
  } catch (_) {}
}

function startAttendanceAutoRefresh() {
  if (attendanceRefreshInterval) clearInterval(attendanceRefreshInterval);
  attendanceRefreshInterval = setInterval(() => {
    if (!currentUser && !isAdminAuthenticated) return;
    if (!attendanceContent || !attendanceReportModalOverlay) return;
    const attendanceOpen = !attendanceContent.classList.contains('hidden');
    const reportOpen = !attendanceReportModalOverlay.classList.contains('hidden');
    if (attendanceOpen || reportOpen) refreshAttendanceViews({ silentReportRefresh: true });
  }, ATTENDANCE_REFRESH_INTERVAL_MS);
}

function startStaleSessionMonitor() {
  if (staleSessionMonitorInterval) clearInterval(staleSessionMonitorInterval);
  staleSessionMonitorInterval = setInterval(() => {
    sweepStaleSessions();
  }, STALE_SESSION_SWEEP_INTERVAL_MS);
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

function getSafeTimestamp(value, fallback = Date.now()) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isSessionOverLimit(sessionData, now = Date.now()) {
  if (!sessionData) return false;
  const startCandidates = [
    sessionData.courseEnteredAt,
    sessionData.start,
    sessionData.heartbeatAt,
    sessionData.lastSeen
  ];
  const safeStart = startCandidates.map(v => Number(v)).find(v => Number.isFinite(v) && v > 0);
  if (!safeStart) return false;
  return (now - safeStart) >= SESSION_LIMIT;
}

function getElapsedSessionMs(startTimestamp, now = Date.now()) {
  const safeStart = getSafeTimestamp(startTimestamp, now);
  return Math.max(0, now - safeStart);
}

function getVisibleElapsedSessionMs(startTimestamp, now = Date.now()) {
  return Math.max(MIN_VISIBLE_SESSION_MS, getElapsedSessionMs(startTimestamp, now));
}

function scheduleSessionAutoExpiry() {
  clearTimeout(autoRemovalTimeoutInstance);
  if (!currentUser) return;

  const elapsed = getElapsedSessionMs(currentUser.start);
  const remaining = SESSION_LIMIT - elapsed;

  if (remaining <= 0) {
    autoRemovalTimeoutInstance = setTimeout(() => {
      leaveRoom(true, "session-expired");
    }, 0);
    return;
  }

  autoRemovalTimeoutInstance = setTimeout(() => {
    leaveRoom(true, "session-expired");
  }, remaining);
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
      historicalMs += getElapsedSessionMs(currentUser.start);
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
    if (leaveBtn) leaveBtn.classList.remove("hidden");
    if (btnOpenAttendanceReportModal) btnOpenAttendanceReportModal.classList.remove("hidden");

    lblPremiumUserName.innerText = name;
    lblPremiumUserSeat.innerText = `Seat Assignment: ${seat}`;
    premiumUserCard.classList.remove("hidden");

    updateCourseActionButton();
    initiateDynamicPremiumRotator(name);
  } else {
    userStatus.innerHTML = `<i class="bi bi-dash-circle"></i> Not joined`;
    userStatus.className = "status-badge";
    seat03AccessLink.classList.add("hidden");
    if (leaveBtn) leaveBtn.classList.add("hidden");
    if (btnOpenAttendanceReportModal) btnOpenAttendanceReportModal.classList.add("hidden");
    premiumUserCard.classList.add("hidden");
    if (btnTriggerEnterCourseEmbed) {
      btnTriggerEnterCourseEmbed.innerHTML = 'Enter Course <i class="bi bi-arrow-right"></i>';
      btnTriggerEnterCourseEmbed.disabled = true;
      btnTriggerEnterCourseEmbed.classList.remove("leave-course-mode");
    }
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
  if (snap.exists() && isPresenceFresh(snap.val())) {
    toast("Resource collision: Seat node is already occupied.", "error");
    return;
  }

  const leaseRef = db.ref(`seatLeases/${normalizedCode}`);
  const leaseSnap = await leaseRef.get();
  if (leaseSnap.exists() && isLeaseFresh(leaseSnap.val()) && leaseSnap.val().sessionToken !== currentSessionToken) {
    toast("Resource collision: Seat node is already leased by another active session.", "error");
    return;
  }

  const userId = "u_" + Math.random().toString(36).slice(2);
  currentSessionToken = createStableId("sess");
  sessionStorage.setItem("active_session_token", currentSessionToken);
  localStorage.setItem("active_session_token", currentSessionToken);
  currentUser = {
    id: userId,
    name: targetSeat.name,
    code: normalizedCode,
    start: Date.now(),
    inCourse: false,
    courseEnteredAt: 0,
    activeCourseName: "",
    lastSeen: Date.now(),
    heartbeatAt: Date.now(),
    deviceId: currentDeviceId,
    tabId: currentTabId,
    sessionToken: currentSessionToken,
    handRaised: false,
    handRaisedAt: 0
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

  await seatRef.set(currentUser);
  await db.ref("onlineUsers/" + userId).set(currentUser);
  await leaseRef.set({
    seat: normalizedCode,
    name: targetSeat.name,
    ownerId: userId,
    deviceId: currentDeviceId,
    tabId: currentTabId,
    sessionToken: currentSessionToken,
    inCourse: false,
    activeCourseName: "",
    courseEnteredAt: 0,
    start: currentUser.start,
    lastSeen: Date.now(),
    heartbeatAt: Date.now()
  });

  await registerSessionDisconnectHandlers().catch(() => {});

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
  showJoinWelcomePopup(targetSeat.name, normalizedCode);

  startTimer();
  scheduleSessionAutoExpiry();
  startSessionHeartbeat();
  syncPersonalAccumulatedTime(normalizedCode);
  localStorage.setItem("active_user", userId);
  updateCourseActionButton();
  focusDefaultCourseAction();
  renderLessonsUI();
}


async function leaveRoom(auto = false, reason = "leave") {
  if (!currentUser || isSessionTeardownInProgress) return;
  isSessionTeardownInProgress = true;

  try {
    const code = currentUser.code;
    const id = currentUser.id;
    const name = currentUser.name;
    const sessionDuration = getElapsedSessionMs(currentUser.start);
    const liveToken = currentSessionToken;
    const wasInCourse = !!currentUser.inCourse;
    const wasHandRaised = !!currentUser.handRaised;
    const activeCourseName = currentUser.activeCourseName || "Full Stack AI Engineer";

    if (wasHandRaised) {
      currentUser.handRaised = false;
      currentUser.handRaisedAt = 0;
      const loweredPayload = buildPresencePayload({ handRaised: false, handRaisedAt: 0 });
      await Promise.all([
        db.ref(`onlineUsers/${id}`).update(loweredPayload).catch(() => {}),
        db.ref(`seats/${code}`).update(loweredPayload).catch(() => {})
      ]);
      logHandAttendance("hand-lower", code, name, { reason: auto ? "room-leave-auto" : "room-leave" });
    }

    if (wasInCourse) {
      await leaveCourse(true, "room-leave", {
        silent: true,
        skipConfirm: true,
        allowDuringTeardown: true,
        suppressAttendanceLog: true
      });

      db.ref("attendance").push({
        name,
        code,
        action: auto ? "terminated" : "course-leave",
        time: Date.now(),
        sessionDuration: Math.min(SESSION_LIMIT, Math.max(0, sessionDuration)),
        reason: auto ? "room-leave-auto" : "room-leave",
        courseName: activeCourseName
      });
    }

    await cancelSessionDisconnectHandlers(code, id);

    currentUser = null;
    stopTimer();
    stopSessionHeartbeat();

    formBox.classList.remove("hidden");
    pinActionBox.classList.add("hidden");
    leaveBtn.classList.add("hidden");
    setStatusText(false);

    db.ref("seats/" + code).off();
    db.ref("onlineUsers/" + id).off();
    db.ref("seatLeases/" + code).off();

    await db.ref(`weeklyHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
    await db.ref(`dailyHours/${getTodayIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
    await db.ref(`monthlyHours/${getMonthIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration);
    await db.ref(`allTimeHours/${code}`).transaction(v => (v || 0) + sessionDuration);

    await db.ref("seatLeases/" + code).transaction((cur) => {
      if (!cur || (liveToken && cur.sessionToken === liveToken)) return null;
      return cur;
    }).catch(() => {});
    await db.ref("seats/" + code).transaction((cur) => {
      if (!cur || (liveToken && cur.sessionToken === liveToken)) return null;
      return cur;
    }).catch(() => {});
    await db.ref("onlineUsers/" + id).transaction((cur) => {
      if (!cur || (liveToken && cur.sessionToken === liveToken)) return null;
      return cur;
    }).catch(() => {});

    db.ref("attendance").push({
      name: name,
      code: code,
      action: auto ? "terminated" : "leave",
      time: Date.now(),
      sessionDuration,
      start: Date.now() - sessionDuration,
      reason: auto ? "stale-session-sweep" : reason
    });

    toast(auto ? "Session closed after the browser stopped sending heartbeats." : "Workspace link destroyed successfully.", "info");
    clearActiveSessionStorage();
    updateCourseActionButton();
    renderLessonsUI();
  } finally {
    isSessionTeardownInProgress = false;
  }
}


function listenToActiveKicks(userId) {

  db.ref("onlineUsers/" + userId).on("value", (snap) => {
    if (isSessionTeardownInProgress) return;
    if (!snap.exists() && currentUser) {
      leaveRoom(true, "removed");
    }
  });
}

function listenToSeatLease(code) {
  db.ref("seatLeases/" + code).on("value", (snap) => {
    if (isSessionTeardownInProgress) return;
    if (!currentUser) return;
    const lease = snap.val();
    if (!lease || lease.sessionToken !== currentSessionToken) {
      leaveRoom(true, "lease-lost");
    }
  });
}

// ==========================================================================
// COURSE ACCESSIBILITY CONTEXT ENGINE
// ==========================================================================

async function openCourseEmbedWindow() {
  if (!currentUser) return;
  if (currentUser.inCourse) {
    toast("You are already in course mode.", "warning");
    return;
  }

  if (isSessionOverLimit(currentUser)) {
    await leaveRoom(true, "session-expired");
    return;
  }

  const [leaseSnap, seatSnap] = await Promise.all([
    db.ref("seatLeases").get(),
    db.ref("seats").get()
  ]);
  let currentOccupantName = "";
  let currentOccupantSeat = "";
  let courseOccupied = false;

  const inspectOccupants = (snapshot) => {
    if (!snapshot || !snapshot.exists()) return;
    Object.values(snapshot.val() || {}).forEach(u => {
      if (courseOccupied) return;
      if (u.inCourse && u.ownerId !== currentUser.id && isLeaseFresh(u) && !isSessionOverLimit(u)) {
        courseOccupied = true;
        currentOccupantName = u.name;
        currentOccupantSeat = u.seat || u.code;
      }
    });
  };

  inspectOccupants(leaseSnap);
  inspectOccupants(seatSnap);

  if (courseOccupied) {
    toast(`CRITICAL RISK ACCESS ERROR: Course resource currently claimed by ${currentOccupantName} (Seat ${currentOccupantSeat})!`, "danger-alert-occupied");
    triggerTitleDangerAlert("🚨 DANGER ALERT", "⚠️ WORKSPACE COLLISION");
    return;
  }

  currentUser.inCourse = true;
  currentUser.activeCourseName = "Full Stack AI Engineer";
  currentUser.courseEnteredAt = Date.now();
  currentUser.lastSeen = Date.now();
  currentUser.heartbeatAt = Date.now();
  currentCourseSessionId = db.ref(COURSE_SESSION_COLLECTION).push().key;
  await db.ref(`seatLeases/${currentUser.code}`).transaction((current) => {
    if (current && current.sessionToken && current.sessionToken !== currentSessionToken) {
      return;
    }
    return {
      seat: currentUser.code,
      name: currentUser.name,
      ownerId: currentUser.id,
      deviceId: currentDeviceId,
      tabId: currentTabId,
      sessionToken: currentSessionToken,
      inCourse: true,
      activeCourseName: currentUser.activeCourseName,
      courseEnteredAt: currentUser.courseEnteredAt,
      start: currentUser.start,
      lastSeen: Date.now(),
      heartbeatAt: Date.now()
    };
  });

  await db.ref(`${COURSE_SESSION_COLLECTION}/${currentCourseSessionId}`).set({
    name: currentUser.name,
    code: currentUser.code,
    courseName: currentUser.activeCourseName,
    start: currentUser.courseEnteredAt,
    startLabel: formatClockDateTime(currentUser.courseEnteredAt),
    end: 0,
    duration: 0,
    status: "active"
  });

  await db.ref("onlineUsers/" + currentUser.id).update({
    inCourse: true,
    activeCourseName: currentUser.activeCourseName,
    courseEnteredAt: currentUser.courseEnteredAt,
    lastSeen: currentUser.lastSeen,
    heartbeatAt: currentUser.heartbeatAt
  });

  await db.ref("seats/" + currentUser.code).update({
    inCourse: true,
    activeCourseName: currentUser.activeCourseName,
    courseEnteredAt: currentUser.courseEnteredAt,
    lastSeen: currentUser.lastSeen,
    heartbeatAt: currentUser.heartbeatAt
  });

  db.ref("attendance").push({
    name: currentUser.name,
    code: currentUser.code,
    action: "course-enter",
    time: Date.now(),
    courseName: currentUser.activeCourseName
  });

  startSessionHeartbeat();
  updateCourseActionButton();
  focusDefaultCourseAction();
  renderLessonsUI();
  window.open("https://dugsiiye.com/dashboard/student", "_blank");
}

async function handleCourseActionButtonClick() {
  if (!currentUser) return;
  if (currentUser.inCourse) {
    await leaveCourse(false, "manual-course-leave");
    return;
  }
  await openCourseEmbedWindow();
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

btnTriggerEnterCourseEmbed.addEventListener("click", handleCourseActionButtonClick);

// ==========================================================================
// BROADCAST PANEL CONTROLLER
// ==========================================================================
headerNotificationBellBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = bellNotificationsDropdownPanel.classList.contains("hidden");
  if (isHidden) {
    bellNotificationsDropdownPanel.classList.remove("hidden");
    db.ref("bellUnreadCounts/" + (currentUser ? currentUser.id : (isAdminAuthenticated ? "admin" : "guest"))).set(0);
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
  const idKey = currentUser ? currentUser.id : (isAdminAuthenticated ? "admin" : "guest");
  
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
  if (activePrivateMessagesRef) activePrivateMessagesRef.off();
  
  activeBroadcastsRef = db.ref("broadcastAlerts").orderByChild("timestamp");
  activePrivateMessagesRef = db.ref("privateMessages").orderByChild("timestamp");
  const refreshPanel = () => queueNotificationFeedRefresh();
  activeBroadcastsRef.on("value", refreshPanel);
  activePrivateMessagesRef.on("value", refreshPanel);
  queueNotificationFeedRefresh();
}

window.deleteMessage = function(e, messageId) {
  if (e) e.stopPropagation();
  openConfirmationModal(
    "Delete Alert Message",
    "Are you sure you want to completely delete this message broadcast alert?",
    async () => {
      await db.ref("broadcastAlerts/" + messageId).remove();
      toast("Message deleted successfully!", "success");
      queueNotificationFeedRefresh();
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
    queueNotificationFeedRefresh();
  };
};

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


function logHandAttendance(action, code, name, extras = {}) {
  if (!code || !name) return;
  const reason = extras.reason || (action === "hand-lower" ? "hand-lowered" : "hand-raised");
  db.ref("attendance").push({
    name,
    code,
    action,
    time: Date.now(),
    reason,
    courseName: extras.courseName || ""
  });
}

function refreshRaisedHandsBoard(users = []) {
  if (!raisedHandsList) return;
  const raisedHands = users.filter(u => u && u.handRaised).sort((a, b) => (b.handRaisedAt || 0) - (a.handRaisedAt || 0));

  if (raisedHandsCount) raisedHandsCount.innerText = String(raisedHands.length);
  if (handRaiseBoardTitle) {
    if (raisedHands.length === 0) handRaiseBoardTitle.innerHTML = '<i class="bi bi-hand-index-thumb"></i> Raised Hands';
    else if (raisedHands.length === 1) handRaiseBoardTitle.innerHTML = `${escapeHtml(raisedHands[0].name || 'Student')} Raising hand ✋️`;
    else handRaiseBoardTitle.innerHTML = `<i class="bi bi-hand-index-thumb"></i> ${raisedHands.length} Students Raising hand ✋️`;
  }

  raisedHandsList.innerHTML = '';
  if (raisedHands.length === 0) {
    raisedHandsList.innerHTML = '<div class="raised-hand-empty">No one has raised a hand right now.</div>';
    return;
  }

  raisedHands.forEach(u => {
    const item = document.createElement('div');
    item.className = 'raised-hand-item';
    const sinceLabel = u.handRaisedAt ? new Date(u.handRaisedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '';
    item.innerHTML = `
      <div class="raised-hand-main">
        <div class="raised-hand-emoji">✋</div>
        <div style="min-width:0;">
          <div class="raised-hand-name">${escapeHtml(u.name || 'Unknown')}<span class="hand-raise-pill">Raised</span></div>
          <div class="raised-hand-seat">Seat ${escapeHtml(u.code || '--')}</div>
        </div>
      </div>
      <div class="raised-hand-time">${sinceLabel ? `Since ${sinceLabel}` : 'Just now'}</div>
    `;
    raisedHandsList.appendChild(item);
  });
}

async function toggleMyHandRaise() {
  if (!currentUser) { toast('Claim your seat first before raising your hand.', 'warning'); return; }
  const nextState = !currentUser.handRaised;
  const nextRaisedAt = nextState ? Date.now() : 0;
  currentUser.handRaised = nextState;
  currentUser.handRaisedAt = nextRaisedAt;
  const payload = buildPresencePayload({ handRaised: nextState, handRaisedAt: nextRaisedAt });
  await Promise.all([
    db.ref(`onlineUsers/${currentUser.id}`).update(payload).catch(() => {}),
    db.ref(`seats/${currentUser.code}`).update(payload).catch(() => {})
  ]);
  logHandAttendance(nextState ? "hand-raise" : "hand-lower", currentUser.code, currentUser.name);
  toast(nextState ? 'You raised your hand.' : 'Your hand was lowered.', 'success');
}

function queueNotificationFeedRefresh() {
  clearTimeout(notificationRefreshTimeout);
  notificationRefreshTimeout = setTimeout(() => refreshNotificationFeed(), 50);
}

async function refreshNotificationFeed() {
  if (!bellMessagesListContainer) return;
  const [broadcastSnap, privateSnap] = await Promise.all([
    db.ref('broadcastAlerts').get().catch(() => null),
    db.ref('privateMessages').get().catch(() => null)
  ]);
  const entries = [];
  const broadcasts = broadcastSnap && broadcastSnap.val ? (broadcastSnap.val() || {}) : {};
  Object.keys(broadcasts).forEach(key => entries.push({ id: key, type: 'broadcast', ...broadcasts[key] }));
  const privateMessages = privateSnap && privateSnap.val ? (privateSnap.val() || {}) : {};
  Object.keys(privateMessages).forEach(key => {
    const msg = privateMessages[key] || {};
    const canSee = isAdminAuthenticated || (currentUser && (msg.fromUserId === currentUser.id || msg.toUserId === currentUser.id));
    if (!canSee) return;
    entries.push({ id: key, type: 'private', ...msg });
  });
  entries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const visibleEntries = showAllMessagesFlag ? entries : entries.slice(0, 5);
  bellMessagesListContainer.innerHTML = '';
  if (visibleEntries.length === 0) { bellMessagesListContainer.innerHTML = `<div class="empty-bell-fallback">No notifications found.</div>`; return; }
  visibleEntries.forEach(m => {
    const isOwnMessage = currentUser && currentUser.code === m.seatCode;
    const isMsgFromAdmin = m.seatCode === 'Admin';
    let cardClass = 'bell-msg-item';
    let actionButtons = '';
    if (m.type === 'private') cardClass += ' private-message-card';
    else if (isMsgFromAdmin) cardClass += ' warning-border';
    else cardClass += ' student-broadcast';
    if (m.type === 'broadcast') {
      actionButtons = `<div class="bell-msg-actions">`;
      if (isAdminAuthenticated) {
        if (isMsgFromAdmin) actionButtons += `<a href="javascript:void(0)" onclick="editMessage(event, '${m.id}', '${escapeHtml(m.title)}', '${escapeHtml(m.body)}')" class="text-warning" title="Edit"><i class="bi bi-pencil-square"></i></a>`;
        actionButtons += `<a href="javascript:void(0)" onclick="deleteMessage(event, '${m.id}')" class="text-danger" style="color:var(--color-danger) !important;" title="Delete"><i class="bi bi-trash"></i></a>`;
      } else if (isOwnMessage) {
        actionButtons += `<a href="javascript:void(0)" onclick="deleteMessage(event, '${m.id}')" class="text-danger" style="color:var(--color-danger) !important;" title="Delete"><i class="bi bi-trash"></i></a>`;
      }
      actionButtons += `</div>`;
    }
    const senderLabel = m.type === 'private' ? `${escapeHtml(m.fromName || 'Unknown')} (Seat ${escapeHtml(m.fromSeatCode || '--')})` : `${m.seatCode === 'Admin' ? 'Admin' : 'Seat ' + escapeHtml(m.seatCode || '--')}`;
    const recipientLabel = m.type === 'private' ? `<span class="private-message-tag"><i class="bi bi-send"></i> To ${escapeHtml(m.toName || (m.toSeatCode ? 'Seat ' + m.toSeatCode : 'Admin'))}</span>` : '';
    const timeText = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
    const card = document.createElement('div');
    card.className = cardClass;
    card.innerHTML = `
      <div class="bell-msg-meta">
        <div>
          <span class="bell-msg-sender"><i class="bi bi-hash"></i> ${senderLabel}</span>
          ${recipientLabel}
          <span class="bell-msg-time" style="margin-left:8px;">${timeText}</span>
        </div>
        ${actionButtons}
      </div>
      <h4 class="bell-msg-title" id="title-${m.id}">${escapeHtml(m.title || 'Message')}</h4>
      <p class="bell-msg-body" id="body-${m.id}">${escapeHtml(m.body || '')}</p>
    `;
    bellMessagesListContainer.appendChild(card);
  });
}

btnLoadAllMessagesView.addEventListener("click", (e) => {
  e.stopPropagation();
  showAllMessagesFlag = !showAllMessagesFlag;
  btnLoadAllMessagesView.innerText = showAllMessagesFlag ? "Show Less" : "View All";
  queueNotificationFeedRefresh();
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
  queueNotificationFeedRefresh();
});

// ==========================================================================
// SELECTION POPUP MESSAGING DRIVERS
// ==========================================================================
window.openQuickMessagingModal = async function(targetUserId, targetSeatCode, mode = 'private') {
  if (!currentUser) {
    toast("You must claim a space seat to interact.", "error");
    return;
  }
  
  activeMessageTargetUser = { id: targetUserId, seat: targetSeatCode };
  activeMessageMode = mode === 'global' ? 'global' : 'private';
  
  const todayId = getTodayIdentifier();
  const budgetSnap = await db.ref(`messageBudgets/${todayId}/${currentUser.id}`).get();
  const currentUsed = budgetSnap.val() || 0;
  const remaining = Math.max(0, 3 - currentUsed);

  lblRemainingMsgBudgetCounter.innerText = remaining;
  selectedQuickMessageText = "";
  
  const modalTitleEl = quickStudentMessageModal ? quickStudentMessageModal.querySelector(".modal-header h3") : null;
  const submitBtn = btnSubmitQuickStudentMessage;

  if (activeMessageMode === 'global') {
    if (modalTitleEl) modalTitleEl.innerHTML = '<i class="bi bi-megaphone-fill text-primary"></i> Send Global Alert';
    if (submitBtn) submitBtn.innerText = 'Send Global Alert';
    if (quickMessageRecipientLabel) {
      quickMessageRecipientLabel.innerHTML = `Global status alert for all users`;
    }
  } else {
    if (modalTitleEl) modalTitleEl.innerHTML = '<i class="bi bi-chat-dots-fill text-primary"></i> Send Private Message';
    if (submitBtn) submitBtn.innerText = 'Send Private Message';
    if (quickMessageRecipientLabel) {
      quickMessageRecipientLabel.innerHTML = `Private message to Seat <strong>${escapeHtml(targetSeatCode || '--')}</strong>`;
    }
  }
  
  document.querySelectorAll(".template-msg-pill").forEach(p => p.style.border = "1px solid var(--border-color)");
  
  quickStudentMessageModal.classList.remove("hidden");
};

function closeQuickMessagingModalWindow() {
  quickStudentMessageModal.classList.add("hidden");
  activeMessageTargetUser = null;
  activeMessageMode = "private";
  const modalTitleEl = quickStudentMessageModal ? quickStudentMessageModal.querySelector(".modal-header h3") : null;
  if (modalTitleEl) modalTitleEl.innerHTML = '<i class="bi bi-chat-dots-fill text-primary"></i> Send Quick Status Alert';
  if (btnSubmitQuickStudentMessage) btnSubmitQuickStudentMessage.innerText = 'Send Private Message';
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
  
  if (btnSubmitQuickStudentMessage) {
    btnSubmitQuickStudentMessage.innerText = activeMessageMode === 'global' ? 'Send Global Alert' : 'Send Private Message';
  }
  
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

  const nextBudget = currentUsed + 1;
  const now = Date.now();

  if (activeMessageMode === 'global') {
    const alertPayload = {
      type: 'broadcast',
      title: `Status alert from ${currentUser.name} (Seat ${currentUser.code})`,
      body: selectedQuickMessageText,
      seatCode: currentUser.code,
      timestamp: now
    };

    await db.ref("broadcastAlerts").push(alertPayload);
    await budgetRef.set(nextBudget);

    const usersSnap = await db.ref("onlineUsers").get().catch(() => null);
    if (usersSnap && usersSnap.exists()) {
      Object.keys(usersSnap.val()).forEach(uid => {
        db.ref("bellUnreadCounts/" + uid).transaction(c => (c || 0) + 1);
      });
    }
    db.ref("bellUnreadCounts/guest").transaction(c => (c || 0) + 1);
    db.ref("bellUnreadCounts/admin").transaction(c => (c || 0) + 1);

    closeQuickMessagingModalWindow();
    toast("Global status alert sent successfully.", "success");
    queueNotificationFeedRefresh();
    return;
  }

  const recipientSnap = await db.ref(`onlineUsers/${activeMessageTargetUser.id}`).get().catch(() => null);
  const recipientData = recipientSnap && recipientSnap.val ? (recipientSnap.val() || {}) : {};
  const messagePayload = {
    type: 'private',
    title: `Private message from ${currentUser.name} (Seat ${currentUser.code})`,
    body: selectedQuickMessageText,
    fromUserId: currentUser.id,
    fromName: currentUser.name,
    fromSeatCode: currentUser.code,
    toUserId: activeMessageTargetUser.id,
    toName: recipientData.name || activeMessageTargetUser.seat || 'Admin',
    toSeatCode: activeMessageTargetUser.seat,
    timestamp: now
  };

  await db.ref("privateMessages").push(messagePayload);
  await budgetRef.set(nextBudget);

  const unreadTargets = new Set();
  if (currentUser?.id) unreadTargets.add(currentUser.id);
  if (activeMessageTargetUser.id) unreadTargets.add(activeMessageTargetUser.id);
  unreadTargets.add("admin");

  unreadTargets.forEach(uid => {
    db.ref("bellUnreadCounts/" + uid).transaction(c => (c || 0) + 1);
  });

  closeQuickMessagingModalWindow();
  toast("Private message sent successfully.", "success");
  queueNotificationFeedRefresh();
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
function syncAttendancePanelVisibilityByViewport() {
  if (!attendanceContent || !attendanceChevron) return;
  if (window.innerWidth > 900) {
    attendanceContent.classList.remove("hidden");
    attendanceChevron.classList.add("rotate-180");
  } else {
    attendanceContent.classList.add("hidden");
    attendanceChevron.classList.remove("rotate-180");
  }
}

syncAttendancePanelVisibilityByViewport();

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

function handlePageExit() {}

if (btnOpenAttendanceReportModal) {
  btnOpenAttendanceReportModal.addEventListener('click', () => openAttendanceReportModal(currentUser ? 'user' : 'admin'));
}
if (adminMoreBtn) {
  adminMoreBtn.addEventListener('click', () => openAttendanceReportModal('admin'));
}
if (closeAttendanceReportModalBtn) closeAttendanceReportModalBtn.addEventListener('click', closeAttendanceReportModal);
if (btnDownloadAttendancePdf) btnDownloadAttendancePdf.addEventListener('click', downloadAttendanceReportPdf);
if (attendanceReportModalOverlay) {
  attendanceReportModalOverlay.addEventListener('click', (e) => {
    if (e.target === attendanceReportModalOverlay) closeAttendanceReportModal();
  });
}
[attendanceReportRangeSelect, attendanceReportUserSelect, attendanceReportLimitSelect].forEach(el => {
  if (el) {
    el.addEventListener("change", () => {
      if (el === attendanceReportRangeSelect) activeAttendanceReportRange = el.value;
      if (el === attendanceReportUserSelect) activeAttendanceReportUser = el.value;
      if (el === attendanceReportLimitSelect) activeAttendanceReportLimit = el.value;
      renderAttendanceReportModal();
    });
  }
});

if (attendanceLogLimitSelect) {
  attendanceLogLimitSelect.value = String(liveAttendanceLogLimit);
  attendanceLogLimitSelect.addEventListener("change", () => {
    liveAttendanceLogLimit = Math.max(5, parseInt(attendanceLogLimitSelect.value || "5", 10));
    localStorage.setItem("attendance_log_limit", String(liveAttendanceLogLimit));
    if (activeAttendanceEventsCache.length) renderAttendanceRows(attendanceList, activeAttendanceEventsCache, liveAttendanceLogLimit);
  });
}

function initRealtimeDatabaseListeners() {
  db.ref("seats").on("value", (snap) => {
    const activeSeats = snap.val() || {};
    const freshSeats = Object.values(activeSeats).filter(u => isPresenceFresh(u));
    let count = freshSeats.length;
    onlineCount.innerText = count;
    onlineCount.classList.toggle("counter-online", count > 0);
    onlineCount.classList.toggle("counter-offline", count === 0);

    let isOccupied = false;
    let userCourseName = "";
    let occupantSeatLabel = "";
    let entryTimestamp = 0;

    freshSeats.forEach(u => {
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
    const freshUsers = Object.values(users).filter(u => isPresenceFresh(u));

    refreshRaisedHandsBoard(freshUsers);

    const onlineCountValue = freshUsers.length;
    if (onlineCount) {
      onlineCount.innerText = onlineCountValue;
      onlineCount.classList.toggle("counter-online", onlineCountValue > 0);
      onlineCount.classList.toggle("counter-offline", onlineCountValue === 0);
    }

    if (freshUsers.length === 0) {
      usersList.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:13px;">No developers currently active in workspace.</div>';
      return;
    }

    freshUsers.forEach(u => {
      const card = document.createElement("div");
      card.className = "user-card";

      let badgeHtml = "";
      if (u.inCourse) {
        let pathTime = u.courseEnteredAt ? new Date(u.courseEnteredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
        badgeHtml = `<span class="in-course-indicator-tag"><i class="bi bi-book-half"></i> ${u.activeCourseName || 'In Course'} (${pathTime})</span>`;
      }

      const isCurrentUserCard = currentUser && currentUser.id === u.id;
      const handBtnHtml = isCurrentUserCard ? `
        <button class="hand-raise-toggle-btn ${u.handRaised ? 'lowered' : ''}" onclick="toggleMyHandRaise()" title="${u.handRaised ? 'Lower hand' : 'Raise hand'}">
          <i class="bi bi-hand-index-thumb"></i> ${u.handRaised ? 'Lower Hand' : 'Raise Hand ✋'}
        </button>
      ` : '';
      const handStatusHtml = u.handRaised ? `<span class="hand-raise-pill">✋ Raised</span>` : '';

      card.innerHTML = `
        <div class="left-info-block">
          <div class="name">${escapeHtml(u.name)} ${badgeHtml} ${handStatusHtml}</div>
          <div class="live-elapsed-badge" data-start="${u.start}">00:00</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
          ${handBtnHtml}
          <button class="student-msg-icon-trigger" onclick="openQuickMessagingModal('${u.id}', '${u.code}', '${isCurrentUserCard ? 'global' : 'private'}')" title="${isCurrentUserCard ? 'Send global status alert' : 'Send private message'}">
            <i class="bi bi-chat-left-text"></i>
          </button>
          <div class="code">Seat ${escapeHtml(u.code)}</div>
        </div>
      `;
      usersList.appendChild(card);
    });

    updateLiveCardElapsedTimers();
  });
  
  db.ref("attendance").on("value", () => {
    refreshAttendanceViews();
  });
}


function updateLiveCardElapsedTimers() {
  document.querySelectorAll(".live-elapsed-badge").forEach(badge => {
    const startTimeStamp = parseInt(badge.getAttribute("data-start"));
    if (!startTimeStamp) return;
    const difference = getVisibleElapsedSessionMs(startTimeStamp);
    
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
    if (adminMoreBtn) adminMoreBtn.classList.remove("hidden");
    if (btnOpenAttendanceReportModal) btnOpenAttendanceReportModal.classList.remove("hidden");

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
  if (adminMoreBtn) adminMoreBtn.classList.add("hidden");
  if (btnOpenAttendanceReportModal) btnOpenAttendanceReportModal.classList.add("hidden");
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
        <button onclick="resetUserSecurityPin('${code}')" class="action-btn primary-btn compact-btn icon-only-btn" title="Reset user pin to default setup" aria-label="Reset PIN"><i class="bi bi-arrow-counterclockwise"></i></button>
        <button id="btn-lock-${code}" onclick="toggleSeatBlock('${code}')" class="premium-btn compact-btn icon-only-btn" title="Lock seat" aria-label="Lock seat"><i class="bi bi-lock"></i></button>
        <button id="btn-kick-${code}" onclick="kickSeatUser('${code}')" class="action-btn danger-btn compact-btn hidden icon-only-btn" title="Kick user" aria-label="Kick user"><i class="bi bi-power"></i></button>
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
        lockBtn.innerHTML = '<i class="bi bi-unlock"></i>';
        lockBtn.className = "action-btn warning-btn compact-btn icon-only-btn";
        lockBtn.style.width = "auto";
      } else {
        lockBtn.innerHTML = '<i class="bi bi-lock"></i>';
        lockBtn.className = "premium-btn compact-btn icon-only-btn";
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
        const endTime = Date.now();
        const duration = Math.max(0, endTime - (userData.start || endTime));
        const seatUserId = userData.id || userData.ownerId || "";
        const seatToken = userData.sessionToken || "";

        if (userData.inCourse) {
          const courseSessionsSnap = await db.ref(COURSE_SESSION_COLLECTION).orderByChild('code').equalTo(code).get();
          const courseSessions = courseSessionsSnap.val() || {};
          const latestCourseId = Object.keys(courseSessions).sort((a, b) => (courseSessions[b].start || 0) - (courseSessions[a].start || 0))[0];
          if (latestCourseId) {
            await db.ref(`${COURSE_SESSION_COLLECTION}/${latestCourseId}`).update({
              end: endTime,
              duration: Math.max(0, endTime - (courseSessions[latestCourseId].start || endTime)),
              status: 'admin-terminated',
              endLabel: formatClockDateTime(endTime)
            });
          }
        }

        await Promise.all([
          db.ref(`seatLeases/${code}`).remove().catch(() => {}),
          db.ref(`seats/${code}`).remove().catch(() => {}),
          seatUserId ? db.ref(`onlineUsers/${seatUserId}`).remove().catch(() => {}) : Promise.resolve()
        ]);

        await db.ref("attendance").push({
          name: userData.name,
          code,
          action: "terminated",
          time: endTime,
          sessionDuration: duration,
          reason: "admin-kick"
        });

        if (seatToken) {
          db.ref(`seatLeases/${code}`).transaction((cur) => {
            if (cur && cur.sessionToken === seatToken) return null;
            return cur;
          }).catch(() => {});
        }

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
    const storedSessionToken = sessionStorage.getItem("active_session_token") || "";
    if (onlineSnap.exists() && storedSessionToken && onlineSnap.val().sessionToken === storedSessionToken) {
      currentUser = { ...onlineSnap.val(), handRaised: !!onlineSnap.val().handRaised, handRaisedAt: onlineSnap.val().handRaisedAt || 0 };
      currentUser.start = getSafeTimestamp(currentUser.start, Date.now());
      currentUser.courseEnteredAt = getSafeTimestamp(currentUser.courseEnteredAt, 0);
      
      formBox.classList.add("hidden");
      leaveBtn.classList.remove("hidden");
      pinActionBox.classList.remove("hidden");
      setStatusText(true, currentUser.code, currentUser.name);
      updateCourseActionButton();
      focusDefaultCourseAction();

      startTimer();
      syncPersonalAccumulatedTime(currentUser.code);
      listenToActiveKicks(cacheUserId);
      listenToSeatLease(currentUser.code);
      
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
  startAttendanceAutoRefresh();
  startStaleSessionMonitor();
  refreshAttendanceViews();
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
test
