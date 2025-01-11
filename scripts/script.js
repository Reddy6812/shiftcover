// scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    const shiftForm = document.getElementById("shiftForm");
    const timeSelect = document.getElementById("timeSelect");
  
    // 1) Load any existing time slots from localStorage
    const storedTimeSlots = localStorage.getItem("timeSlots");
    const timeSlots = storedTimeSlots ? JSON.parse(storedTimeSlots) : [];
  
    // 2) Populate the <select> with these slots
    timeSlots.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });
  
    // 3) Handle form submission
    shiftForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const timeSlot = timeSelect.value;
      const shiftType = document.getElementById("shiftType").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
  
      // Load or init shiftRequests array
      let existingRequests = localStorage.getItem("shiftRequests");
      existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
      // Create new request
      const newRequest = {
        timeSlot,
        shiftType,
        userName,
        userEmail,
        submittedAt: new Date().toLocaleString()
      };
  
      // Save
      existingRequests.push(newRequest);
      localStorage.setItem("shiftRequests", JSON.stringify(existingRequests));
  
      // Feedback
      alert("Thank you! Your shift cover request has been submitted.");
      shiftForm.reset();
    });
  });
  