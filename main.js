const form = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");
const codeInput = document.getElementById("codeInput");
const pinInput = document.getElementById("pinInput");

const leaveBtn = document.getElementById("leaveBtn");
const changePinBtn = document.getElementById("changePinBtn");
const adminBtn = document.getElementById("adminLoginBtn");

const formBox = document.getElementById("formBox");
const status = document.getElementById("userStatus");
const remember = document.getElementById("rememberMe");

/* ======================
   TOAST
====================== */
function toast(msg, type="info"){
  const box = document.getElementById("toastContainer");
  const d = document.createElement("div");
  d.className = "toast " + type;
  d.textContent = msg;
  box.appendChild(d);
  setTimeout(()=>d.remove(),3000);
}

/* ======================
   JOIN SUCCESS FIX
====================== */
window.onJoinSuccess = function(code){
  status.textContent = "Joined (Seat " + code + ")";
  status.classList.add("active");

  formBox.classList.add("hidden");
  leaveBtn.classList.remove("hidden");
  changePinBtn.classList.remove("hidden");
};

/* ======================
   LEAVE FIX
====================== */
window.onLeaveSuccess = function(){
  status.textContent = "Not joined";
  status.classList.remove("active");

  formBox.classList.remove("hidden");
  leaveBtn.classList.add("hidden");
  changePinBtn.classList.add("hidden");
};

/* ======================
   SUBMIT
====================== */
form.addEventListener("submit", e => {
  e.preventDefault();

  window.joinRoom(
    nameInput.value,
    codeInput.value,
    pinInput.value
  );
});

/* ======================
   LEAVE
====================== */
leaveBtn.onclick = () => window.leaveRoom();

/* ======================
   CHANGE PIN FIX
====================== */
changePinBtn.onclick = async () => {
  const newPin = prompt("New PIN:");
  if (!newPin) return;

  const code = codeInput.value;
  await firebase.database().ref("seats/" + code + "/pin").set(newPin);

  toast("PIN updated", "success");
};

/* ======================
   ADMIN LOGIN UI
====================== */
adminBtn.onclick = () => {
  const email = prompt("Admin email");
  const pass = prompt("Password");

  window.loginAdmin(email, pass);
};

/* ======================
   REMEMBER ME FIX
====================== */
window.addEventListener("load", () => {
  const saved = localStorage.getItem("savedUser");

  if (saved) {
    const user = JSON.parse(saved);
    window.joinRoom(user.name, user.code, user.pin || "");
  }
});
