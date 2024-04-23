document.addEventListener("DOMContentLoaded", function () {
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let timer;

  function showSlides() {
    slides.forEach((slide) => {
      slide.style.opacity = "0";
      slide.style.display = "none"; // Ensure all slides are not displayed initially
    });

    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1; // Loop back to the first slide

    slides[slideIndex - 1].style.display = "block"; // Display the active slide
    slides[slideIndex - 1].style.opacity = "1"; // Make the active slide fully visible
    updateDots();
    resetTimer();
  }

  function updateDots() {
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[slideIndex - 1]) {
      // Check if the dot exists to avoid errors
      dots[slideIndex - 1].classList.add("active");
    }
  }

  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(showSlides, 3000);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide(index + 1);
    });
  });

  function currentSlide(n) {
    slideIndex = n - 1; // Adjust slide index to be 0-based
    showSlides();
  }

  showSlides(); // Initial call to start the slideshow
});
