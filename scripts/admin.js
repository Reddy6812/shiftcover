// scripts/admin.js

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const requestsTableBody = document.querySelector("#requestsTable tbody");
    const clearDataBtn = document.getElementById("clearDataBtn");
    const myAvailabilityList = document.getElementById("myAvailability");
  
    // 1. MY AVAILABILITY (Example)
    const myAvailability = [
      "Mondays: 8am - 3pm",
      "Wednesdays: 1pm - 6pm",
      "Fridays: All day",
      "Sundays: 9am - 2pm"
    ];
    myAvailability.forEach((slot) => {
      const li = document.createElement("li");
      li.textContent = slot;
      myAvailabilityList.appendChild(li);
    });
  
    // 2. TIME SLOTS MANAGER
    const timeSlotForm = document.getElementById("timeSlotForm");
    const newTimeSlotInput = document.getElementById("newTimeSlot");
    const timeSlotList = document.getElementById("timeSlotList");
  
    // Load existing or default time slots
    let storedTimeSlots = localStorage.getItem("timeSlots");
    let timeSlots = storedTimeSlots
      ? JSON.parse(storedTimeSlots)
      : [
          "Morning (8am - 12pm)",
          "Afternoon (12pm - 4pm)",
          "Evening (4pm - 8pm)",
          "Night (8pm - 12am)"
        ];
  
    // Render time slots in #timeSlotList
    function renderTimeSlots() {
      timeSlotList.innerHTML = ""; // clear old list
      timeSlots.forEach((slot, index) => {
        const li = document.createElement("li");
        li.textContent = slot;
  
        // Delete button
        const delBtn = document.createElement("button");
        delBtn.className = "btn danger-btn btn-small";
        delBtn.style.marginLeft = "10px";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
          // Remove from array
          timeSlots.splice(index, 1);
          // Save to localStorage
          localStorage.setItem("timeSlots", JSON.stringify(timeSlots));
          // Re-render
          renderTimeSlots();
        });
  
        li.appendChild(delBtn);
        timeSlotList.appendChild(li);
      });
    }
  
    // Initial render
    renderTimeSlots();
  
    // Handle "Add Time Slot"
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
  
    // 3. DISPLAY ALL SUBMITTED REQUESTS
    let existingRequests = localStorage.getItem("shiftRequests");
    existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
    existingRequests.forEach((request, index) => {
      const row = requestsTableBody.insertRow();
  
      // # (index + 1)
      const cellIndex = row.insertCell();
      cellIndex.innerText = index + 1;
  
      // Time Slot
      const cellTime = row.insertCell();
      cellTime.innerText = request.timeSlot;
  
      // Shift Type
      const cellShift = row.insertCell();
      cellShift.innerText = request.shiftType;
  
      // Name
      const cellName = row.insertCell();
      cellName.innerText = request.userName;
  
      // Email
      const cellEmail = row.insertCell();
      cellEmail.innerText = request.userEmail;
    });
  
    // 4. CLEAR ALL REQUESTS
    clearDataBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to clear ALL saved requests?");
      if (confirmClear) {
        localStorage.removeItem("shiftRequests");
        location.reload();
      }
    });
  });
  