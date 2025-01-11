// public/scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    const shiftForm = document.getElementById("shiftForm");
    const timeSlotSelect = document.getElementById("timeSlotSelect");
    const requestList = document.getElementById("requestList");
  
    // 1) Load time slots from server
    fetch('/api/timeslots')
      .then(res => res.json())
      .then(timeslots => {
        timeslots.forEach(slotObj => {
          const option = document.createElement("option");
          option.value = slotObj.text;
          option.textContent = slotObj.text;
          timeSlotSelect.appendChild(option);
        });
      })
      .catch(err => console.error("Error fetching timeslots:", err));
  
    // 2) Load existing requests (for the sidebar)
    function loadRequests() {
      fetch('/api/requests')
        .then(res => res.json())
        .then(requests => {
          requestList.innerHTML = "";
          requests.forEach(req => {
            const li = document.createElement("li");
            li.textContent = `${req.shiftDate} - ${req.timeSlot} [${req.shiftType}] by ${req.userName}`;
            requestList.appendChild(li);
          });
        })
        .catch(err => console.error("Error fetching requests:", err));
    }
    loadRequests();
  
    // 3) Submit new request
    shiftForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const shiftDate = document.getElementById("shiftDate").value;
      const timeSlot = timeSlotSelect.value;
      const shiftType = document.getElementById("shiftType").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
  
      fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftDate,
          timeSlot,
          shiftType,
          userName,
          userEmail
        })
      })
      .then(res => res.json())
      .then(data => {
        alert("Your shift request was submitted!");
        shiftForm.reset();
        loadRequests(); // refresh the sidebar
      })
      .catch(err => {
        console.error("Error submitting request:", err);
      });
    });
  });
  