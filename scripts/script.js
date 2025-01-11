// scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    const shiftForm = document.getElementById("shiftForm");
    const timeSelect = document.getElementById("timeSelect");
  
    // 1. Load or set default time slots
    let storedTimeSlots = localStorage.getItem("timeSlots");
    let timeSlots = [];
  
    if (storedTimeSlots) {
      timeSlots = JSON.parse(storedTimeSlots);
    } else {
      // fallback to some default times if none in storage
      timeSlots = [
        "Morning (8am - 12pm)",
        "Afternoon (12pm - 4pm)",
        "Evening (4pm - 8pm)",
        "Night (8pm - 12am)"
      ];
    }
  
    // 2. Populate <select> with time slots
    timeSlots.forEach(slot => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });
  
    // 3. Form submission
    shiftForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Collect form data
      const timeSlot = timeSelect.value;
      const shiftType = document.getElementById("shiftType").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
  
      // Retrieve or initialize shiftRequests
      let existingRequests = localStorage.getItem("shiftRequests");
      existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
      // Create new request object
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
  
      // Reset form
      shiftForm.reset();
    });
  });
  