const slides = document.querySelectorAll(".slide");
let slideIndex = 0;
let intervalID = null;
let videos = [];
let vimeoPlayers = [];
let mouseX = 0;
const slideContainer = document.querySelector(".slider-container");
let slideWidth = slideContainer.clientWidth;

let arrowTag = document.querySelector("#slideshow-arrows");
let cursor = document.querySelector(".cursor");

let isCirlceMode = false;

document.addEventListener("DOMContentLoaded", initSlider());


function invertLogo() {
  let logo = document.querySelector("#prophet-logo-group");
  let logoContainer = document.querySelector(".prophet-logo-wrapper");
  
  if (logo && logoContainer) {
    setTimeout(() => {
      // Option 1: CSS transitions (already added to CSS)
      logo.setAttribute("fill", "#f1f1f1");
      logoContainer.style.backgroundColor = "#0a0a0a";

      console.log("Logo inverted: white text on black background");
    }, 1000);
  } 
}

function initSlider() {
  if (slides.length > 0) {
    slides[slideIndex].classList.add("displaySlide");
  }
  videos = document.querySelectorAll("iframe[src*='player.vimeo.com']");

  initVimeoPlayers();
  setupVideoVisibilityObserver();
  updateArrowColors();
  invertLogo();
}

function initVimeoPlayers() {
  videos.forEach((iframe, index) => {
    const player = new Vimeo.Player(iframe);
    vimeoPlayers.push(player);

    player.pause();
  });
}

function updateSlideWidth() {
  slideWidth = slideContainer.clientWidth;
}
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateSlideWidth();
  }, 150);
});

function setupVideoVisibilityObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const iframe = entry.target;
        const playerIndex = Array.from(videos).indexOf(iframe);
        const player = vimeoPlayers[playerIndex];

        if (entry.isIntersecting) {
          player.play().catch((error) => {
            console.log("Playback failed:", error);
          });
        } else {
          player.pause();
          player.setCurrentTime(0).catch((error) => {
            console.log("Reset failed:", error);
          });
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  videos.forEach((iframe) => {
    observer.observe(iframe);
  });
}

function showSlide(index) {
  if (index >= slides.length) {
    slideIndex = 0;
  } else if (index < 0) {
    slideIndex = slides.length - 1;
  }

  slides.forEach((slide) => {
    slide.classList.remove("displaySlide");
  });
  slides[slideIndex].classList.add("displaySlide");

  updateArrowColors();
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function updateArrowColors() {
  const prevArrowPaths = document.querySelectorAll(".prev svg path");
  const nextArrowPaths = document.querySelectorAll(".next svg path");

  // If on the light slide change to dark color
  if (slideIndex === 18) {
    prevArrowPaths.forEach((path) => {
      path.setAttribute("fill", "#0000ff");
    });
    nextArrowPaths.forEach((path) => {
      path.setAttribute("fill", "#0000ff");
    });
  } else {
    prevArrowPaths.forEach((path) => {
      path.setAttribute("fill", "#F1F1F1");
    });
    nextArrowPaths.forEach((path) => {
      path.setAttribute("fill", "#F1F1F1");
    });
  }
}

document.addEventListener("mousemove", (e) => {
  const rect = slideContainer.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let nextArrow = document.querySelector(".next");
  let prevArrow = document.querySelector(".prev");

  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    cursor.style.display = "block";
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
  } else {
    cursor.style.display = "none";
  }

  if (x < slideWidth / 2) {
    nextArrow.style.display = "none";
    prevArrow.style.display = "block";
    prevArrow.style.transform = "none";
  } else {
    nextArrow.style.display = "block";
    prevArrow.style.display = "none";
    nextArrow.style.transform = "scaleX(-1)";
  }
});

document.addEventListener("click", (e) => {
  if (isCirlceMode) {
    return;
  }

  const rect = slideContainer.getBoundingClientRect();
  let x = e.clientX - rect.left;

  if (x < slideWidth / 2) {
    prevSlide();
  } else {
    nextSlide();
  }
});

// if mouse enters cv bullet container,
// morph prev/next svg path to a circle using gsap
let cvCatagoryContainer = document.querySelector(".cv-catagory-container");
let aTag = document.querySelector("p.info-credits a");
let prevArrowPath = document.querySelector(".prev svg #arrow");
let nextArrowPath = document.querySelector(".next svg path");
let circle = document.querySelector("#circle");

cvCatagoryContainer.addEventListener("mouseenter", () => {
  if (slideIndex === slides.length - 1) {
    isCirlceMode = true;
    gsap.to(prevArrowPath, {
      morphSVG: "#circle",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }
});

cvCatagoryContainer.addEventListener("mouseleave", () => {
  if (slideIndex === slides.length - 1) {
    isCirlceMode = false;
    gsap.to(prevArrowPath, {
      morphSVG: ".prev svg #arrow",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }
});

aTag.addEventListener("mouseenter", () => {
  console.log("mouseenter a ");
  isCirlceMode = true;
  gsap.to(prevArrowPath, {
    morphSVG: "#circle",
    duration: 0.3,
    ease: "power2.inOut",
  });
});

aTag.addEventListener("mouseleave", () => {
  isCirlceMode = false;
  gsap.to(prevArrowPath, {
    morphSVG: ".prev svg #arrow",
    duration: 0.3,
    ease: "power2.inOut",
  });
});

// *** CV More Details *** //

const cvItems = [
  { project: "#bosena-link", details: "#bosena-details" },
  { project: "#emergentx-link", details: "#ex-details" },
  { project: "#third-horizon-link", details: "#third-horizon-details" },
  { project: "#craig-ward-link", details: "#craig-ward-details" },
  { project: "#testbed-link", details: "#testbed-details" },
];

cvItems.forEach((item) => {
  const projectElement = document.querySelector(item.project);
  const detailsElement = document.querySelector(item.details);

  projectElement.addEventListener("mouseenter", () => {
    detailsElement.classList.add("active");
  });

  projectElement.addEventListener("mouseleave", () => {
    detailsElement.classList.remove("active");
  });
});
