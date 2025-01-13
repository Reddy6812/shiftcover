// public/scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
  const reqDateInput = document.getElementById("reqDateInput");
  const reqSlotSelect = document.getElementById("reqSlotSelect");
  const reqShiftType = document.getElementById("reqShiftType");
  const reqUserName = document.getElementById("reqUserName");
  const reqUserEmail = document.getElementById("reqUserEmail");
  const requestForm = document.getElementById("requestForm");
  
  const myRequestsTableBody = document.querySelector("#myRequestsTable tbody");
  
  // 1) On date change, load the time slots for that date
  reqDateInput.addEventListener("change", () => {
    const dateVal = reqDateInput.value;
    if (!dateVal) return;
  
    // Clear old slots and add default text
    reqSlotSelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.textContent = `-- Time slots for ${dateVal} --`;
    reqSlotSelect.appendChild(defaultOpt);
  
    fetch(`/api/timeslots?date=${dateVal}`)
      .then(res => res.json())
      .then(slots => {
        if (!slots.length) {
          const noOpt = document.createElement("option");
          noOpt.disabled = true;
          noOpt.textContent = "No slots for this date.";
          reqSlotSelect.appendChild(noOpt);
        } else {
          slots.forEach(s => {
            // Each slot has: { id, date, startTime, endTime }
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = `${s.startTime} - ${s.endTime}`;
            reqSlotSelect.appendChild(opt);
          });
        }
      })
      .catch(err => console.error("Error fetching timeslots:", err));
  });
  
  // 2) Load existing requests
  function loadRequests() {
    fetch('/api/requests')
      .then(res => res.json())
      .then(requests => {
        myRequestsTableBody.innerHTML = "";
        requests.forEach((r, i) => {
          const row = myRequestsTableBody.insertRow();
          row.insertCell().textContent = i + 1;
          row.insertCell().textContent = r.date;
          row.insertCell().textContent = r.startTime;
          row.insertCell().textContent = r.endTime;
          row.insertCell().textContent = r.shiftType;
          row.insertCell().textContent = r.userName;
          row.insertCell().textContent = r.userEmail;
  
          const delCell = row.insertCell();
          const delBtn = document.createElement("button");
          delBtn.textContent = "Delete";
          delBtn.className = "btn danger-btn btn-small";
          delBtn.addEventListener("click", () => {
            deleteRequest(r.id);
          });
          delCell.appendChild(delBtn);
        });
      })
      .catch(err => console.error("Error loading requests:", err));
  }
  loadRequests();
  
  function deleteRequest(reqId) {
    fetch(`/api/requests/${reqId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        loadRequests();
      })
      .catch(err => console.error("Error deleting request:", err));
  }
  
  // 3) Submit new request
  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateVal = reqDateInput.value;
    const slotId = reqSlotSelect.value; // we get the id of the selected slot
    const shiftVal = reqShiftType.value;
    const nameVal = reqUserName.value;
    const emailVal = reqUserEmail.value;
  
    if (!dateVal || !slotId || !shiftVal || !nameVal || !emailVal) {
      alert("Fill in all fields and pick a valid slot!");
      return;
    }
  
    // Find the chosen slot's start/end times from all slots
    fetch('/api/timeslots')
      .then(res => res.json())
      .then(allSlots => {
        const chosenSlot = allSlots.find(s => s.id === parseInt(slotId, 10));
        if (!chosenSlot) {
          alert("Selected slot not found. Maybe it was deleted?");
          return;
        }
        // POST /api/requests with the chosen slot and form details
        fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: chosenSlot.date,
            startTime: chosenSlot.startTime,
            endTime: chosenSlot.endTime,
            shiftType: shiftVal,
            userName: nameVal,
            userEmail: emailVal
          })
        })
        .then(res => res.json())
        .then(data => {
          alert("Request submitted!");
          requestForm.reset();
          loadRequests();
        })
        .catch(err => console.error("Error creating request:", err));
      })
      .catch(err => console.error("Error fetching timeslots:", err));
  });
});
