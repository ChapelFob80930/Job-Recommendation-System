document.addEventListener("DOMContentLoaded", function () {
    let jobWrappers = document.querySelectorAll(".job-wrapper");
    let currentIndex = 0;
    let audioSwipeRight = new Audio('/static/sounds/swipe-right.mp3');
    let audioSwipeLeft = new Audio('/static/sounds/swipe-left.mp3');
    
    // Configure audio (will only play if user has interacted with the page)
    audioSwipeRight.volume = 0.3;
    audioSwipeLeft.volume = 0.3;
    
    // Track swipe history for undo functionality
    let swipeHistory = [];
    
    // Show only the first job initially
    jobWrappers.forEach((wrapper, index) => {
        wrapper.style.display = index === 0 ? "flex" : "none";
    });
    
    // Add the swipe indicator to each card
    document.querySelectorAll(".job-card").forEach(card => {
        const indicator = document.createElement('div');
        indicator.className = 'swipe-indicator';
        indicator.innerHTML = `
            <div class="swipe-progress">
                <div class="progress-left"></div>
                <div class="progress-right"></div>
            </div>
            <div class="swipe-direction">
                <span class="direction-left">←</span>
                <span class="direction-right">→</span>
            </div>
        `;
        card.appendChild(indicator);
    });

    // Function to show the next job card
    function showNextJob(direction) {
        if (currentIndex < jobWrappers.length - 1) {
            // Store the current job in history for undo
            swipeHistory.push({
                index: currentIndex,
                direction: direction
            });
            
            const currentCard = jobWrappers[currentIndex].querySelector('.job-card');
            
            // Apply swipe animation
            currentCard.style.transition = "transform 0.5s ease, rotate 0.5s ease";
            
            if (direction === 'left') {
                currentCard.style.transform = "translateX(-150%) rotate(-30deg)";
                try { audioSwipeLeft.play(); } catch(e) { console.log("Audio not played:", e); }
            } else {
                currentCard.style.transform = "translateX(150%) rotate(30deg)";
                try { audioSwipeRight.play(); } catch(e) { console.log("Audio not played:", e); }
            }
            
            // Hide current wrapper after animation completes
            setTimeout(() => {
                jobWrappers[currentIndex].style.display = "none";
                currentIndex++;
                
                // Show next job with a zoom-in effect
                if (currentIndex < jobWrappers.length) {
                    const nextCard = jobWrappers[currentIndex].querySelector('.job-card');
                    jobWrappers[currentIndex].style.display = "flex";
                    nextCard.style.transform = "scale(0.8)";
                    nextCard.style.opacity = "0";
                    
                    // Trigger reflow to ensure animation plays
                    void nextCard.offsetWidth;
                    
                    nextCard.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                    nextCard.style.transform = "scale(1)";
                    nextCard.style.opacity = "1";
                } else {
                    showNoMoreJobsMessage();
                }
            }, 500);
        } else {
            showNoMoreJobsMessage();
        }
    }
    
    // Function to show no more jobs message
    function showNoMoreJobsMessage() {
        // Remove any existing undo button
        const undoButton = document.getElementById('undo-swipe');
        if (undoButton) {
            undoButton.remove();
        }
        
        // Create the no more jobs container
        const noJobsContainer = document.createElement('div');
        noJobsContainer.className = 'no-jobs-container';
        
        // Add content to the container
        noJobsContainer.innerHTML = `
            <div class="no-jobs-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h2 class="no-jobs-title">No More Recommended Jobs</h2>
            <p class="no-jobs-message">You've reviewed all available job recommendations.</p>
            <button id="reset-jobs" class="reset-btn">Start Over</button>
            <button id="search-more-jobs" class="search-more-btn">Search More Jobs</button>
        `;
        
        // Remove all existing content and append the no jobs message
        const jobContainer = document.getElementById("job-container");
        jobContainer.innerHTML = '';
        jobContainer.appendChild(noJobsContainer);
        
        // Add event listeners to the buttons
        document.getElementById('reset-jobs').addEventListener('click', resetJobs);
        document.getElementById('search-more-jobs').addEventListener('click', () => {
            window.location.href = "/jobs/search";  // Adjust this URL as needed
        });
        
        // Add animation class
        setTimeout(() => {
            noJobsContainer.classList.add('show');
        }, 10);
    }
    
    // Function to undo the last swipe
    function undoLastSwipe() {
        if (swipeHistory.length > 0) {
            const lastSwipe = swipeHistory.pop();
            
            // Hide current card if visible
            if (currentIndex < jobWrappers.length) {
                jobWrappers[currentIndex].style.display = "none";
            }
            
            // Restore previous index
            currentIndex = lastSwipe.index;
            
            // Show the previous card with reverse animation
            jobWrappers[currentIndex].style.display = "flex";
            const card = jobWrappers[currentIndex].querySelector('.job-card');
            
            // Set initial position (off-screen based on previous swipe direction)
            card.style.transition = "none";
            if (lastSwipe.direction === 'left') {
                card.style.transform = "translateX(-150%) rotate(-30deg)";
            } else {
                card.style.transform = "translateX(150%) rotate(30deg)";
            }
            
            // Trigger reflow to ensure animation plays
            void card.offsetWidth;
            
            // Animate back to center
            card.style.transition = "transform 0.5s ease, rotate 0.5s ease";
            card.style.transform = "translateX(0) rotate(0)";
        }
    }
    
    // Function to reset all jobs (start over)
    function resetJobs() {
        currentIndex = 0;
        swipeHistory = [];
        
        // Clear the no jobs message
        const jobContainer = document.getElementById("job-container");
        jobContainer.innerHTML = '';
        
        // Reset all cards
        jobWrappers.forEach((wrapper, index) => {
            const card = wrapper.querySelector('.job-card');
            card.style.transition = "none";
            card.style.transform = "translateX(0) rotate(0)";
            card.style.opacity = "1";
            wrapper.style.display = index === 0 ? "flex" : "none";
            jobContainer.appendChild(wrapper);
        });
        
        // Add the undo button back
        addUndoButton();
    }

    // Function to add the undo button
    function addUndoButton() {
        // Only add if it doesn't exist
        if (!document.getElementById('undo-swipe')) {
            const undoButton = document.createElement('button');
            undoButton.id = 'undo-swipe';
            undoButton.className = 'undo-btn';
            undoButton.innerHTML = '↩ Undo';
            undoButton.addEventListener('click', undoLastSwipe);
            document.getElementById('job-container').appendChild(undoButton);
        }
    }

    // Reject button click handler
    document.querySelectorAll(".reject-btn").forEach(button => {
        button.addEventListener("click", function () {
            showNextJob('left'); // Reject Job with left animation
        });
        
        // Hover effect
        button.addEventListener("mouseenter", function() {
            const card = this.nextElementSibling;
            card.style.transition = "transform 0.3s ease";
            card.style.transform = "translateX(-20px) rotate(-5deg)";
        });
        
        button.addEventListener("mouseleave", function() {
            const card = this.nextElementSibling;
            card.style.transition = "transform 0.5s ease";
            card.style.transform = "translateX(0) rotate(0)";
        });
    });

    // Accept button click handler
    document.querySelectorAll(".accept-btn").forEach(button => {
        button.addEventListener("click", function () {
            let jobId = button.getAttribute("data-id");
            
            // Animate swipe before redirecting
            const card = button.previousElementSibling;
            card.style.transition = "transform 0.5s ease, rotate 0.5s ease";
            card.style.transform = "translateX(150%) rotate(30deg)";
            
            try { audioSwipeRight.play(); } catch(e) { console.log("Audio not played:", e); }
            
            // Redirect after animation completes
            setTimeout(() => {
                window.location.href = "/job/" + jobId; // Accept and Redirect
            }, 500);
        });
        
        // Hover effect
        button.addEventListener("mouseenter", function() {
            const card = this.previousElementSibling;
            card.style.transition = "transform 0.3s ease";
            card.style.transform = "translateX(20px) rotate(5deg)";
        });
        
        button.addEventListener("mouseleave", function() {
            const card = this.previousElementSibling;
            card.style.transition = "transform 0.5s ease";
            card.style.transform = "translateX(0) rotate(0)";
        });
    });

    // Touch and mouse swipe handling for job cards
    let jobCards = document.querySelectorAll(".job-card");
    jobCards.forEach((card) => {
        let startX = 0, startY = 0, currentX = 0, currentY = 0;
        let isDragging = false;
        let swipeThreshold = 100; // Minimum distance to consider a swipe
        let swipeCommitted = false;
        
        // Touch events
        card.addEventListener("touchstart", handleStart, { passive: true });
        card.addEventListener("touchmove", handleMove, { passive: true });
        card.addEventListener("touchend", handleEnd, { passive: true });
        
        // Mouse events
        card.addEventListener("mousedown", handleStart);
        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseup", handleEnd);
        card.addEventListener("mouseleave", handleEnd);
        
        function handleStart(e) {
            isDragging = true;
            swipeCommitted = false;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            // Reset any transition
            card.style.transition = "none";
        }
        
        function handleMove(e) {
            if (!isDragging) return;
            
            // Prevent scrolling while dragging
            e.preventDefault && e.preventDefault();
            
            currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // Calculate rotation based on horizontal movement
            const rotation = deltaX * 0.1; // Adjust multiplier for rotation intensity
            
            // Update card position and rotation
            card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
            
            // Update swipe indicator based on direction and distance
            updateSwipeIndicator(card, deltaX);
            
            // If swipe is beyond threshold, commit to swipe
            if (Math.abs(deltaX) > swipeThreshold && !swipeCommitted) {
                const swipeDirection = deltaX > 0 ? 'right' : 'left';
                commitToSwipe(card, swipeDirection);
                swipeCommitted = true;
            }
        }
        
        function handleEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // If swipe wasn't committed, return to center with bounce effect
            if (!swipeCommitted) {
                card.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"; // Bouncy effect
                card.style.transform = "translateX(0) rotate(0deg)";
                resetSwipeIndicator(card);
            }
        }
        
        function updateSwipeIndicator(card, deltaX) {
            const indicator = card.querySelector('.swipe-indicator');
            const progressLeft = indicator.querySelector('.progress-left');
            const progressRight = indicator.querySelector('.progress-right');
            const directionLeft = indicator.querySelector('.direction-left');
            const directionRight = indicator.querySelector('.direction-right');
            
            // Reset both sides
            progressLeft.style.width = '0%';
            progressRight.style.width = '0%';
            directionLeft.style.opacity = '0.3';
            directionRight.style.opacity = '0.3';
            
            // Update based on swipe direction
            if (deltaX < 0) { // Left swipe
                const progress = Math.min(100, (Math.abs(deltaX) / swipeThreshold) * 100);
                progressLeft.style.width = `${progress}%`;
                directionLeft.style.opacity = '1';
                indicator.style.backgroundColor = progress > 80 ? 'rgba(255, 77, 77, 0.3)' : 'rgba(0, 0, 0, 0.1)';
            } else if (deltaX > 0) { // Right swipe
                const progress = Math.min(100, (deltaX / swipeThreshold) * 100);
                progressRight.style.width = `${progress}%`;
                directionRight.style.opacity = '1';
                indicator.style.backgroundColor = progress > 80 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0, 0, 0, 0.1)';
            }
        }
        
        function resetSwipeIndicator(card) {
            const indicator = card.querySelector('.swipe-indicator');
            const progressLeft = indicator.querySelector('.progress-left');
            const progressRight = indicator.querySelector('.progress-right');
            const directionLeft = indicator.querySelector('.direction-left');
            const directionRight = indicator.querySelector('.direction-right');
            
            progressLeft.style.width = '0%';
            progressRight.style.width = '0%';
            directionLeft.style.opacity = '0.3';
            directionRight.style.opacity = '0.3';
            indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
        
        function commitToSwipe(card, direction) {
            // Calculate final position and rotation based on swipe velocity
            const deltaX = currentX - startX;
            const swipeVelocity = Math.min(Math.abs(deltaX) / 50, 3); // Cap the velocity multiplier
            const endX = direction === 'right' ? window.innerWidth + 200 : -window.innerWidth - 200;
            const rotation = direction === 'right' ? 30 : -30;
            
            // Apply final animation
            card.style.transition = `transform ${0.5 / swipeVelocity}s ease`;
            card.style.transform = `translateX(${endX}px) rotate(${rotation}deg)`;
            
            // Play swipe sound
            try {
                if (direction === 'right') {
                    audioSwipeRight.play();
                } else {
                    audioSwipeLeft.play();
                }
            } catch(e) {
                console.log("Audio not played:", e);
            }
            
            // Process the swipe after animation completes
            setTimeout(() => {
                if (direction === 'right') {
                    const jobId = card.getAttribute("data-id");
                    window.location.href = "/job/" + jobId; // Accept and Redirect
                } else {
                    showNextJob('left'); // Reject and show next job
                }
            }, 500 / swipeVelocity);
        }
    });
    
    // Add undo button to the container
    addUndoButton();
});