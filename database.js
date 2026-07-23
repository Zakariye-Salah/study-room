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
  "05": { name: "Eng Shafie", pin: "1234" }
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
const bestUsersSnapshotPanel = document.getElementById("bestUsersSnapshotPanel");
const bestUsersSnapshotToggleBtn = document.getElementById("bestUsersSnapshotToggleBtn");
const bestUsersSnapshotBody = document.getElementById("bestUsersSnapshotBody");
const bestUsersSnapshotChevron = document.getElementById("bestUsersSnapshotChevron");
const bestUsersHistoryBtn = document.getElementById("bestUsersHistoryBtn");

const rankCelebrationModalOverlay = document.getElementById("rankCelebrationModalOverlay");
const closeRankCelebrationModalBtn = document.getElementById("closeRankCelebrationModalBtn");
const rankCelebrationCloseBtn = document.getElementById("rankCelebrationCloseBtn");
const rankCelebrationTitle = document.getElementById("rankCelebrationTitle");
const rankCelebrationBody = document.getElementById("rankCelebrationBody");

const bestUsersHistoryModalOverlay = document.getElementById("bestUsersHistoryModalOverlay");
const closeBestUsersHistoryModalBtn = document.getElementById("closeBestUsersHistoryModalBtn");
const bestUsersHistoryCloseBtn = document.getElementById("bestUsersHistoryCloseBtn");
const bestUsersHistoryList = document.getElementById("bestUsersHistoryList");

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

const DEFAULT_BROWSER_TITLE = "Study Room - Not joined";
let courseOccupiedAlarmAudio = null;

function syncBrowserTitle() {
  if (!currentUser) {
    document.title = DEFAULT_BROWSER_TITLE;
    return;
  }

  if (currentUser.inCourse) {
    document.title = "Study Room - Joined • Course";
    return;
  }

  const seatLabel = currentUser.code ? `Seat ${currentUser.code}` : "Seat --";
  document.title = `Study Room - Joined • ${seatLabel}`;
}

function playCourseOccupiedAlarm() {
  try {
    if (!courseOccupiedAlarmAudio) {
      courseOccupiedAlarmAudio = new Audio("alarm.mp3");
      courseOccupiedAlarmAudio.preload = "auto";
      courseOccupiedAlarmAudio.volume = 1;
    }
    courseOccupiedAlarmAudio.currentTime = 0;
    const playPromise = courseOccupiedAlarmAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } catch (_) {}
}

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
const HIDDEN_PRESENCE_GRACE_MS = 15 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 15000;
const COURSE_SESSION_COLLECTION = "courseSessions";

let activeAttendanceEventsCache = [];
let liveAttendanceLogLimit = parseInt(localStorage.getItem("attendance_log_limit") || "5", 10);
let bestUsersSnapshotExpanded = localStorage.getItem("best_users_snapshot_expanded") === "1";
let attendanceRefreshInterval = null;
let staleSessionMonitorInterval = null;
let immediateStaleSweepTimeout = null;
let immediateStaleSweepForce = false;
let lastSeatsPresenceSignature = "";
let lastOnlinePresenceSignature = "";
const ATTENDANCE_REFRESH_INTERVAL_MS = 10000; // safer for Firebase free plan

const ATTENDANCE_EVENT_CACHE_KEY = "__study_room_attendance_event_cache__";
const ATTENDANCE_EVENT_SIGNATURE_CACHE_KEY = "__study_room_attendance_event_signature_cache__";
let attendanceEventWriteCache = new Set();
let attendanceEventSignatureCache = new Map();

try {
  const cachedEventKeys = JSON.parse(sessionStorage.getItem(ATTENDANCE_EVENT_CACHE_KEY) || "[]");
  if (Array.isArray(cachedEventKeys)) attendanceEventWriteCache = new Set(cachedEventKeys);
} catch (_) {}

try {
  const cachedSignatures = JSON.parse(sessionStorage.getItem(ATTENDANCE_EVENT_SIGNATURE_CACHE_KEY) || "[]");
  if (Array.isArray(cachedSignatures)) attendanceEventSignatureCache = new Map(cachedSignatures);
} catch (_) {}

function persistAttendanceEventWriteCache() {
  try {
    sessionStorage.setItem(ATTENDANCE_EVENT_CACHE_KEY, JSON.stringify([...attendanceEventWriteCache].slice(-250)));
  } catch (_) {}
}

function persistAttendanceEventSignatureCache() {
  try {
    sessionStorage.setItem(ATTENDANCE_EVENT_SIGNATURE_CACHE_KEY, JSON.stringify([...attendanceEventSignatureCache.entries()].slice(-250)));
  } catch (_) {}
}

function normalizeSeatCode(code = "") {
  const raw = String(code || "").trim();
  if (!raw) return "--";
  if (/^\d+$/.test(raw)) return raw.padStart(2, "0");
  return raw;
}

function getCanonicalSeatName(code = "", fallback = "Unknown") {
  const safeCode = normalizeSeatCode(code);
  const seat = SEATS[safeCode];
  if (seat && seat.name) return seat.name;
  return fallback || "Unknown";
}

function getSeatDisplayName(code = "", fallback = "Unknown") {
  return getCanonicalSeatName(code, fallback);
}

function normalizeAttendanceEvent(event = {}) {
  const code = normalizeSeatCode(event.code || "--");
  return {
    ...event,
    code,
    name: getCanonicalSeatName(code, event.name || "Unknown")
  };
}

function buildAttendanceEventKey(event = {}) {
  const action = String(event.action || "").toLowerCase();
  const code = normalizeSeatCode(event.code || "--");
  const sessionToken = event.sessionToken || event.sessionId || event.token || currentSessionToken || "";
  const eventTime = Number.isFinite(event.time) ? String(event.time) : "";
  const reason = String(event.reason || "").toLowerCase();
  const courseName = String(event.courseName || event.activeCourseName || "").toLowerCase();
  const start = Number.isFinite(event.start) ? String(event.start) : "";
  const handRaised = event.handRaised ? "1" : "0";
  const roomJoinedAt = Number.isFinite(event.roomJoinedAt) ? String(event.roomJoinedAt) : "";
  return [action, code, sessionToken, eventTime || start || roomJoinedAt, reason, courseName, handRaised].join("|");
}

function buildAttendanceEventSignature(event = {}) {
  const action = String(event.action || "").toLowerCase();
  const code = normalizeSeatCode(event.code || "--");
  const sessionToken = event.sessionToken || event.sessionId || event.token || currentSessionToken || "";
  const reason = String(event.reason || "").toLowerCase();
  const courseName = String(event.courseName || event.activeCourseName || "").toLowerCase();
  const handRaised = event.handRaised ? "1" : "0";
  return [action, code, sessionToken, reason, courseName, handRaised].join("|");
}

async function pushAttendanceOnce(payload = {}) {
  const event = normalizeAttendanceEvent({ ...payload });
  if (!event.time) event.time = Date.now();
  const key = event.eventKey || buildAttendanceEventKey(event);
  const signature = buildAttendanceEventSignature(event);
  event.eventKey = key;
  if (attendanceEventWriteCache.has(key)) return false;
  const lastSignatureAt = attendanceEventSignatureCache.get(signature) || 0;
  if (lastSignatureAt && (Date.now() - lastSignatureAt) < 15000) return false;
  attendanceEventWriteCache.add(key);
  attendanceEventSignatureCache.set(signature, Date.now());
  persistAttendanceEventWriteCache();
  persistAttendanceEventSignatureCache();
  try {
    await db.ref("attendance").push(event);
    return true;
  } catch (err) {
    attendanceEventWriteCache.delete(key);
    attendanceEventSignatureCache.delete(signature);
    persistAttendanceEventWriteCache();
    persistAttendanceEventSignatureCache();
    return false;
  }
}

function resetAttendanceEventWriteCache() {
  attendanceEventWriteCache = new Set();
  attendanceEventSignatureCache = new Map();
  persistAttendanceEventWriteCache();
  persistAttendanceEventSignatureCache();
}

function setBestUsersSnapshotExpanded(expanded) {
  bestUsersSnapshotExpanded = !!expanded;
  localStorage.setItem("best_users_snapshot_expanded", bestUsersSnapshotExpanded ? "1" : "0");
  if (bestUsersSnapshotBody) bestUsersSnapshotBody.classList.toggle("hidden", !bestUsersSnapshotExpanded);
  if (bestUsersSnapshotToggleBtn) bestUsersSnapshotToggleBtn.setAttribute("aria-expanded", String(bestUsersSnapshotExpanded));
  if (bestUsersSnapshotChevron) {
    bestUsersSnapshotChevron.classList.toggle("bi-chevron-down", !bestUsersSnapshotExpanded);
    bestUsersSnapshotChevron.classList.toggle("bi-chevron-up", bestUsersSnapshotExpanded);
    bestUsersSnapshotChevron.classList.toggle("rotate-180", bestUsersSnapshotExpanded);
  }
}

function toggleBestUsersSnapshot() {
  setBestUsersSnapshotExpanded(!bestUsersSnapshotExpanded);
}

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
let visibilitySyncTimeout = null;

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

setBestUsersSnapshotExpanded(bestUsersSnapshotExpanded);
syncBestUsersSnapshotActionVisibility();

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
  return formatElapsedDuration(ms);
}

function pad2(num) {
  return String(num).padStart(2, '0');
}


function formatClockDateTime(timestamp) {
  return formatAbsoluteDateTime(timestamp);
}

function formatAbsoluteDateTime(timestamp) {
  const value = Number(timestamp);
  if (!Number.isFinite(value) || value <= 0) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  let hour = d.getHours();
  const minute = pad2(d.getMinutes());
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${year}-${month}-${day} ${pad2(hour)}:${minute} ${suffix}`;
}

function formatElapsedDuration(ms) {
  const safeMs = Number.isFinite(ms) && ms > 0 ? ms : 0;
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${pad2(minutes)}m`;
  if (minutes > 0) return `${minutes}m ${pad2(seconds)}s`;
  return `${seconds}s`;
}

function formatSessionDuration(ms) {
  return formatElapsedDuration(ms);
}

function getSessionRoomStartTimestamp(session = {}, fallback = Date.now()) {
  const candidates = [
    session?.joinedAt,
    session?.roomJoinedAt,
    session?.start,
    session?.createdAt,
    session?.enteredAt,
    session?.joinedTimestamp
  ];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value > 0) return value;
  }
  const safeFallback = Number(fallback);
  return Number.isFinite(safeFallback) && safeFallback > 0 ? safeFallback : Date.now();
}

function getSessionCourseStartTimestamp(session = {}, fallback = null) {
  const candidates = [
    session?.courseEnteredAt,
    session?.courseJoinedAt,
    session?.courseStartedAt,
    session?.lessonEnteredAt
  ];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return getSessionRoomStartTimestamp(session, fallback ?? Date.now());
}

function getSessionExpiryTimestamp(session = {}, fallback = Date.now()) {
  const explicit = Number(session?.expiresAt);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return getSessionRoomStartTimestamp(session, fallback) + SESSION_LIMIT;
}

function getElapsedSessionMsFromUser(session = {}, now = Date.now()) {
  return Math.max(0, now - getSessionRoomStartTimestamp(session, now));
}

function getElapsedCourseMsFromUser(session = {}, now = Date.now()) {
  return Math.max(0, now - getSessionCourseStartTimestamp(session, now));
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
  if (!user || !user.sessionToken) return false;
  if (user.exitPending || user.disconnectRequestedAt || user.exitLoggedAt) return false;
  const lastSeen = user.lastSeen || user.heartbeatAt || user.start || 0;
  const graceWindow = getPresenceGraceWindow(user);
  if ((Date.now() - lastSeen) > graceWindow) return false;
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

  const now = Date.now();
  const joinedAt = getSessionRoomStartTimestamp(currentUser, now);
  const courseStartedAt = getSessionCourseStartTimestamp(currentUser, joinedAt);
  const status = currentUser.inCourse ? "in-course" : "active";
  const expiresAt = getSessionExpiryTimestamp(currentUser, joinedAt);

  return {
    ...currentUser,
    ...extra,
    joinedAt,
    roomJoinedAt: joinedAt,
    start: joinedAt,
    courseEnteredAt: currentUser.courseEnteredAt || courseStartedAt,
    lastSeen: now,
    heartbeatAt: now,
    leftAt: 0,
    status: extra.status || status,
    expiresAt,
    deviceId: currentDeviceId,
    tabId: currentTabId,
    sessionToken: currentSessionToken,
    visibilityState: getCurrentVisibilityState(),
    inCourse: !!currentUser.inCourse,
    activeCourseName: currentUser.activeCourseName || "",
    exitPending: false,
    exitLoggedAt: 0,
    disconnectRequestedAt: 0
  };
}

function buildDisconnectTombstone(reason = "tab-close") {
  const now = Date.now();
  return {
    exitPending: true,
    disconnectRequestedAt: now,
    disconnectReason: reason,
    lastSeen: 0,
    heartbeatAt: 0,
    exitLoggedAt: now,
    exitReason: reason,
    leftAt: now,
    status: "offline"
  };
}

function getCurrentVisibilityState() {
  try {
    return document.visibilityState || (document.hidden ? "hidden" : "visible");
  } catch (_) {
    return "visible";
  }
}


function getPresenceGraceWindow(user) {
  return user && user.visibilityState === "hidden" ? HIDDEN_PRESENCE_GRACE_MS : ACTIVE_PRESENCE_GRACE_MS;
}

function getMostRecentPresenceTimestamp(user = {}) {
  const candidates = [
    user.lastSeen,
    user.heartbeatAt,
    user.updatedAt,
    user.joinedAt,
    user.roomJoinedAt,
    user.start
  ];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return 0;
}

async function claimSessionExitOnce(code, sessionToken, reason, exitTime = Date.now()) {
  if (!code || !sessionToken) return { claimed: false, exitTime };
  const claimRef = db.ref(`sessionExitClaims/${code}`);
  let claimed = false;

  await claimRef.transaction((current) => {
    if (current && current.sessionToken === sessionToken && current.exitLoggedAt) {
      return current;
    }

    claimed = true;
    return {
      code,
      sessionToken,
      exitPending: true,
      exitPendingAt: exitTime,
      exitPendingReason: reason,
      exitLoggedAt: exitTime,
      exitReason: reason,
      updatedAt: exitTime
    };
  }).catch(() => {});

  return { claimed, exitTime };
}


function getFinalExitAttendanceAction({ wasInCourse = false, wasHandRaised = false, explicitAction = "" } = {}) {
  const normalizedExplicit = String(explicitAction || "").toLowerCase();
  if (normalizedExplicit === "course-leave" || normalizedExplicit === "hand-lower" || normalizedExplicit === "leave") {
    return normalizedExplicit;
  }
  if (wasHandRaised) return "hand-lower";
  if (wasInCourse) return "course-leave";
  return "leave";
}

function buildOfflineExitStamp({
  roomJoinedAt = 0,
  leaveTime = Date.now(),
  exitReason = "leave",
  courseEnteredAt = 0,
  activeCourseName = "",
  sessionToken = ""
} = {}) {
  const joinedAt = Number.isFinite(roomJoinedAt) && roomJoinedAt > 0 ? roomJoinedAt : leaveTime;
  const closedAt = Number.isFinite(leaveTime) && leaveTime > 0 ? leaveTime : Date.now();
  return {
    handRaised: false,
    handRaisedAt: 0,
    inCourse: false,
    activeCourseName: "",
    courseEnteredAt: 0,
    roomJoinedAt: joinedAt,
    joinedAt,
    start: joinedAt,
    lastSeen: closedAt,
    heartbeatAt: closedAt,
    leftAt: closedAt,
    exitPending: true,
    exitLoggedAt: closedAt,
    disconnectRequestedAt: closedAt,
    exitReason,
    status: "offline",
    expiresAt: joinedAt + SESSION_LIMIT,
    sessionToken
  };
}



async function syncBrowserVisibilityState() {
  if (!currentUser || !currentSessionToken || !currentUser.code || !currentUser.id) return;
  const visibilityState = getCurrentVisibilityState();
  const now = Date.now();
  const payload = {
    visibilityState,
    lastSeen: now,
    heartbeatAt: now,
    sessionToken: currentSessionToken,
    roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || 0,
    joinedAt: currentUser.joinedAt || currentUser.roomJoinedAt || currentUser.start || 0,
    expiresAt: getSessionExpiryTimestamp(currentUser, now),
    status: currentUser.inCourse ? "in-course" : "active"
  };
  await Promise.all([
    db.ref(`seatLeases/${currentUser.code}`).update(payload).catch(() => {}),
    db.ref(`seats/${currentUser.code}`).update(payload).catch(() => {}),
    db.ref(`onlineUsers/${currentUser.id}`).update(payload).catch(() => {})
  ]);
}

function isLeaseFresh(lease) {
  if (!lease || !lease.sessionToken) return false;
  if (lease.exitPending || lease.disconnectRequestedAt || lease.exitLoggedAt || lease.leftAt) return false;
  const status = String(lease.status || "").toLowerCase();
  if (status === "offline" || status === "left" || status === "expired" || status === "terminated") return false;
  const expiresAt = Number(lease.expiresAt);
  if (Number.isFinite(expiresAt) && expiresAt > 0 && Date.now() >= expiresAt) return false;
  const marker = getMostRecentPresenceTimestamp(lease);
  return lease.sessionToken && marker > 0 && (Date.now() - marker) <= ACTIVE_PRESENCE_GRACE_MS;
}

function getPresenceMapFromSeatsSnapshot(seats = {}) {
  const map = {};
  Object.entries(seats || {}).forEach(([key, record]) => {
    const entry = record || {};
    const normalizedCode = normalizeSeatCode(entry.code || entry.seat || key || "--");
    if (!normalizedCode) return;
    const snapshot = {
      ...entry,
      code: normalizedCode,
      seat: normalizedCode,
      name: entry.name || "",
      fresh: isPresenceFresh(entry),
      inCourse: !!entry.inCourse,
      joinedAt: getSessionRoomStartTimestamp(entry, 0),
      roomJoinedAt: getSessionRoomStartTimestamp(entry, 0),
      courseEnteredAt: getSessionCourseStartTimestamp(entry, 0),
      lastSeen: Number(entry.lastSeen || entry.heartbeatAt || entry.updatedAt || 0) || 0,
      heartbeatAt: Number(entry.heartbeatAt || 0) || 0,
      leftAt: Number(entry.leftAt || 0) || 0,
      exitLoggedAt: Number(entry.exitLoggedAt || 0) || 0,
      disconnectRequestedAt: Number(entry.disconnectRequestedAt || 0) || 0,
      expiresAt: Number(entry.expiresAt || 0) || 0,
      status: entry.status || "",
      sessionToken: entry.sessionToken || "",
      updatedAt: Number(entry.updatedAt || 0) || 0
    };
    const existing = map[normalizedCode];
    if (!existing || getMostRecentPresenceTimestamp(snapshot) >= getMostRecentPresenceTimestamp(existing)) {
      map[normalizedCode] = snapshot;
    }
  });
  return map;
}

function mergePresenceMaps(...maps) {
  const merged = {};
  maps.filter(Boolean).forEach((map) => {
    Object.entries(map).forEach(([code, entry]) => {
      const normalizedCode = normalizeSeatCode(entry?.code || entry?.seat || code || "--");
      if (!normalizedCode) return;
      const candidate = {
        ...entry,
        code: normalizedCode,
        seat: normalizedCode,
        fresh: !!entry?.fresh,
        lastSeen: Number(entry?.lastSeen || entry?.heartbeatAt || entry?.updatedAt || 0) || 0,
        heartbeatAt: Number(entry?.heartbeatAt || 0) || 0,
        joinedAt: Number(entry?.joinedAt || entry?.roomJoinedAt || entry?.start || 0) || 0,
        roomJoinedAt: Number(entry?.roomJoinedAt || entry?.joinedAt || entry?.start || 0) || 0,
        courseEnteredAt: Number(entry?.courseEnteredAt || 0) || 0,
        leftAt: Number(entry?.leftAt || 0) || 0,
        exitLoggedAt: Number(entry?.exitLoggedAt || 0) || 0,
        disconnectRequestedAt: Number(entry?.disconnectRequestedAt || 0) || 0,
        expiresAt: Number(entry?.expiresAt || 0) || 0,
        status: entry?.status || ""
      };
      const existing = merged[normalizedCode];
      if (!existing || getMostRecentPresenceTimestamp(candidate) >= getMostRecentPresenceTimestamp(existing)) {
        merged[normalizedCode] = candidate;
      }
    });
  });
  return merged;
}

function resolvePresenceClosureTimestamp(presence = {}, fallback = Date.now()) {
  const candidates = [
    presence.leftAt,
    presence.exitLoggedAt,
    presence.disconnectRequestedAt,
    presence.expiresAt,
    presence.lastSeen,
    presence.heartbeatAt,
    presence.updatedAt
  ];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return Number.isFinite(fallback) && fallback > 0 ? fallback : Date.now();
}

function isLeaveAction(action = "") {
  const value = String(action || "").toLowerCase();
  return value.startsWith("leave") || value.includes("terminated") || value.includes("expired");
}

function buildResolvedAttendanceEvents(events = [], presenceMap = {}, now = Date.now()) {
  const ordered = events.filter(Boolean).slice().sort((a, b) => (a.time || 0) - (b.time || 0));
  const resolved = [];
  const seenExact = new Set();
  const recentBySignature = new Map();

  ordered.forEach((rawEvent) => {
    const event = normalizeAttendanceEvent(rawEvent);
    const key = event.eventKey || buildAttendanceEventKey(event);
    if (seenExact.has(key)) return;
    seenExact.add(key);

    const signature = buildAttendanceEventSignature(event);
    const eventTime = Number.isFinite(event.time) ? event.time : now;
    const lastSeenAt = recentBySignature.get(signature) || 0;
    if (lastSeenAt && (eventTime - lastSeenAt) < 15000) {
      return;
    }
    recentBySignature.set(signature, eventTime);

    resolved.push(event);
  });

  return resolved.sort((a, b) => (a.time || 0) - (b.time || 0));
}

function buildStaleSessionSummary(seatData = {}, leaseData = null) {
  const now = Date.now();
  const code = seatData.code || leaseData?.seat || leaseData?.code || "--";
  const name = seatData.name || leaseData?.name || getSeatDisplayName(code, "Unknown");
  const ownerId = seatData.id || leaseData?.ownerId || seatData.ownerId || seatData.userId || "";
  const sessionStart = getSessionRoomStartTimestamp(seatData, leaseData?.start || now);
  const sessionDuration = Math.min(SESSION_LIMIT, Math.max(0, now - sessionStart));
  const courseStart = getSessionCourseStartTimestamp(seatData, sessionStart);
  const activeCourseName = seatData.activeCourseName || leaseData?.activeCourseName || "Full Stack AI Engineer";
  return { now, code, name, ownerId, sessionStart, sessionDuration, courseStart, activeCourseName };
}

function normalizeCourseSessionRecord(sessionId, record = {}, fallback = {}) {
  const code = normalizeSeatCode(record.code || fallback.code || "--");
  const courseName = record.courseName || fallback.courseName || record.activeCourseName || fallback.activeCourseName || "Full Stack AI Engineer";
  return {
    id: sessionId,
    name: record.name || fallback.name || getSeatDisplayName(code, "Unknown"),
    code,
    sessionToken: record.sessionToken || fallback.sessionToken || "",
    start: Number(record.start) || Number(fallback.start) || 0,
    end: Number(record.end) || 0,
    duration: Number(record.duration) || 0,
    roomJoinedAt: Number(record.roomJoinedAt) || Number(fallback.roomJoinedAt) || 0,
    courseName,
    status: record.status || fallback.status || "active",
    startLabel: record.startLabel || fallback.startLabel || "",
    endLabel: record.endLabel || fallback.endLabel || ""
  };
}

async function findOpenCourseSessionId(code = "", sessionToken = "") {
  const normalizedCode = normalizeSeatCode(code);
  const normalizedToken = String(sessionToken || "").trim();

  const collectOpenIds = (sessions = {}) => Object.entries(sessions)
    .filter(([sessionId, record]) => {
      if (!record) return false;
      const recordCode = normalizeSeatCode(record.code || normalizedCode || "--");
      const matchesCode = !normalizedCode || recordCode === normalizedCode;
      const matchesToken = !normalizedToken || String(record.sessionToken || "") === normalizedToken;
      const isOpen = !Number(record.end) || Number(record.end) <= 0;
      return matchesCode && matchesToken && isOpen;
    })
    .sort((a, b) => (Number(b[1]?.start) || 0) - (Number(a[1]?.start) || 0))
    .map(([sessionId]) => sessionId);

  if (normalizedToken) {
    const tokenSnap = await db.ref(COURSE_SESSION_COLLECTION).orderByChild("sessionToken").equalTo(normalizedToken).get().catch(() => null);
    const tokenIds = tokenSnap ? collectOpenIds(tokenSnap.val() || {}) : [];
    if (tokenIds.length) return tokenIds[0];
  }

  if (normalizedCode) {
    const codeSnap = await db.ref(COURSE_SESSION_COLLECTION).orderByChild("code").equalTo(normalizedCode).get().catch(() => null);
    const codeIds = codeSnap ? collectOpenIds(codeSnap.val() || {}) : [];
    if (codeIds.length) return codeIds[0];
  }

  return null;
}

async function finalizeCourseSessionsForPresence({
  code = "",
  sessionToken = "",
  reason = "leave",
  endTime = Date.now(),
  startOverride = null,
  roomJoinedAt = 0,
  courseName = "Full Stack AI Engineer",
  name = "Unknown",
  currentSessionId = null
} = {}) {
  const normalizedCode = normalizeSeatCode(code);
  const normalizedToken = String(sessionToken || "").trim();
  const normalizedReason = String(reason || "leave");
  const normalizedEnd = Number.isFinite(endTime) && endTime > 0 ? endTime : Date.now();
  const updatesById = new Map();

  const addMatchesFromSnapshot = (snap, expectedToken = "") => {
    const sessions = snap || {};
    Object.entries(sessions).forEach(([sessionId, record]) => {
      if (!record) return;
      const recordCode = normalizeSeatCode(record.code || normalizedCode || "--");
      const recordToken = String(record.sessionToken || "").trim();
      const open = !Number(record.end) || Number(record.end) <= 0;
      const codeMatches = !normalizedCode || recordCode === normalizedCode;
      const tokenMatches = !expectedToken || recordToken === expectedToken;
      if (open && codeMatches && tokenMatches) {
        updatesById.set(sessionId, record);
      }
    });
  };

  if (normalizedToken) {
    const tokenSnap = await db.ref(COURSE_SESSION_COLLECTION).orderByChild("sessionToken").equalTo(normalizedToken).get().catch(() => null);
    if (tokenSnap) addMatchesFromSnapshot(tokenSnap.val() || {}, normalizedToken);
  }

  if (!updatesById.size && normalizedCode) {
    const codeSnap = await db.ref(COURSE_SESSION_COLLECTION).orderByChild("code").equalTo(normalizedCode).get().catch(() => null);
    if (codeSnap) addMatchesFromSnapshot(codeSnap.val() || {}, normalizedToken);
  }

  if (currentSessionId) {
    const currentSnap = await db.ref(`${COURSE_SESSION_COLLECTION}/${currentSessionId}`).get().catch(() => null);
    if (currentSnap && currentSnap.exists && currentSnap.exists()) {
      updatesById.set(currentSessionId, currentSnap.val() || {});
    }
  }

  if (!updatesById.size) return false;

  const tasks = [];
  for (const [sessionId, record] of updatesById.entries()) {
    const recordStart = Number(record.start) || 0;
    const resolvedStart = getSessionCourseStartTimestamp({
      courseEnteredAt: startOverride || record.courseEnteredAt || recordStart || roomJoinedAt || normalizedEnd,
      start: recordStart || startOverride || normalizedEnd,
      roomJoinedAt: Number(record.roomJoinedAt) || roomJoinedAt || 0
    }, normalizedEnd);
    const duration = Math.max(0, normalizedEnd - resolvedStart);
    tasks.push(
      db.ref(`${COURSE_SESSION_COLLECTION}/${sessionId}`).update({
        name: record.name || name || getSeatDisplayName(normalizedCode, "Unknown"),
        code: normalizeSeatCode(record.code || normalizedCode || "--"),
        courseName: record.courseName || courseName || "Full Stack AI Engineer",
        sessionToken: record.sessionToken || normalizedToken || "",
        roomJoinedAt: Number(record.roomJoinedAt) || roomJoinedAt || 0,
        start: resolvedStart,
        end: normalizedEnd,
        duration,
        status: normalizedReason,
        endLabel: formatAbsoluteDateTime(normalizedEnd)
      }).catch(() => {})
    );
  }

  await Promise.all(tasks);
  if (currentCourseSessionId && updatesById.has(currentCourseSessionId)) {
    currentCourseSessionId = null;
  }
  return true;
}

async function closeStalePresenceSession(seatData, leaseData = null) {
  const merged = {
    ...(leaseData || {}),
    ...(seatData || {})
  };

  const code = normalizeSeatCode(merged.code || merged.seat || seatData?.code || leaseData?.seat || leaseData?.code || "--");
  const sessionToken = merged.sessionToken || leaseData?.sessionToken || seatData?.sessionToken || "";
  if (!code || !sessionToken) return false;

  const closureTime = resolvePresenceClosureTimestamp(merged, Date.now());
  const roomJoinedAt = getSessionRoomStartTimestamp(merged, leaseData?.start || merged.start || closureTime);
  const courseEnteredAt = getSessionCourseStartTimestamp(merged, roomJoinedAt);
  const wasInCourse = !!merged.inCourse;
  const wasHandRaised = !!merged.handRaised;
  const name = merged.name || leaseData?.name || getSeatDisplayName(code, "Unknown");
  const activeCourseName = merged.activeCourseName || leaseData?.activeCourseName || "Full Stack AI Engineer";
  const seatUserId = merged.id || merged.ownerId || leaseData?.ownerId || merged.userId || "";
  const exitReason = merged.disconnectReason || merged.exitReason || "stale-session-sweep";

  const exitClaim = await claimSessionExitOnce(code, sessionToken, exitReason, closureTime);
  if (!exitClaim.claimed && !merged.exitLoggedAt && !merged.leftAt && !isSessionOverLimit(merged)) {
    return false;
  }

  const courseDuration = Math.max(0, Math.min(SESSION_LIMIT, closureTime - courseEnteredAt));
  const roomDuration = Math.max(0, Math.min(SESSION_LIMIT, closureTime - roomJoinedAt));
  const finalAction = getFinalExitAttendanceAction({ wasInCourse, wasHandRaised });
  const offlineStamp = buildOfflineExitStamp({
    roomJoinedAt,
    leaveTime: closureTime,
    exitReason,
    courseEnteredAt,
    activeCourseName,
    sessionToken
  });

  if (wasInCourse) {
    await finalizeCourseSessionsForPresence({
      code,
      sessionToken,
      reason: exitReason,
      endTime: closureTime,
      startOverride: courseEnteredAt,
      roomJoinedAt,
      courseName: activeCourseName,
      name,
      currentSessionId: currentCourseSessionId
    });
  }

  await pushAttendanceOnce({
    name,
    code,
    action: finalAction,
    time: closureTime,
    joinedAt: roomJoinedAt,
    leftAt: closureTime,
    sessionDuration: finalAction === "course-leave" ? courseDuration : roomDuration,
    reason: exitReason,
    courseName: activeCourseName,
    sessionToken
  });

  const updateTargets = [db.ref(`seatLeases/${code}`), db.ref(`seats/${code}`)];
  if (seatUserId) updateTargets.push(db.ref(`onlineUsers/${seatUserId}`));

  await Promise.all(updateTargets.map(ref => ref.update(offlineStamp).catch(() => {})));

  await db.ref(`weeklyHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + roomDuration).catch(() => {});
  await db.ref(`weeklyCourseHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + (wasInCourse ? courseDuration : 0)).catch(() => {});
  await db.ref(`dailyHours/${getTodayIdentifier()}/${code}`).transaction(v => (v || 0) + roomDuration).catch(() => {});
  await db.ref(`monthlyHours/${getMonthIdentifier()}/${code}`).transaction(v => (v || 0) + roomDuration).catch(() => {});
  await db.ref(`allTimeHours/${code}`).transaction(v => (v || 0) + roomDuration).catch(() => {});

  return true;
}


// ==========================================================================

// SESSION MANAGEMENT TIMERS
// ==========================================================================

function startTimer() {
  clearInterval(timerInterval);
  if (currentUser && timerBox) {
    timerBox.innerText = formatLiveSeconds(getElapsedSessionMsFromUser(currentUser));
  }
  timerInterval = setInterval(() => {
    if (!currentUser) return;

    if (isSessionOverLimit(currentUser)) {
      leaveRoom(true, "session-expired");
      return;
    }

    const currentSessionMs = getElapsedSessionMsFromUser(currentUser);
    timerBox.innerText = formatLiveSeconds(currentSessionMs);
  }, 1000);
}



async function refreshAllPresenceHeartbeats() {
  if (!currentUser || !currentSessionToken) return;

  if (isSessionOverLimit(currentUser)) {
    await leaveRoom(true, "session-expired");
    return;
  }

  const payload = buildPresencePayload();
  if (!payload) return;

  const now = Date.now();
  await Promise.all([
    db.ref(`seatLeases/${currentUser.code}`).update({
      seat: currentUser.code,
      name: currentUser.name,
      ownerId: currentUser.id,
      deviceId: currentDeviceId,
      tabId: currentTabId,
      sessionToken: currentSessionToken,
      inCourse: !!currentUser.inCourse,
      activeCourseName: currentUser.activeCourseName || "",
      courseEnteredAt: currentUser.courseEnteredAt || 0,
      start: getSessionRoomStartTimestamp(currentUser, now),
      joinedAt: getSessionRoomStartTimestamp(currentUser, now),
      roomJoinedAt: getSessionRoomStartTimestamp(currentUser, now),
      expiresAt: getSessionExpiryTimestamp(currentUser, now),
      status: currentUser.inCourse ? "in-course" : "active",
      lastSeen: now,
      heartbeatAt: now
    }).catch(() => {}),
    db.ref(`seats/${currentUser.code}`).update(payload).catch(() => {}),
    db.ref(`onlineUsers/${currentUser.id}`).update(payload).catch(() => {})
  ]);
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

function bindVisibilityPresenceSync() {
  if (document.__studyRoomVisibilitySyncBound) return;
  document.__studyRoomVisibilitySyncBound = true;

  const scheduleSync = () => {
    if (visibilitySyncTimeout) clearTimeout(visibilitySyncTimeout);
    visibilitySyncTimeout = setTimeout(() => {
      syncBrowserVisibilityState().catch(() => {});
    }, 150);
  };

  document.addEventListener("visibilitychange", scheduleSync);
  window.addEventListener("focus", scheduleSync);
  window.addEventListener("blur", scheduleSync);
}


function bindUnloadPresenceCleanup() {
  if (document.__studyRoomUnloadSyncBound) return;
  document.__studyRoomUnloadSyncBound = true;

  const handleShutdown = () => {
    if (!currentUser || isSessionTeardownInProgress) return;
    syncBrowserVisibilityState().catch(() => {});
    leaveRoom(true, "tab-close").catch(() => {});
  };

  window.addEventListener("pagehide", handleShutdown, { capture: true });
  window.addEventListener("beforeunload", handleShutdown, { capture: true });
}

async function registerSessionDisconnectHandlers() {
  if (!currentUser) return;
  const code = currentUser.code;
  const id = currentUser.id;
  const leaseRef = db.ref(`seatLeases/${code}`);
  const seatRef = db.ref(`seats/${code}`);
  const onlineRef = db.ref(`onlineUsers/${id}`);
  const tombstone = buildDisconnectTombstone("tab-close");
  await Promise.all([
    leaseRef.onDisconnect().update(tombstone).catch(() => {}),
    seatRef.onDisconnect().update(tombstone).catch(() => {}),
    onlineRef.onDisconnect().update(tombstone).catch(() => {})
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
  const { silent = false, skipConfirm = false, allowDuringTeardown = false, suppressAttendanceLog = false, leaveTime: leaveTimeOverride = null } = opts;
  if (!currentUser || !currentUser.inCourse || (isSessionTeardownInProgress && !allowDuringTeardown)) return false;
  if (auto && isSessionTeardownInProgress && !allowDuringTeardown) return false;

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
  const roomStartTime = getSessionRoomStartTimestamp(currentUser);
  const courseStartTime = getSessionCourseStartTimestamp(currentUser, roomStartTime);
  const leaveTime = Number.isFinite(leaveTimeOverride) && leaveTimeOverride > 0 ? leaveTimeOverride : Date.now();
  const rawCourseDuration = Math.max(0, leaveTime - courseStartTime);
  const roomDurationCap = Math.max(0, leaveTime - roomStartTime);
  const courseDuration = Math.min(SESSION_LIMIT, Math.min(rawCourseDuration, roomDurationCap));

  currentUser.inCourse = false;
  currentUser.activeCourseName = "";
  currentUser.courseEnteredAt = 0;
  currentUser.lastSeen = leaveTime;
  currentUser.heartbeatAt = leaveTime;
  currentUser.status = "active";

  const code = currentUser.code;
  const id = currentUser.id;
  const sessionToken = currentSessionToken;

  await finalizeActiveCourseSession(auto ? "terminated" : reason, courseStartTime, leaveTime);

  const courseExitPayload = {
    inCourse: false,
    activeCourseName: "",
    courseEnteredAt: 0,
    lastSeen: leaveTime,
    heartbeatAt: leaveTime,
    status: "active"
  };

  await db.ref(`seatLeases/${code}`).transaction((current) => {
    if (!current || (current.sessionToken && current.sessionToken !== sessionToken)) {
      return current;
    }
    return {
      ...current,
      ...courseExitPayload
    };
  }).catch(() => {});

  await db.ref(`onlineUsers/${id}`).update(courseExitPayload).catch(() => {});
  await db.ref(`seats/${code}`).update(courseExitPayload).catch(() => {});

  if (!suppressAttendanceLog) {
    await pushAttendanceOnce({
      name: currentUser.name,
      code,
      action: auto ? "terminated" : "course-leave",
      time: leaveTime,
      joinedAt: roomStartTime,
      leftAt: leaveTime,
      sessionDuration: courseDuration,
      reason: auto ? "stale-session-sweep" : reason,
      courseName: activeCourseName,
      sessionToken
    });

    await db.ref(`weeklyCourseHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + courseDuration);
  }

  if (!silent) {
    toast("You left the course successfully.", "success");
  }

  updateCourseActionButton();
  setStatusText(true, code, currentUser.name);
  focusDefaultCourseAction();
  return true;
}

async function finalizeActiveCourseSession(reason = "leave", startOverride = null, endOverride = null) {
  if (!currentUser) return false;
  const endTime = Number.isFinite(endOverride) && endOverride > 0 ? endOverride : Date.now();
  const startTime = getSessionCourseStartTimestamp({ courseEnteredAt: startOverride || currentUser.courseEnteredAt, start: startOverride || currentUser.courseEnteredAt }, endTime);
  return finalizeCourseSessionsForPresence({
    code: currentUser.code,
    sessionToken: currentSessionToken,
    reason,
    endTime,
    startOverride: startTime,
    roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || startTime,
    courseName: currentUser.activeCourseName || "Full Stack AI Engineer",
    name: currentUser.name,
    currentSessionId: currentCourseSessionId
  });
}

function buildRoomSessionsFromAttendance(events, presenceMap = {}, now = Date.now()) {
  const openSessions = {};
  const sessions = [];

  events.forEach(event => {
    if (!event || !event.time) return;
    const code = normalizeSeatCode(event.code || '--');

    if (event.action === 'join') {
      const start = getSessionRoomStartTimestamp(event, event.time);
      openSessions[code] = { name: event.name || getSeatDisplayName(code, 'Unknown'), code, start, status: 'active' };
      return;
    }

    if (String(event.action || '').startsWith('leave') || String(event.action || '').includes('expired') || String(event.action || '').includes('terminated')) {
      const open = openSessions[code];
      if (open) {
        sessions.push({ ...open, end: event.time, duration: Math.min(SESSION_LIMIT, Math.max(0, event.time - open.start)), action: event.action, status: 'ended' });
        delete openSessions[code];
      }
    }
  });

  Object.entries(openSessions).forEach(([code, open]) => {
    const normalizedCode = normalizeSeatCode(code);
    const presence = presenceMap?.[normalizedCode] || {};
    if (!presence.fresh) return;
    const start = open.start || presence.joinedAt || presence.roomJoinedAt || presence.start || now;
    sessions.push({
      ...open,
      code: normalizedCode,
      start,
      end: 0,
      duration: Math.min(SESSION_LIMIT, Math.max(0, now - start)),
      action: 'join',
      status: 'active'
    });
  });

  return sessions;
}

function buildSessionTotalsMap(sessionList = [], capMap = null) {
  const map = new Map();
  sessionList.forEach(session => {
    if (!session) return;
    const code = normalizeSeatCode(session.code || '--');
    const duration = Math.max(0, Number(session.duration) || 0);
    const prev = map.get(code) || {
      name: session.name || getSeatDisplayName(code, 'Unknown'),
      code,
      totalMs: 0,
      sessions: 0
    };
    prev.totalMs += duration;
    prev.sessions += 1;
    prev.name = prev.name || session.name || getSeatDisplayName(code, 'Unknown');
    map.set(code, prev);
  });

  if (!capMap) return map;

  for (const [code, row] of map.entries()) {
    if (!capMap.has(code)) continue;
    const cap = Number(capMap.get(code));
    if (Number.isFinite(cap) && cap >= 0) {
      row.totalMs = Math.min(row.totalMs, cap);
    }
    map.set(code, row);
  }

  return map;
}

function aggregateTopUsers(sessionList, capMap = null) {
  const totalsMap = buildSessionTotalsMap(sessionList, capMap);
  const sorted = [...totalsMap.values()].sort((a, b) => {
    if (b.totalMs !== a.totalMs) return b.totalMs - a.totalMs;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });

  let rank = 0;
  let lastMs = null;
  return sorted.map((item) => {
    if (lastMs === null || item.totalMs !== lastMs) {
      rank += 1;
      lastMs = item.totalMs;
    }
    return { ...item, rank };
  });
}

function buildCourseSessions(events, presenceMap = {}, now = Date.now(), roomSessions = []) {
  const roomSessionMap = buildSessionTotalsMap(roomSessions);
  const roomStartMap = new Map();
  const roomEndMap = new Map();

  roomSessions.forEach((session) => {
    const code = normalizeSeatCode(session.code || '--');
    const existingStart = roomStartMap.get(code);
    const sessionStart = Number(session.start) || 0;
    const sessionEnd = Number(session.end) || 0;
    if (!existingStart || sessionStart < existingStart) roomStartMap.set(code, sessionStart);
    const currentEnd = roomEndMap.get(code) || 0;
    const effectiveEnd = sessionEnd > 0 ? sessionEnd : now;
    if (effectiveEnd > currentEnd) roomEndMap.set(code, effectiveEnd);
  });

  return events
    .filter(Boolean)
    .map(item => {
      const code = normalizeSeatCode(item.code || '--');
      const presence = presenceMap?.[code] || {};
      const recordToken = String(item.sessionToken || '').trim();
      const presenceToken = String(presence.sessionToken || '').trim();
      const tokenMatches = !recordToken || !presenceToken || recordToken === presenceToken;
      const roomJoinedAt = item.roomJoinedAt || item.roomStart || item.joinedAt || roomStartMap.get(code) || 0;
      const rawStart = item.start || item.time || 0;
      const start = Math.max(rawStart, roomJoinedAt || rawStart || 0);
      let end = Number(item.end) || 0;
      let status = item.status || 'active';
      const isFresh = !!presence?.fresh;
      const roomEnd = roomEndMap.get(code) || 0;

      if (!end || end <= 0) {
        if (isFresh && tokenMatches) {
          status = 'active';
        } else {
          const presenceEnd = Number(
            presence.exitLoggedAt ||
            presence.leftAt ||
            presence.disconnectRequestedAt ||
            presence.lastSeen ||
            presence.heartbeatAt ||
            0
          ) || 0;
          if (presenceEnd > 0) {
            end = presenceEnd;
            status = presence.status || 'ended';
          } else {
            return null;
          }
        }
      }

      const resolvedEnd = end > 0 ? Math.min(end, roomEnd || end) : 0;
      const computedDuration = resolvedEnd > 0 ? Math.max(0, resolvedEnd - start) : Math.max(0, now - start);
      const roomCap = Number(roomSessionMap.get(code)?.totalMs || 0);
      const duration = Math.min(SESSION_LIMIT, roomCap > 0 ? Math.min(computedDuration, roomCap) : computedDuration);

      return {
        id: item.id,
        name: getCanonicalSeatName(code, item.name || 'Unknown'),
        code,
        start,
        end: resolvedEnd,
        roomJoinedAt,
        duration,
        courseName: item.courseName || item.activeCourseName || 'Full Stack AI Engineer',
        sessionToken: recordToken,
        status: !resolvedEnd ? 'active' : status,
        startLabel: item.startLabel || formatClockDateTime(start),
        endLabel: item.endLabel || (resolvedEnd ? formatClockDateTime(resolvedEnd) : '—')
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.start - a.start);
}

function formatAttendanceActionLabel(event) {
  const name = escapeHtml(event.name || getSeatDisplayName(event.code, 'Unknown'));
  const code = escapeHtml(event.code || '--');
  const nameHtml = `<strong class="clean-att-name">${name}</strong>`;
  const seatHtml = `<span class="clean-att-seat-pill">Seat ${code}</span>`;
  const timeStr = formatAbsoluteDateTime(event.time || Date.now());
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
    if (event.reason) {
      body += ` <span class="clean-att-duration-pill">${escapeHtml(event.reason)}</span>`;
    }
  } else if (event.action === 'hand-raise') {
    icon = 'bi-hand-index-thumb';
    iconClass = 'icon-hand-raise';
    body = `${nameHtml} raised the ✋️ ${seatHtml}`;
  } else if (event.action === 'hand-lower') {
    icon = 'bi-hand-index-thumb';
    iconClass = 'icon-hand-lower';
    body = `${nameHtml} lowered the hand ✋️ ${seatHtml}`;
    if (event.reason) {
      body += ` <span class="clean-att-duration-pill">${escapeHtml(event.reason)}</span>`;
    }
  } else {
    icon = 'bi-box-arrow-left';
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
    const [attendanceSnap, seatsSnap, onlineSnap] = await Promise.all([
      db.ref('attendance').get(),
      db.ref('seats').get(),
      db.ref('onlineUsers').get()
    ]);
    const presenceMap = mergePresenceMaps(
      getPresenceMapFromSeatsSnapshot(seatsSnap.val() || {}),
      getPresenceMapFromSeatsSnapshot(onlineSnap.val() || {})
    );
    const rawEvents = Object.values(attendanceSnap.val() || {});
    activeAttendanceEventsCache = buildResolvedAttendanceEvents(rawEvents, presenceMap);
    renderAttendanceRows(attendanceList, activeAttendanceEventsCache, liveAttendanceLogLimit);
    renderWeeklyBestUsersSnapshot().catch(() => {});

    if (attendanceReportModalOverlay && !attendanceReportModalOverlay.classList.contains('hidden')) {
      await renderAttendanceReportModal({ silent: silentReportRefresh });
    }
  } catch (_) {}
}

function getDisplayWeekRangeLabel(weekKey) {
  const match = String(weekKey || '').match(/^week_(\d+)_(\d+)_(\d+)$/);
  if (!match) return String(weekKey || 'Unknown week');
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const start = new Date(year, month, day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const shortMonth = (date) => date.toLocaleDateString('en-US', { month: 'short' });
  const shortDay = (date) => date.getDate();
  const shortDow = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });

  return `${shortDay(start)}/${shortMonth(start)} (${shortDow(start)}) - ${shortDay(end)}/${shortMonth(end)} (${shortDow(end)})`;
}

function getRankBadgeMarkup(rank) {
  const safeRank = Math.max(1, parseInt(rank || 1, 10));
  if (safeRank === 1) return '<span class="rank-badge rank-gold" aria-label="Rank 1">🥇</span>';
  if (safeRank === 2) return '<span class="rank-badge rank-silver" aria-label="Rank 2">🥈</span>';
  if (safeRank === 3) return '<span class="rank-badge rank-bronze" aria-label="Rank 3">🥉</span>';
  return `<span class="rank-badge rank-number" aria-label="Rank ${safeRank}">${safeRank}</span>`;
}

function getRankCelebrationTone(rank) {
  const safeRank = Math.max(1, parseInt(rank || 1, 10));
  if (safeRank === 1) return { className: 'rank-celebrate-gold', label: 'Premium Leader', icon: 'bi-stars' };
  if (safeRank === 2) return { className: 'rank-celebrate-silver', label: 'Elite Runner-Up', icon: 'bi-award' };
  if (safeRank === 3) return { className: 'rank-celebrate-bronze', label: 'Strong Performer', icon: 'bi-trophy' };
  if (safeRank === 4) return { className: 'rank-celebrate-warning', label: 'Room to Rise', icon: 'bi-lightning-charge' };
  return { className: 'rank-celebrate-danger', label: 'Lowest Rank', icon: 'bi-exclamation-triangle' };
}

function getRankCelebrationMessage(rank, name, code) {
  const safeRank = Math.max(1, parseInt(rank || 1, 10));
  const seat = code ? `Seat ${code}` : 'your seat';
  if (safeRank === 1) {
    return {
      title: `🥇 Legendary, ${escapeHtml(name || 'Champion')}!`,
      desc: `You are the weekly leader from ${seat}. This is the premium position — the strongest signal of focus, consistency, and results. Keep the crown and set the pace for everyone else.`,
      chips: ['#1 Leader', 'Premium Modal', 'Top Energy']
    };
  }
  if (safeRank === 2) {
    return {
      title: `🥈 Excellent, ${escapeHtml(name || 'Runner-up')}!`,
      desc: `You are only one step away from the top spot from ${seat}. That is elite-level progress and a very strong result for this week.`,
      chips: ['#2 Rank', 'Almost Top', 'Strong Push']
    };
  }
  if (safeRank === 3) {
    return {
      title: `🥉 Strong, ${escapeHtml(name || 'Performer')}!`,
      desc: `Third place from ${seat} keeps you in the premium zone. You are still competing at the front, and one more push can move you higher next week.`,
      chips: ['#3 Rank', 'Solid Result', 'Keep Growing']
    };
  }
  if (safeRank === 4) {
    return {
      title: `Rank #4 for ${escapeHtml(name || 'User')}`,
      desc: `You are close to the top three from ${seat}. That is still strong, but the final climb is waiting — keep pushing next week.`,
      chips: ['#4 Rank', 'Close Call', 'Rise Higher']
    };
  }
  return {
    title: `Rank #5 for ${escapeHtml(name || 'User')}`,
    desc: `Right now you are in 5th place from ${seat}, the lowest position in the top five. That is a warning sign — regroup and come back much stronger next week.`,
    chips: ['#5 Rank', 'Lowest Top-5', 'Climb Up']
  };
}

function syncBestUsersSnapshotActionVisibility() {
  if (bestUsersHistoryBtn) {
    bestUsersHistoryBtn.classList.toggle('hidden', !currentUser);
  }
}

async function computeCurrentWeekRoomRankData() {
  const [attendanceSnap, seatsSnap, onlineSnap] = await Promise.all([
    db.ref('attendance').get(),
    db.ref('seats').get(),
    db.ref('onlineUsers').get()
  ]);

  const presenceMerged = mergePresenceMaps(
    getPresenceMapFromSeatsSnapshot(seatsSnap.val() || {}),
    getPresenceMapFromSeatsSnapshot(onlineSnap.val() || {})
  );
  const rawAttendanceEvents = Object.values(attendanceSnap.val() || {}).sort((a, b) => (a.time || 0) - (b.time || 0));
  const attendanceEvents = buildResolvedAttendanceEvents(rawAttendanceEvents, presenceMerged, Date.now());
  const roomSessions = buildRoomSessionsFromAttendance(attendanceEvents, presenceMerged, Date.now()).filter(item => isTimestampInSelectedRange(item.start, 'week'));
  const roomRank = aggregateTopUsers(roomSessions);
  return { roomRank, roomSessions, attendanceEvents };
}

async function showCurrentUserRankCelebration() {
  try {
    if (!currentUser || !currentSessionToken) return;
    const modalKey = `rank_modal_seen_${currentSessionToken}`;
    if (sessionStorage.getItem(modalKey) === '1') return;

    const { roomRank } = await computeCurrentWeekRoomRankData();
    const currentRankItem = roomRank.find(item => item.code === currentUser.code);
    if (!currentRankItem) return;

    const tone = getRankCelebrationTone(currentRankItem.rank);
    const message = getRankCelebrationMessage(currentRankItem.rank, currentUser.name, currentUser.code);

    if (rankCelebrationTitle) {
      rankCelebrationTitle.innerHTML = `<i class="bi ${tone.icon}"></i> ${message.title}`;
    }
    if (rankCelebrationBody) {
      rankCelebrationBody.innerHTML = `
        <div class="rank-celebrate-card ${tone.className}">
          <div class="rank-celebrate-pill ${tone.className}">
            <i class="bi ${tone.icon}"></i> ${tone.label}
          </div>
          <div class="rank-celebrate-title">${message.title}</div>
          <div class="rank-celebrate-desc">${message.desc}</div>
          <div class="rank-celebrate-footer">
            ${message.chips.map(chip => `<span class="rank-celebrate-chip">${chip}</span>`).join('')}
            <span class="rank-celebrate-chip">Seat ${escapeHtml(currentUser.code)}</span>
            <span class="rank-celebrate-chip">Rank #${currentRankItem.rank}</span>
          </div>
        </div>
      `;
    }
    rankCelebrationModalOverlay?.classList.remove('hidden');
    sessionStorage.setItem(modalKey, '1');
  } catch (_) {}
}

function closeRankCelebrationModal() {
  rankCelebrationModalOverlay?.classList.add('hidden');
}

async function openBestUsersHistoryModal() {
  try {
    if (!currentUser) {
      toast('Please join the room first to view your weekly history.', 'warning');
      return;
    }
    if (!bestUsersHistoryList) return;
    bestUsersHistoryList.innerHTML = '<div class="history-week-empty">Loading weekly history...</div>';
    bestUsersHistoryModalOverlay?.classList.remove('hidden');

    const [weeklyRoomSnap, weeklyCourseSnap] = await Promise.all([
      db.ref('weeklyHours').get(),
      db.ref('weeklyCourseHours').get()
    ]);

    const weeklyRoomData = weeklyRoomSnap.val() || {};
    const weeklyCourseData = weeklyCourseSnap.val() || {};
    const weekKeys = Array.from(new Set([
      ...Object.keys(weeklyRoomData),
      ...Object.keys(weeklyCourseData)
    ]))
      .filter((weekKey) => /^week_\d+_\d+_\d+$/.test(weekKey))
      .sort((a, b) => {
        const ma = a.match(/^week_(\d+)_(\d+)_(\d+)$/);
        const mb = b.match(/^week_(\d+)_(\d+)_(\d+)$/);
        const da = ma ? new Date(parseInt(ma[1], 10), parseInt(ma[2], 10) - 1, parseInt(ma[3], 10)) : new Date(0);
        const dbd = mb ? new Date(parseInt(mb[1], 10), parseInt(mb[2], 10) - 1, parseInt(mb[3], 10)) : new Date(0);
        return dbd - da;
      });

    if (!weekKeys.length) {
      bestUsersHistoryList.innerHTML = '<div class="history-week-empty">No weekly history yet.</div>';
      return;
    }

    const currentCode = normalizeSeatCode(currentUser.code);
    const assignRanks = (rows) => {
      let rank = 0;
      let lastMs = null;
      return rows.map((row) => {
        if (lastMs === null || row.totalMs !== lastMs) {
          rank += 1;
          lastMs = row.totalMs;
        }
        return { ...row, rank };
      });
    };
    const renderHistoryRows = (rows, type) => {
      if (!rows.length) {
        return `<div class="history-week-empty compact">No ${type} history yet.</div>`;
      }
      return rows.slice(0, 5).map((row, index) => {
        const rankLabel = row.rank || (index + 1);
        return `
          <div class="history-mini-row ${rankLabel === 1 ? 'rank-1' : ''}">
            ${getRankBadgeMarkup(rankLabel)}
            <div class="history-mini-body">
              <div class="history-mini-name">${escapeHtml(getCanonicalSeatName(row.code, row.name || 'Unknown'))}</div>
              <div class="history-mini-seat">Seat ${escapeHtml(row.code || '--')} · ${type === 'course' ? 'Course' : 'Room'}</div>
            </div>
            <div class="history-mini-time">${escapeHtml(formatSessionDuration(row.totalMs || 0))}</div>
          </div>
        `;
      }).join('');
    };

    const rendered = weekKeys.map((weekKey) => {
      const roomWeek = weeklyRoomData[weekKey] || {};
      const courseWeek = weeklyCourseData[weekKey] || {};

      const roomRows = assignRanks(Object.entries(roomWeek)
        .filter(([, ms]) => Number(ms) > 0)
        .map(([code, ms]) => ({
          code: normalizeSeatCode(code),
          name: getCanonicalSeatName(code, 'Unknown'),
          totalMs: Number(ms) || 0
        }))
        .sort((a, b) => b.totalMs - a.totalMs || String(a.name).localeCompare(String(b.name))));

      const courseRows = assignRanks(Object.entries(courseWeek)
        .filter(([, ms]) => Number(ms) > 0)
        .map(([code, ms]) => {
          const roomTotal = Number(roomWeek[normalizeSeatCode(code)] || 0);
          const safeTotal = Number(ms) || 0;
          return {
            code: normalizeSeatCode(code),
            name: getCanonicalSeatName(code, 'Unknown'),
            totalMs: roomTotal > 0 ? Math.min(safeTotal, roomTotal) : safeTotal
          };
        })
        .sort((a, b) => b.totalMs - a.totalMs || String(a.name).localeCompare(String(b.name))));

      if (!roomRows.length && !courseRows.length) return '';

      const roomMyRow = roomRows.find((row) => row.code === currentCode);
      const courseMyRow = courseRows.find((row) => row.code === currentCode);
      const label = getDisplayWeekRangeLabel(weekKey);

      const roomNote = roomMyRow
        ? (roomMyRow.rank === 1
          ? '<div class="history-week-note success">You led the room joined ranking this week.</div>'
          : `<div class="history-week-note">Your room rank: #${roomMyRow.rank} • ${formatSessionDuration(roomMyRow.totalMs)}</div>`)
        : '<div class="history-week-note">Your room join result was not recorded for this week.</div>';

      const courseNote = courseMyRow
        ? (courseMyRow.rank === 1
          ? '<div class="history-week-note success">You led the course entered ranking this week.</div>'
          : `<div class="history-week-note">Your course rank: #${courseMyRow.rank} • ${formatSessionDuration(courseMyRow.totalMs)}</div>`)
        : '<div class="history-week-note">Your course entry result was not recorded for this week.</div>';

      return `
        <div class="history-week-card">
          <div class="history-week-head">
            <div>
              <div class="history-week-title">${escapeHtml(weekKey.replace(/_/g, ' '))}</div>
              <div class="history-week-range">${label}</div>
            </div>
            <div class="rank-celebrate-chip">Weekly snapshot</div>
          </div>

          <div class="history-week-columns">
            <div class="history-week-column">
              <div class="history-week-box-title"><i class="bi bi-box-arrow-in-right"></i> Room Joined</div>
              <div class="history-week-column-list">
                ${renderHistoryRows(roomRows, 'room')}
              </div>
              ${roomNote}
            </div>

            <div class="history-week-column">
              <div class="history-week-box-title"><i class="bi bi-mortarboard-fill"></i> Course Entered</div>
              <div class="history-week-column-list">
                ${renderHistoryRows(courseRows, 'course')}
              </div>
              ${courseNote}
            </div>
          </div>
        </div>
      `;
    }).filter(Boolean);

    bestUsersHistoryList.innerHTML = rendered.join('') || '<div class="history-week-empty">No weekly history yet.</div>';
  } catch (_) {
    bestUsersHistoryList.innerHTML = '<div class="history-week-empty">Unable to load weekly history right now.</div>';
  }
}

function closeBestUsersHistoryModal() {
  bestUsersHistoryModalOverlay?.classList.add('hidden');
}


bestUsersHistoryBtn?.addEventListener("click", () => {
  openBestUsersHistoryModal();
});
closeBestUsersHistoryModalBtn?.addEventListener("click", closeBestUsersHistoryModal);
bestUsersHistoryCloseBtn?.addEventListener("click", closeBestUsersHistoryModal);
bestUsersHistoryModalOverlay?.addEventListener("click", (event) => {
  if (event.target === bestUsersHistoryModalOverlay) closeBestUsersHistoryModal();
});

closeRankCelebrationModalBtn?.addEventListener("click", closeRankCelebrationModal);
rankCelebrationCloseBtn?.addEventListener("click", closeRankCelebrationModal);
rankCelebrationModalOverlay?.addEventListener("click", (event) => {
  if (event.target === rankCelebrationModalOverlay) closeRankCelebrationModal();
});

async function renderWeeklyBestUsersSnapshot() {
  const panel = bestUsersSnapshotPanel || document.getElementById("bestUsersSnapshotPanel");
  const roomList = document.getElementById("bestUsersRoomJoinedList");
  const courseList = document.getElementById("bestUsersCourseEnteredList");
  const joinedCount = document.getElementById("bestUsersJoinedCount");
  const courseCount = document.getElementById("bestUsersCourseCount");
  if (!panel || !roomList || !courseList) return;
  syncBestUsersSnapshotActionVisibility();
  const now = Date.now();
  if (window.__weeklyBestUsersSnapshotLoading) return;
  if (window.__weeklyBestUsersSnapshotLastAt && (now - window.__weeklyBestUsersSnapshotLastAt) < 25000) return;
  window.__weeklyBestUsersSnapshotLastAt = now;
  window.__weeklyBestUsersSnapshotLoading = true;

  try {
    const [attendanceSnap, courseSnap, seatsSnap, onlineSnap] = await Promise.all([
      db.ref("attendance").get(),
      db.ref(COURSE_SESSION_COLLECTION).get(),
      db.ref("seats").get(),
      db.ref("onlineUsers").get()
    ]);

    const presenceMerged = mergePresenceMaps(
      getPresenceMapFromSeatsSnapshot(seatsSnap.val() || {}),
      getPresenceMapFromSeatsSnapshot(onlineSnap.val() || {})
    );
    const rawAttendanceEvents = Object.values(attendanceSnap.val() || {}).sort((a, b) => (a.time || 0) - (b.time || 0));
    const attendanceEvents = buildResolvedAttendanceEvents(rawAttendanceEvents, presenceMerged, now);
    const roomSessions = buildRoomSessionsFromAttendance(attendanceEvents, presenceMerged, now).filter(item => isTimestampInSelectedRange(item.start, "week"));
    const roomTotalsMap = buildSessionTotalsMap(roomSessions);
    const courseSessions = buildCourseSessions(Object.values(courseSnap.val() || {}), presenceMerged, now, roomSessions).filter(item => isTimestampInSelectedRange(item.start, "week"));

    const roomRank = aggregateTopUsers(roomSessions);
    const courseRank = aggregateTopUsers(courseSessions, roomTotalsMap);

    const roomUnique = new Set(roomSessions.map(s => s.code)).size;
    const courseUnique = new Set(courseSessions.map(s => s.code)).size;
    if (joinedCount) joinedCount.textContent = `Joined: ${roomUnique}`;
    if (courseCount) courseCount.textContent = `Course entered: ${courseUnique}`;

    const renderRankList = (target, items, emptyText, type) => {
      if (!target) return;
      if (!items.length) {
        target.innerHTML = `<div class="mini-rank-empty">${emptyText}</div>`;
        return;
      }

      target.innerHTML = items.slice(0, 5).map((item, index) => {
        const rankLabel = item.rank || (index + 1);
        const timeLabel = formatSessionDuration(item.totalMs || 0);
        const rankClass = rankLabel === 1 ? "rank-1" : "";
        const fallingDots = rankLabel === 1 ? `
          <span class="rank-falling-dots" aria-hidden="true">
            ${Array.from({ length: 100 }, (_, dotIndex) => {
              const column = dotIndex % 20;
              const row = Math.floor(dotIndex / 20);
              const left = column * 5;
              const top = row * 8;
              const delay = (dotIndex % 25) * 0.08;
              return `<span style="left:${left}%; top:${top}px; animation-delay:${delay}s"></span>`;
            }).join('')}
          </span>
        ` : '';
        return `
          <div class="mini-rank-row ${rankClass}">
            ${getRankBadgeMarkup(rankLabel)}
            <div class="mini-rank-body">
              <div class="mini-rank-name">${fallingDots}<span class="mini-rank-name-text">${escapeHtml(getCanonicalSeatName(item.code, item.name || "Unknown"))}</span></div>
              <div class="mini-rank-seat">Seat ${escapeHtml(item.code || "--")} · ${type === "course" ? "Course" : "Room"}</div>
            </div>
            <div class="mini-rank-time">${escapeHtml(timeLabel)}</div>
          </div>
        `;
      }).join("");
    };

    renderRankList(roomList, roomRank, "No room joins yet.", "room");
    renderRankList(courseList, courseRank, "No course entries yet.", "course");
  } catch (_) {
    roomList.innerHTML = '<div class="mini-rank-empty">Unable to load snapshot right now.</div>';
    courseList.innerHTML = '<div class="mini-rank-empty">Unable to load snapshot right now.</div>';
  } finally {
    window.__weeklyBestUsersSnapshotLoading = false;
  }
}



async function renderAttendanceReportModal(options = {}) {
  if (!attendanceReportModalOverlay) return;
  const isSilent = !!options.silent;
  if (!isSilent) {
    attendanceReportSessionsList.innerHTML = '<div style="padding:12px; color:var(--text-secondary); font-size:12px;">Loading attendance report...</div>';
    attendanceReportTopUsersList.innerHTML = '';
    attendanceReportSummaryGrid.innerHTML = '';
  }

  const [attendanceSnap, courseSnap, seatsSnap, onlineSnap] = await Promise.all([
    db.ref('attendance').get(),
    db.ref(COURSE_SESSION_COLLECTION).get(),
    db.ref('seats').get(),
    db.ref('onlineUsers').get()
  ]);

  const presenceMap = mergePresenceMaps(
    getPresenceMapFromSeatsSnapshot(seatsSnap.val() || {}),
    getPresenceMapFromSeatsSnapshot(onlineSnap.val() || {})
  );
  const rawAttendanceEvents = Object.values(attendanceSnap.val() || {}).sort((a, b) => (a.time || 0) - (b.time || 0));
  const attendanceEvents = buildResolvedAttendanceEvents(rawAttendanceEvents, presenceMap);
  const roomSessions = buildRoomSessionsFromAttendance(attendanceEvents, presenceMap, Date.now());
  const courseSessions = buildCourseSessions(Object.values(courseSnap.val() || {}), presenceMap, Date.now(), roomSessions);

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
            <div class="report-session-title">${escapeHtml(getCanonicalSeatName(session.code, session.name || "Unknown"))} <span class="report-session-seat">Seat ${escapeHtml(session.code)}</span></div>
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
            <div class="report-session-title">${escapeHtml(getCanonicalSeatName(session.code, session.name || "Unknown"))} <span class="report-session-seat">Seat ${escapeHtml(session.code)}</span></div>
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
        <div class="report-rank-index">#${user.rank || (index + 1)}</div>
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
        <option value="05">Eng Shafie</option>
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

function scheduleImmediateStaleSessionSweep(force = false) {
  clearTimeout(immediateStaleSweepTimeout);
  immediateStaleSweepForce = immediateStaleSweepForce || !!force;
  immediateStaleSweepTimeout = setTimeout(() => {
    const shouldForce = immediateStaleSweepForce;
    immediateStaleSweepTimeout = null;
    immediateStaleSweepForce = false;
    sweepStaleSessions({ force: shouldForce }).catch(() => {});
  }, 0);
}

async function sweepStaleSessions(options = {}) {
  const { force = false } = options;
  try {
    const [seatsSnap, leasesSnap, onlineSnap] = await Promise.all([
      db.ref("seats").get(),
      db.ref("seatLeases").get(),
      db.ref("onlineUsers").get()
    ]);
    const seats = seatsSnap.val() || {};
    const leases = leasesSnap.val() || {};
    const onlineUsers = onlineSnap.val() || {};
    const allCodes = new Set([
      ...Object.keys(seats),
      ...Object.keys(leases),
      ...Object.values(onlineUsers).map(user => normalizeSeatCode(user?.code || user?.seat || "--"))
    ]);
    for (const code of allCodes) {
      const seatData = seats[code] || {};
      const leaseData = leases[code] || null;
      const onlineMatch = Object.values(onlineUsers).find(user => normalizeSeatCode(user?.code || user?.seat || "--") === code) || null;
      const merged = { ...onlineMatch, ...leaseData, ...seatData, code };
      const sessionToken = merged.sessionToken || leaseData?.sessionToken || seatData.sessionToken;
      if (!sessionToken) continue;
      if (!force && (isPresenceFresh(merged) || merged.exitLoggedAt) && !isSessionOverLimit(merged)) continue;
      await closeStalePresenceSession(merged, leaseData);
    }
  } catch (_) {}
}

function startStaleSessionMonitor() {
  if (staleSessionMonitorInterval) clearInterval(staleSessionMonitorInterval);
  staleSessionMonitorInterval = setInterval(() => {
    sweepStaleSessions().catch(() => {});
  }, 60000);
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
    if (!currentUser && !isAdminAuthenticated) return;
    sweepStaleSessions().catch(() => {});
  }, 30000);
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
  const status = String(sessionData.status || "").toLowerCase();
  if (sessionData.leftAt || sessionData.exitLoggedAt || sessionData.disconnectRequestedAt || sessionData.exitPending) return true;
  if (status === "offline" || status === "left" || status === "expired" || status === "terminated") return true;

  const expiresAt = Number(sessionData.expiresAt);
  if (Number.isFinite(expiresAt) && expiresAt > 0) {
    return now >= expiresAt;
  }

  const sessionStart = getSessionRoomStartTimestamp(sessionData, now);
  return (now - sessionStart) >= SESSION_LIMIT;
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
  autoRemovalTimeoutInstance = null;
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
      historicalMs += getElapsedSessionMsFromUser(currentUser);
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

  syncBrowserTitle();
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
  const normalizedCode = normalizeSeatCode(code);
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
  resetAttendanceEventWriteCache();
  sessionStorage.setItem("active_session_token", currentSessionToken);
  localStorage.setItem("active_session_token", currentSessionToken);
  const now = Date.now();
  const joinedAt = now;
  currentUser = {
    id: userId,
    name: getCanonicalSeatName(normalizedCode, targetSeat.name),
    code: normalizedCode,
    joinedAt,
    start: joinedAt,
    roomJoinedAt: joinedAt,
    expiresAt: joinedAt + SESSION_LIMIT,
    status: "active",
    inCourse: false,
    courseEnteredAt: 0,
    activeCourseName: "",
    lastSeen: now,
    heartbeatAt: now,
    leftAt: 0,
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
    joinedAt: currentUser.joinedAt,
    roomJoinedAt: currentUser.roomJoinedAt,
    expiresAt: currentUser.expiresAt,
    status: currentUser.status,
    leftAt: 0,
    lastSeen: now,
    heartbeatAt: now
  });

  await registerSessionDisconnectHandlers().catch(() => {});

  await pushAttendanceOnce({
    name: getCanonicalSeatName(normalizedCode, targetSeat.name),
    code: normalizedCode,
    action: "join",
    time: now,
    joinedAt: currentUser.joinedAt,
    roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || 0,
    expiresAt: currentUser.expiresAt,
    sessionToken: currentSessionToken
  });

  toast(`Identity verified! Welcome ${getCanonicalSeatName(normalizedCode, targetSeat.name)}`, "success");
  formBox.classList.add("hidden");
  pinActionBox.classList.remove("hidden");
  setStatusText(true, normalizedCode, getCanonicalSeatName(normalizedCode, targetSeat.name));
  showJoinWelcomePopup(getCanonicalSeatName(normalizedCode, targetSeat.name), normalizedCode);

  startTimer();
  startSessionHeartbeat();
  syncPersonalAccumulatedTime(normalizedCode);
  localStorage.setItem("active_user", userId);
  updateCourseActionButton();
  focusDefaultCourseAction();
  syncBestUsersSnapshotActionVisibility();
  renderLessonsUI();
  setTimeout(() => showCurrentUserRankCelebration().catch(() => {}), 1200);
}



async function leaveRoom(auto = false, reason = "leave") {
  if (!currentUser || isSessionTeardownInProgress) return;
  isSessionTeardownInProgress = true;

  try {
    const code = currentUser.code;
    const id = currentUser.id;
    const name = currentUser.name;
    const roomJoinedAt = getSessionRoomStartTimestamp(currentUser);
    const courseEnteredAt = getSessionCourseStartTimestamp(currentUser, roomJoinedAt);
    const leaveTime = Date.now();
    const sessionDuration = Math.min(SESSION_LIMIT, Math.max(0, leaveTime - roomJoinedAt));
    const courseDuration = Math.min(sessionDuration, Math.max(0, leaveTime - courseEnteredAt));
    const liveToken = currentSessionToken;
    const wasInCourse = !!currentUser.inCourse;
    const wasHandRaised = !!currentUser.handRaised;
    const activeCourseName = currentUser.activeCourseName || "Full Stack AI Engineer";

    const exitClaim = await claimSessionExitOnce(code, liveToken, auto ? "stale-session-sweep" : reason, leaveTime);
    if (!exitClaim.claimed && !currentUser.leftAt && !currentUser.exitLoggedAt && !isSessionOverLimit(currentUser)) {
      return;
    }

    const finalAction = getFinalExitAttendanceAction({ wasInCourse, wasHandRaised });
    const offlineStamp = buildOfflineExitStamp({
      roomJoinedAt,
      leaveTime,
      exitReason: auto ? "stale-session-sweep" : reason,
      courseEnteredAt,
      activeCourseName,
      sessionToken: liveToken
    });

    if (wasInCourse) {
      await finalizeActiveCourseSession(auto ? "terminated" : reason, courseEnteredAt, leaveTime);
    }

    await pushAttendanceOnce({
      name,
      code,
      action: finalAction,
      time: leaveTime,
      joinedAt: roomJoinedAt,
      leftAt: leaveTime,
      sessionDuration: finalAction === "course-leave" ? courseDuration : sessionDuration,
      reason: auto ? "stale-session-sweep" : reason,
      courseName: activeCourseName,
      sessionToken: liveToken
    });

    await Promise.all([
      db.ref(`seatLeases/${code}`).update(offlineStamp).catch(() => {}),
      db.ref(`seats/${code}`).update(offlineStamp).catch(() => {}),
      db.ref(`onlineUsers/${id}`).update(offlineStamp).catch(() => {})
    ]);

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

    await db.ref(`weeklyHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration).catch(() => {});
    await db.ref(`weeklyCourseHours/${getWeekIdentifier()}/${code}`).transaction(v => (v || 0) + (wasInCourse ? courseDuration : 0)).catch(() => {});
    await db.ref(`dailyHours/${getTodayIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration).catch(() => {});
    await db.ref(`monthlyHours/${getMonthIdentifier()}/${code}`).transaction(v => (v || 0) + sessionDuration).catch(() => {});
    await db.ref(`allTimeHours/${code}`).transaction(v => (v || 0) + sessionDuration).catch(() => {});

    toast(auto ? "Session closed after the browser stopped sending heartbeats." : "Workspace link destroyed successfully.", "info");
    clearActiveSessionStorage();
    updateCourseActionButton();
    syncBestUsersSnapshotActionVisibility();
    closeRankCelebrationModal();
    closeBestUsersHistoryModal();
    renderLessonsUI();
  } finally {
    isSessionTeardownInProgress = false;
  }
}



function listenToActiveKicks
(userId) {

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
    playCourseOccupiedAlarm();
    toast(`CRITICAL RISK ACCESS ERROR: Course resource currently claimed by ${currentOccupantName} (Seat ${currentOccupantSeat})!`, "danger-alert-occupied");
    triggerTitleDangerAlert("🚨 DANGER ALERT", "⚠️ WORKSPACE COLLISION");
    return;
  }

  currentUser.inCourse = true;
  currentUser.activeCourseName = "Full Stack AI Engineer";
  currentUser.courseEnteredAt = Date.now();
  currentUser.lastSeen = Date.now();
  currentUser.heartbeatAt = Date.now();
  currentCourseSessionId = await findOpenCourseSessionId(currentUser.code, currentSessionToken) || db.ref(COURSE_SESSION_COLLECTION).push().key;
  syncBrowserTitle();
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

  const activeCourseSessionRef = db.ref(`${COURSE_SESSION_COLLECTION}/${currentCourseSessionId}`);
  const activeCourseSessionSnap = await activeCourseSessionRef.get().catch(() => null);
  if (activeCourseSessionSnap && activeCourseSessionSnap.exists && activeCourseSessionSnap.exists()) {
    await activeCourseSessionRef.update({
      name: currentUser.name,
      code: currentUser.code,
      courseName: currentUser.activeCourseName,
      sessionToken: currentSessionToken,
      roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || currentUser.courseEnteredAt,
      startLabel: formatAbsoluteDateTime(Number(activeCourseSessionSnap.val()?.start) || currentUser.courseEnteredAt)
    }).catch(() => {});
  } else {
    await activeCourseSessionRef.set({
      name: currentUser.name,
      code: currentUser.code,
      courseName: currentUser.activeCourseName,
      sessionToken: currentSessionToken,
      start: currentUser.courseEnteredAt,
      roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || currentUser.courseEnteredAt,
      startLabel: formatAbsoluteDateTime(currentUser.courseEnteredAt),
      end: 0,
      duration: 0,
      status: "active"
    });
  }

  await db.ref("onlineUsers/" + currentUser.id).update({
    inCourse: true,
    activeCourseName: currentUser.activeCourseName,
    roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || 0,
    courseEnteredAt: currentUser.courseEnteredAt,
    lastSeen: currentUser.lastSeen,
    heartbeatAt: currentUser.heartbeatAt
  });

  await db.ref("seats/" + currentUser.code).update({
    inCourse: true,
    activeCourseName: currentUser.activeCourseName,
    roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || 0,
    courseEnteredAt: currentUser.courseEnteredAt,
    lastSeen: currentUser.lastSeen,
    heartbeatAt: currentUser.heartbeatAt
  });

  await pushAttendanceOnce({
    name: currentUser.name,
    code: currentUser.code,
    action: "course-enter",
    time: Date.now(),
    roomJoinedAt: currentUser.roomJoinedAt || currentUser.start || 0,
    joinedAt: currentUser.joinedAt || currentUser.start || 0,
    courseName: currentUser.activeCourseName,
    sessionToken: currentSessionToken
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
  pushAttendanceOnce({
    name,
    code,
    action,
    time: Number.isFinite(extras.time) ? extras.time : Date.now(),
    reason,
    courseName: extras.courseName || "",
    sessionToken: extras.sessionToken || currentSessionToken
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

if (bestUsersSnapshotToggleBtn) {
  bestUsersSnapshotToggleBtn.addEventListener("click", toggleBestUsersSnapshot);
}

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
    const seatsSignature = Object.keys(activeSeats).sort().map(code => {
      const u = activeSeats[code] || {};
      return [code, u.sessionToken || "", u.exitPending ? 1 : 0, u.disconnectRequestedAt || 0, u.exitLoggedAt || 0, u.lastSeen || 0, u.heartbeatAt || 0].join(":");
    }).join("|");
    if (seatsSignature !== lastSeatsPresenceSignature) {
      lastSeatsPresenceSignature = seatsSignature;
    }
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
        entryTimestamp = getSessionCourseStartTimestamp(u, Date.now());
      }
    });

    if (isOccupied) {
      let formattedTime = formatAbsoluteDateTime(entryTimestamp);
      courseActiveOccupantSublabel.innerHTML = `<span class="course-alert-occupied-tag"><i class="bi bi-exclamation-triangle-fill"></i> Resource Engaged: ${userCourseName} (Seat ${occupantSeatLabel}) at ${formattedTime}</span>`;
    } else {
      courseActiveOccupantSublabel.innerHTML = `<span class="course-alert-available-tag"><i class="bi bi-check-circle-fill"></i> Workspace Available Now</span>`;
    }
  });

  db.ref("onlineUsers").on("value", (snap) => {
    usersList.innerHTML = "";
    const users = snap.val() || {};
    const usersSignature = Object.keys(users).sort().map(id => {
      const u = users[id] || {};
      return [id, u.code || "", u.sessionToken || "", u.exitPending ? 1 : 0, u.disconnectRequestedAt || 0, u.exitLoggedAt || 0, u.lastSeen || 0, u.heartbeatAt || 0].join(":");
    }).join("|");
    if (usersSignature !== lastOnlinePresenceSignature) {
      lastOnlinePresenceSignature = usersSignature;
    }
    const freshUsersMap = new Map();
    Object.values(users)
      .filter(u => isPresenceFresh(u))
      .forEach((u) => {
        const key = u.id || `${u.code || "seat"}_${u.sessionToken || createStableId("local")}`;
        freshUsersMap.set(key, { ...u });
      });

    if (currentUser && currentSessionToken) {
      const currentPresent = [...freshUsersMap.values()].some(u => u.id === currentUser.id || u.sessionToken === currentSessionToken || u.code === currentUser.code);
      if (!currentPresent) {
        freshUsersMap.set(currentUser.id || `local_${currentUser.code}`, {
          ...currentUser,
          lastSeen: Date.now(),
          heartbeatAt: Date.now(),
          sessionToken: currentSessionToken,
          visibilityState: getCurrentVisibilityState(),
          inCourse: !!currentUser.inCourse,
          activeCourseName: currentUser.activeCourseName || "",
          courseEnteredAt: currentUser.courseEnteredAt || 0
        });
      }
    }

    const freshUsers = [...freshUsersMap.values()].sort((a, b) => {
        const bCourse = b.inCourse ? 1 : 0;
        const aCourse = a.inCourse ? 1 : 0;
        if (bCourse !== aCourse) return bCourse - aCourse;
        if ((b.courseEnteredAt || 0) !== (a.courseEnteredAt || 0)) return (b.courseEnteredAt || 0) - (a.courseEnteredAt || 0);
        return (b.start || 0) - (a.start || 0);
      });

    refreshRaisedHandsBoard(freshUsers);

    const onlineCountValue = freshUsers.length;
    if (onlineCount) {
      onlineCount.innerText = onlineCountValue;
      onlineCount.classList.toggle("counter-online", onlineCountValue > 0);
      onlineCount.classList.toggle("counter-offline", onlineCountValue === 0);
    }

    if (onlineCountValue === 0) {
      scheduleImmediateStaleSessionSweep(true);
    }

    if (freshUsers.length === 0) {
      usersList.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:13px;">No developers currently active in workspace.</div>';
      renderWeeklyBestUsersSnapshot().catch(() => {});
      return;
    }

    freshUsers.forEach(u => {
      const card = document.createElement("div");
      card.className = "user-card";

      const roomJoinedLabel = formatAbsoluteDateTime(getSessionRoomStartTimestamp(u));
      const courseJoinedLabel = u.inCourse && u.courseEnteredAt ? formatAbsoluteDateTime(getSessionCourseStartTimestamp(u)) : "";

      let badgeHtml = "";
      if (u.inCourse) {
        const pathTime = u.courseEnteredAt ? formatAbsoluteDateTime(getSessionCourseStartTimestamp(u)) : "";
        badgeHtml = `<span class="in-course-indicator-tag in-course-danger-tag"><i class="bi bi-mortarboard-fill"></i> ${u.activeCourseName || 'In Course'} (${pathTime})</span>`;
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
          <div class="student-session-meta">
            <span class="student-session-meta-line"><i class="bi bi-box-arrow-in-right"></i> Room joined: ${escapeHtml(roomJoinedLabel)}</span>
            ${u.inCourse ? `<span class="student-session-meta-line course"><i class="bi bi-mortarboard-fill"></i> Course entered: ${escapeHtml(courseJoinedLabel)}</span>` : ''}
          </div>
          <div class="live-elapsed-badge" data-start="${getSessionRoomStartTimestamp(u)}">0s</div>
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
    renderWeeklyBestUsersSnapshot().catch(() => {});
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
    badge.innerText = formatElapsedDuration(difference);
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
      const [seatSnap, leaseSnap, usersSnap] = await Promise.all([
        db.ref(`seats/${code}`).get(),
        db.ref(`seatLeases/${code}`).get(),
        db.ref("onlineUsers").get()
      ]);

      if (!seatSnap.exists() && !leaseSnap.exists()) {
        toast(`Seat ${code} is already cleared.`, "info");
        return;
      }

      const seatData = seatSnap.val() || {};
      const leaseData = leaseSnap.val() || {};
      const endTime = Date.now();
      const duration = Math.max(0, endTime - (seatData.start || leaseData.start || endTime));
      const seatToken = seatData.sessionToken || leaseData.sessionToken || "";
      const seatUserId = seatData.id || seatData.ownerId || leaseData.ownerId || "";
      const displayName = seatData.name || leaseData.name || getSeatDisplayName(code, "Unknown");

      if (seatData.inCourse || leaseData.inCourse) {
        await finalizeCourseSessionsForPresence({
          code,
          sessionToken: seatToken,
          reason: 'admin-terminated',
          endTime,
          startOverride: seatData.courseEnteredAt || leaseData.courseEnteredAt || seatData.start || leaseData.start || endTime,
          roomJoinedAt: seatData.roomJoinedAt || leaseData.roomJoinedAt || seatData.start || leaseData.start || 0,
          courseName: seatData.activeCourseName || leaseData.activeCourseName || 'Full Stack AI Engineer',
          name: displayName
        });
      }

      const onlineRemovals = [];
      const onlineUsers = usersSnap.val() || {};
      Object.entries(onlineUsers).forEach(([userId, user]) => {
        if (!user) return;
        const matchesSeat = user.code === code || user.seat === code;
        const matchesToken = seatToken && user.sessionToken === seatToken;
        const matchesOwner = seatUserId && (userId === seatUserId || user.id === seatUserId || user.ownerId === seatUserId);
        if (matchesSeat || matchesToken || matchesOwner) {
          onlineRemovals.push(db.ref(`onlineUsers/${userId}`).remove().catch(() => {}));
        }
      });

      await Promise.all([
        db.ref(`seatLeases/${code}`).remove().catch(() => {}),
        db.ref(`seats/${code}`).remove().catch(() => {}),
        ...onlineRemovals
      ]);

      await pushAttendanceOnce({
        name: displayName,
        code,
        action: "terminated",
        time: endTime,
        sessionDuration: duration,
        roomJoinedAt: seatData.roomJoinedAt || leaseData.roomJoinedAt || seatData.start || leaseData.start || 0,
        reason: "admin-kick",
        sessionToken: seatToken
      });

      if (seatToken) {
        await Promise.all([
          db.ref(`seatLeases/${code}`).transaction((cur) => {
            if (cur && cur.sessionToken === seatToken) return null;
            return cur;
          }).catch(() => {}),
          db.ref(`seats/${code}`).transaction((cur) => {
            if (cur && cur.sessionToken === seatToken) return null;
            return cur;
          }).catch(() => {})
        ]);
      }

      toast(`Seat ${code} cleared by administrative command.`, "info");
    }
  );
};
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
            currentUser.name = getCanonicalSeatName(currentUser.code, currentUser.name);
      const restoredJoinedAt = getSessionRoomStartTimestamp(currentUser, Date.now());
      currentUser.joinedAt = restoredJoinedAt;
      currentUser.roomJoinedAt = restoredJoinedAt;
      currentUser.start = restoredJoinedAt;
      currentUser.courseEnteredAt = getSessionCourseStartTimestamp(currentUser, restoredJoinedAt);
      currentUser.expiresAt = getSessionExpiryTimestamp(currentUser, restoredJoinedAt);
      currentUser.status = currentUser.status && currentUser.status !== "offline" ? currentUser.status : (currentUser.inCourse ? "in-course" : "active");

      formBox.classList.add("hidden");
      leaveBtn.classList.remove("hidden");
      pinActionBox.classList.remove("hidden");
      setStatusText(true, currentUser.code, getCanonicalSeatName(currentUser.code, currentUser.name));
      syncBrowserTitle();
      updateCourseActionButton();
      focusDefaultCourseAction();

      startTimer();
      syncPersonalAccumulatedTime(currentUser.code);
      listenToActiveKicks(cacheUserId);
      listenToSeatLease(currentUser.code);

      const remainingTime = Math.max(0, currentUser.expiresAt - Date.now());

      
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
  bindVisibilityPresenceSync();
  bindUnloadPresenceCleanup();
  scheduleImmediateStaleSessionSweep();
  startStaleSessionMonitor();
  startAttendanceAutoRefresh();
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
