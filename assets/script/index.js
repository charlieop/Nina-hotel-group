window.addEventListener("DOMContentLoaded", init);

function init() {
  initLzayLoading();
  initScrollers();
  initVidepControls();
  initScrollToTop();
  initClosePanel();
}

function initClosePanel() {
  const linksOpen = document.getElementById("if-links-open");
  const bookingOpen = document.getElementById("if-booking-open");
  const closeLinks = document.getElementById("close-links");
  const closeBooking = document.getElementById("close-booking");
  closeLinks.addEventListener("click", () => {
    linksOpen.checked = false;
  });
  closeBooking.addEventListener("click", () => {
    bookingOpen.checked = false;
  });

  const preventClick = document.getElementById("page-prevent-click");
  preventClick.addEventListener("click", () => {
    linksOpen.checked = false;
    bookingOpen.checked = false;
  });
}

function initScrollToTop() {
  const scrollToTop = document.querySelector("#scroll-to-top");
  scrollToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initVidepControls() {
  const video = document.querySelector("video");
  control = document.querySelector("#if-play");
  control.addEventListener("change", (e) => {
    const play = !e.target.checked;
    if (play) {
      video.play();
    } else {
      video.pause();
    }
  });
}

function initLzayLoading() {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          observer.unobserve(image);
        }
      });
    }
    // {
    //   rootMargin: "10% 10% 30% 10%",
    // }
  );
  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    if (!image.dataset || !image.dataset.src) return;
    image.classList.add("lazy-img");
    observer.observe(image);
    image.addEventListener("load", () => {
      image.classList.remove("lazy-img");
    });
  });
}

function initScrollers() {
  const scrollerWrappers = document.querySelectorAll(".scroller-wrapper");
  scrollerWrappers.forEach((scrollerWrapper) => {
    const prev = scrollerWrapper.querySelector(".scroll-left");
    const next = scrollerWrapper.querySelector(".scroll-right");
    prev.classList.add("hide");
    const scrollingContext = scrollerWrapper.querySelector("ul");
    const itemWidth = scrollingContext.querySelectorAll("li")[0].offsetWidth;

    prev.addEventListener("click", () => {
      const newScrollPosition = scrollingContext.scrollLeft - itemWidth;
      scrollingContext.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    });
    next.addEventListener("click", () => {
      const newScrollPosition = scrollingContext.scrollLeft + itemWidth;
      scrollingContext.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    });
    scrollingContext.addEventListener("scroll", () => {
      if (scrollingContext.scrollLeft <= 0) {
        prev.classList.add("hide");
      } else {
        prev.classList.remove("hide");
      }
      if (
        scrollingContext.scrollLeft + scrollingContext.offsetWidth >=
        scrollingContext.scrollWidth
      ) {
        next.classList.add("hide");
      } else {
        next.classList.remove("hide");
      }
    });
  });
}
