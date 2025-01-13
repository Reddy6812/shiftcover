// public/scripts/script.js
document.addEventListener("DOMContentLoaded", () => {
  const reqDateInput = document.getElementById("reqDateInput");
  const reqStartTime = document.getElementById("reqStartTime");
  const reqEndTime = document.getElementById("reqEndTime");
  const reqShiftType = document.getElementById("reqShiftType");
  const reqUserName = document.getElementById("reqUserName");
  const reqUserEmail = document.getElementById("reqUserEmail");
  const requestForm = document.getElementById("requestForm");
  const approvedTableBody = document.querySelector("#approvedTable tbody");

  // Load only approved requests and display them to the user
  function loadApproved() {
    fetch('/api/requests')
      .then(res => res.json())
      .then(requests => {
        approvedTableBody.innerHTML = "";
        const approved = requests.filter(r => r.status === "approved");
        approved.forEach((r, i) => {
          const row = approvedTableBody.insertRow();
          row.insertCell().textContent = i + 1;
          row.insertCell().textContent = r.date;
          row.insertCell().textContent = r.startTime;
          row.insertCell().textContent = r.endTime;
          row.insertCell().textContent = r.shiftType;
        });
      })
      .catch(err => console.error("Error loading approved requests:", err));
  }
  loadApproved();

  // Handle submission of a new shift request
  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateVal = reqDateInput.value;
    const startVal = reqStartTime.value;
    const endVal = reqEndTime.value;
    const shiftVal = reqShiftType.value;
    const nameVal = reqUserName.value;
    const emailVal = reqUserEmail.value;
    
    if (!dateVal || !startVal || !endVal || !shiftVal || !nameVal || !emailVal) {
      alert("Fill in all fields!");
      return;
    }
    
    fetch('/api/requests', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: dateVal,
        startTime: startVal,
        endTime: endVal,
        shiftType: shiftVal,
        userName: nameVal,
        userEmail: emailVal
      })
    })
      .then(res => res.json())
      .then(data => {
        alert("Request submitted and pending approval.");
        requestForm.reset();
        loadApproved();
      })
      .catch(err => {
        console.error("Error submitting request:", err);
        alert("There was an error submitting your request. Please try again.");
      });
  });
});
