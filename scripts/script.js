// scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    const shiftForm = document.getElementById("shiftForm");
  
    shiftForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Collect form data
      const timeSlot = document.getElementById("timeSelect").value;
      const shiftType = document.getElementById("shiftType").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
  
      // Retrieve existing requests from localStorage or initialize empty array
      let existingRequests = localStorage.getItem("shiftRequests");
      existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
      // Build the new request object
      const newRequest = {
        timeSlot,
        shiftType,
        userName,
        userEmail,
        submittedAt: new Date().toLocaleString()
      };
  
      // Append and save
      existingRequests.push(newRequest);
      localStorage.setItem("shiftRequests", JSON.stringify(existingRequests));
  
      // Notify user
      alert("Thank you! Your shift cover request has been submitted.");
  
      // Reset form
      shiftForm.reset();
    });
  });
  