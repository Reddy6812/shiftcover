// scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    const shiftForm = document.getElementById("shiftForm");
    const timeSelect = document.getElementById("timeSelect");
    const requestList = document.getElementById("requestList");
  
    // 1) LOAD TIME SLOTS FROM LOCALSTORAGE (for the <select>)
    const storedTimeSlots = localStorage.getItem("timeSlots");
    const timeSlots = storedTimeSlots ? JSON.parse(storedTimeSlots) : [];
    // Populate the <select> with these slots:
    timeSlots.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });
  
    // 2) LOAD EXISTING REQUESTS & RENDER THEM IN "My Available Timings"
    let existingRequests = localStorage.getItem("shiftRequests");
    existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
    renderRequests(existingRequests);
  
    // Helper to render the request list in the sidebar
    function renderRequests(requestsArray) {
      requestList.innerHTML = ""; // clear existing
      requestsArray.forEach((req) => {
        const li = document.createElement("li");
        li.textContent = `${req.shiftDate} - ${req.timeSlot} [${req.shiftType}] by ${req.userName}`;
        requestList.appendChild(li);
      });
    }
  
    // 3) HANDLE FORM SUBMISSION
    shiftForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      // Collect form data
      const shiftDate = document.getElementById("shiftDate").value;
      const dayTimeRange = document.getElementById("timeSelect").value;
      const shiftType = document.getElementById("shiftType").value;
      const userName = document.getElementById("userName").value;
      const userEmail = document.getElementById("userEmail").value;
  
      // Retrieve or init shiftRequests
      let existingRequests = localStorage.getItem("shiftRequests");
      existingRequests = existingRequests ? JSON.parse(existingRequests) : [];
  
      // Build a new request
      const newRequest = {
        shiftDate,
        timeSlot: dayTimeRange,
        shiftType,
        userName,
        userEmail,
        submittedAt: new Date().toLocaleString()
      };
  
      // Save to localStorage
      existingRequests.push(newRequest);
      localStorage.setItem("shiftRequests", JSON.stringify(existingRequests));
  
      // Re-render the requests in the sidebar
      renderRequests(existingRequests);
  
      // Feedback
      alert("Thank you! Your shift cover request has been submitted.");
  
      // Reset the form
      shiftForm.reset();
    });
  });
  