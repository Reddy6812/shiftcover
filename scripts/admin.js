// scripts/admin.js

document.addEventListener("DOMContentLoaded", () => {
    const requestsTableBody = document.querySelector("#requestsTable tbody");
    const clearDataBtn = document.getElementById("clearDataBtn");
    const myAvailabilityList = document.getElementById("myAvailability");
  
    // Example availability schedule – customize as needed
    const myAvailability = [
      "Mondays: 8am - 3pm",
      "Wednesdays: 1pm - 6pm",
      "Fridays: All day",
      "Sundays: 9am - 2pm"
    ];
  
    // Populate the "My Available Times" section
    myAvailability.forEach((slot) => {
      const li = document.createElement("li");
      li.textContent = slot;
      myAvailabilityList.appendChild(li);
    });
  
    // Retrieve stored shift requests
    let existingRequests = localStorage.getItem("shiftRequests");
    if (!existingRequests) {
      existingRequests = [];
    } else {
      existingRequests = JSON.parse(existingRequests);
    }
  
    // Populate the table
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
  
    // Clear button to remove all requests from localStorage
    clearDataBtn.addEventListener("click", () => {
      const confirmClear = confirm("Are you sure you want to clear ALL saved requests?");
      if (confirmClear) {
        localStorage.removeItem("shiftRequests");
        location.reload();
      }
    });
  });
  