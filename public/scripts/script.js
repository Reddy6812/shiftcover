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

  // Function to load only approved requests for display
  async function loadApproved() {
    try {
      const response = await fetch('/api/requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const requests = await response.json();
      approvedTableBody.innerHTML = "";
      const approved = requests.filter(r => r.status === "approved");

      if (approved.length === 0) {
        const row = approvedTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = "No approved shift covers available.";
        cell.style.textAlign = "center";
        return;
      }

      approved.forEach((r, i) => {
        const row = approvedTableBody.insertRow();
        row.insertCell().textContent = i + 1;
        row.insertCell().textContent = r.date;
        row.insertCell().textContent = r.start_time;
        row.insertCell().textContent = r.end_time;
        row.insertCell().textContent = r.shift_type;
      });
    } catch (error) {
      console.error("Error loading approved requests:", error);
      alert("Failed to load approved shifts. Please try again later.");
    }
  }

  // Handle submission of new shift request
  requestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dateVal = reqDateInput.value;
    const startVal = reqStartTime.value.trim();
    const endVal = reqEndTime.value.trim();
    const shiftVal = reqShiftType.value;
    const nameVal = reqUserName.value.trim();
    const emailVal = reqUserEmail.value.trim();
    
    if (!dateVal || !startVal || !endVal || !shiftVal || !nameVal || !emailVal) {
      alert("Please fill in all fields.");
      return;
    }
    
    const newRequest = {
      date: dateVal,
      start_time: startVal,
      end_time: endVal,
      shift_type: shiftVal,
      user_name: nameVal,
      user_email: emailVal,
    };
    
    try {
      const response = await fetch('/api/requests', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest)
      });
      if (!response.ok) throw new Error('Failed to submit request');
      alert("Your shift cover request has been submitted and is pending approval.");
      requestForm.reset();
      loadApproved();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again later.");
    }
  });

  loadApproved();
});
