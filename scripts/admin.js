// scripts/admin.js

document.addEventListener("DOMContentLoaded", () => {
    const requestsTableBody = document.querySelector("#requestsTable tbody");
    const clearDataBtn = document.getElementById("clearDataBtn");
  
    // 1) TIME SLOTS MANAGER
    const timeSlotForm = document.getElementById("timeSlotForm");
    const newTimeSlotInput = document.getElementById("newTimeSlot");
    const timeSlotList = document.getElementById("timeSlotList");
  
    // Load or init timeSlots (no defaults)
    let storedTimeSlots = localStorage.getItem("timeSlots");
    let timeSlots = storedTimeSlots ? JSON.parse(storedTimeSlots) : [];
  
    // Render current time slots
    function renderTimeSlots() {
      timeSlotList.innerHTML = "";
      timeSlots.forEach((slot, index) => {
        const li = document.createElement("li");
        li.textContent = slot;
  
        // "Delete" button
        const delBtn = document.createElement("button");
        delBtn.className = "btn danger-btn btn-small";
        delBtn.style.marginLeft = "10px";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
          // Remove this time slot from the array
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
  
    // Handle adding a new time slot
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
  
    // 2) MY AVAILABILITY (Example)
    const myAvailabilityList = document.getElementById("myAvailability");
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
  
    // 3) ALL SUBMITTED REQUESTS
    let existingRequests = localStorage.getItem("shiftRequests");
    existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
    existingRequests.forEach((request, index) => {
      const row = requestsTableBody.insertRow();
      row.insertCell().innerText = index + 1;
      row.insertCell().innerText = request.timeSlot;
      row.insertCell().innerText = request.shiftType;
      row.insertCell().innerText = request.userName;
      row.insertCell().innerText = request.userEmail;
    });
  
    // 4) CLEAR ALL REQUESTS
    clearDataBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to clear ALL saved requests?");
      if (confirmClear) {
        localStorage.removeItem("shiftRequests");
        location.reload();
      }
    });
  });
  