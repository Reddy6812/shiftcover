// scripts/admin.js

document.addEventListener("DOMContentLoaded", () => {
    //---------------------------------------
    // (1) TIME SLOTS MANAGER
    //---------------------------------------
    const timeSlotForm = document.getElementById("timeSlotForm");
    const newTimeSlotInput = document.getElementById("newTimeSlot");
    const timeSlotList = document.getElementById("timeSlotList");
  
    // Load existing time slots or initialize empty
    let storedTimeSlots = localStorage.getItem("timeSlots");
    let timeSlots = storedTimeSlots ? JSON.parse(storedTimeSlots) : [];
  
    function renderTimeSlots() {
      timeSlotList.innerHTML = "";
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
    // Initial render of time slots
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
  
    //---------------------------------------
    // (2) MY AVAILABLE TIMINGS (Requests)
    //---------------------------------------
    const requestsListAdmin = document.getElementById("requestsListAdmin");
  
    let existingRequests = localStorage.getItem("shiftRequests");
    let requests = existingRequests ? JSON.parse(existingRequests) : [];
  
    function renderRequests() {
      requestsListAdmin.innerHTML = "";
      requests.forEach((req, index) => {
        const li = document.createElement("li");
        // e.g. "2025-02-10 - Monday (8am - 2pm) [Event Staff - Early] by John"
        li.textContent = `${req.shiftDate} - ${req.timeSlot} [${req.shiftType}] by ${req.userName}`;
  
        // Delete button (remove this request from localStorage)
        const delBtn = document.createElement("button");
        delBtn.className = "btn danger-btn btn-small";
        delBtn.style.marginLeft = "10px";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
          requests.splice(index, 1);
          localStorage.setItem("shiftRequests", JSON.stringify(requests));
          renderRequests();
        });
  
        li.appendChild(delBtn);
        requestsListAdmin.appendChild(li);
      });
    }
    renderRequests();
  });
  