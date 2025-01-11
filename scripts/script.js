// scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    const shiftForm = document.getElementById("shiftForm");
    const timeSelect = document.getElementById("timeSelect");
  
    // 1) Load time slots from localStorage (no defaults)
    const storedTimeSlots = localStorage.getItem("timeSlots");
    let timeSlots = storedTimeSlots ? JSON.parse(storedTimeSlots) : [];
  
    // 2) Populate the <select> with timeSlots
    timeSlots.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });
  
    // 3) Handle form submission
    shiftForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Grab form data
      const timeSlot = timeSelect.value;
      const shiftType = document.getElementById("shiftType").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
  
      // Retrieve or init shiftRequests
      let existingRequests = localStorage.getItem("shiftRequests");
      existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
      // Build request object
      const newRequest = {
        timeSlot,
        shiftType,
        userName,
        userEmail,
        submittedAt: new Date().toLocaleString()
      };
  
      // Save to localStorage
      existingRequests.push(newRequest);
      localStorage.setItem("shiftRequests", JSON.stringify(existingRequests));
  
      // Feedback
      alert("Thank you! Your shift cover request has been submitted.");
  
      // Reset form
      shiftForm.reset();
    });
  });
  