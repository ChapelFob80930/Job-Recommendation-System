document.addEventListener("DOMContentLoaded", function () {
    let jobWrappers = document.querySelectorAll(".job-wrapper");
    let currentIndex = 0;

    // Show only the first job initially
    jobWrappers.forEach((wrapper, index) => {
        wrapper.style.display = index === 0 ? "flex" : "none";
    });

    function showNextJob() {
        if (currentIndex < jobWrappers.length - 1) {
            jobWrappers[currentIndex].style.display = "none"; // Hide current job
            currentIndex++;
            jobWrappers[currentIndex].style.display = "flex"; // Show next job
        } else {
            document.getElementById("job-container").innerHTML = "<p>No more jobs available.</p>";
        }
    }

    document.querySelectorAll(".reject-btn").forEach(button => {
        button.addEventListener("click", function () {
            showNextJob(); // Reject Job
        });
    });

    document.querySelectorAll(".accept-btn").forEach(button => {
        button.addEventListener("click", function () {
            let jobId = button.getAttribute("data-id");
            window.location.href = "/job/" + jobId; // Accept and Redirect
        });
    });

    let jobCards = document.querySelectorAll(".job-card");
    jobCards.forEach((card) => {
        let startX = 0, endX = 0;

        card.addEventListener("touchstart", (event) => {
            startX = event.touches[0].clientX;
        });

        card.addEventListener("touchend", (event) => {
            endX = event.changedTouches[0].clientX;
            handleSwipe(startX, endX);
        });

        card.addEventListener("mousedown", (event) => {
            startX = event.clientX;
        });

        card.addEventListener("mouseup", (event) => {
            endX = event.clientX;
            handleSwipe(startX, endX);
        });

        function handleSwipe(startX, endX) {
            if (startX - endX > 50) {
                showNextJob(); // Left swipe (Reject)
            } else if (endX - startX > 50) {
                let jobId = card.getAttribute("data-id");
                window.location.href = "/job/" + jobId; // Right swipe (Accept)
            }
        }
    });
});
