// scripts/admin.js

document.addEventListener("DOMContentLoaded", () => {
    // 1) TIME SLOTS MANAGER
    const timeSlotForm = document.getElementById("timeSlotForm");
    const newTimeSlotInput = document.getElementById("newTimeSlot");
    const timeSlotList = document.getElementById("timeSlotList");
  
    // Load existing time slots, or empty array if none
    let storedTimeSlots = localStorage.getItem("timeSlots");
    let timeSlots = storedTimeSlots ? JSON.parse(storedTimeSlots) : [];
  
    // Helper function to render the list of time slots in the UI
    function renderTimeSlots() {
      timeSlotList.innerHTML = ""; // clear existing
      timeSlots.forEach((slot, index) => {
        const li = document.createElement("li");
        li.textContent = slot;
  
        // Delete button
        const delBtn = document.createElement("button");
        delBtn.className = "btn danger-btn btn-small";
        delBtn.style.marginLeft = "10px";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
          timeSlots.splice(index, 1);
          localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
          renderTimeSlots();
        });
  
        li.appendChild(delBtn);
        timeSlotList.appendChild(li);
      });
    }
  
    // Initial render
    renderTimeSlots();
  
    // Add a new time slot
    timeSlotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newSlot = newTimeSlotInput.value.trim();
      if (newSlot) {
        timeSlots.push(newSlot);
        localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
        newTimeSlotInput.value = "";
        renderTimeSlots();
      }
    });
  
    // 2) ALL SUBMITTED REQUESTS
    const requestsTableBody = document.querySelector("#requestsTable tbody");
    let existingRequests = localStorage.getItem("shiftRequests");
    existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
    // Populate the requests table
    existingRequests.forEach((req, index) => {
      const row = requestsTableBody.insertRow();
      row.insertCell().innerText = index + 1;
      row.insertCell().innerText = req.timeSlot;
      row.insertCell().innerText = req.shiftType;
      row.insertCell().innerText = req.userName;
      row.insertCell().innerText = req.userEmail;
    });
  
    // 3) CLEAR ALL REQUESTS
    const clearDataBtn = document.getElementById("clearDataBtn");
    clearDataBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to clear ALL saved requests?");
      if (confirmClear) {
        localStorage.removeItem("shiftRequests");
        location.reload();
      }
    });
  });
  