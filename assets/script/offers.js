window.addEventListener("DOMContentLoaded", init);

function init() {
  initScrollToTop();
  initClosePanel();
  initSelectHotel();
  initPlusMinus();
  initDateSelect();
  initOpenCloseSelect();
  initHeaderTabs();
  initSelectLinks();

  initSelectTab();
}

async function fetchOffers(n) {
  const offersContainer = document.querySelector(".offers .offers-container");
  let cols = offersContainer.querySelectorAll(".offers-col");
  const noResult = document.querySelector(".offers .no-result");

  cols.forEach((col) => {
    col.innerHTML = "";
  });
  noResult.classList.add("hide");
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    cols = [cols[0]];
  }

  const name = n || "all";
  let data = undefined;
  let storage = sessionStorage.getItem("offers") || "{}";
  storage = JSON.parse(storage);
  if (storage && storage[n]) {
    data = storage[n];
  } else {
    const res = await fetch(`../assets/script/data/${name}.json`);
    data = await res.json();
    storage[n] = data;
    sessionStorage.setItem("offers", JSON.stringify(storage));
  }

  if (data.Results.length == 0) {
    noResult.classList.remove("hide");
    return;
  }
  data.Results.forEach((result, i) => {
    let heighestColIndex = 0;
    let heighestColValue = Number.MAX_VALUE;
    cols.forEach((col, j) => {
      if (col.getBoundingClientRect().bottom < heighestColValue) {
        heighestColValue = col.getBoundingClientRect().bottom;
        heighestColIndex = j;
      }
    });
    cols[heighestColIndex].innerHTML += result.Html;
  });
}

function initSelectTab() {
  const filterTab = document.querySelector(".offers .filter-tab");
  const items = filterTab.querySelectorAll(".tabs li");
  const displayValue = filterTab.querySelector(".value");
  const indicator = filterTab.querySelector(".active-bar");
  let isOpen = false;
  let selectedValue = null;
  items.forEach((item) => {
    if (item.classList.contains("selected")) {
      selectedValue = item.textContent;
      indicator.style.left = item.offsetLeft - 4 + "px";
      indicator.style.width = item.offsetWidth + 8 + "px";
    }
  });
  if (!selectedValue) {
    items[0].classList.add("selected");
    selectedValue = items[0].textContent;
  }
  fetchOffers(selectedValue.toLowerCase());

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => {
        i.classList.remove("selected");
      });
      item.classList.add("selected");
      selectedValue = item.textContent;
      displayValue.textContent = selectedValue;
      indicator.style.left = item.offsetLeft - 2 + "px";
      indicator.style.width = item.offsetWidth + 4 + "px";
      fetchOffers(selectedValue.toLowerCase());
    });
  });

  filterTab.addEventListener("click", (e) => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    isOpen = !isOpen;
    if (isOpen) {
      filterTab.classList.add("expand");
    } else {
      filterTab.classList.remove("expand");
    }
  });
}
function removeSelectedLink() {
  const links = document.querySelectorAll(".links-panel .selectable");
  links.forEach((link) => {
    link.classList.remove("selected");
  });
}

function initSelectLinks() {
  const links = document.querySelectorAll(".links-panel .selectable");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      link.classList.add("selected");
    });
  });

  const back = document.getElementById("back-links");
  back.addEventListener("click", () => {
    removeSelectedLink();
  });
}

function initHeaderTabs() {
  const languageTabs = document.getElementById("language-tabs");
  const locationTabs = document.getElementById("location-tabs");

  const languageContainer = document.querySelector(".link:has(#language-tabs)");
  const locationContainer = document.querySelector(".link:has(#location-tabs)");

  document.addEventListener("click", (e) => {
    if (
      !languageContainer.contains(e.target) &&
      !locationContainer.contains(e.target)
    ) {
      languageTabs.classList.remove("open");
      locationTabs.classList.remove("open");
      return;
    }

    if (languageContainer.contains(e.target)) {
      languageTabs.classList.toggle("open");
      locationTabs.classList.remove("open");
    }

    if (locationContainer.contains(e.target)) {
      locationTabs.classList.toggle("open");
      languageTabs.classList.remove("open");
    }
  });
}

function initOpenCloseSelect() {
  const bookPanel = document.querySelector(".booking-panel");

  const selectHotel = document.getElementById("select-hotel");
  const selectDate = document.getElementById("select-date");
  const hotelContextMenu = selectHotel.querySelector("ul");
  const dateContextMenu = selectDate.querySelector(".date-selector");

  bookPanel.addEventListener("click", (e) => {
    if (selectHotel.contains(e.target)) {
      hotelContextMenu.classList.toggle("open");
    } else {
      hotelContextMenu.classList.remove("open");
    }

    if (selectDate.contains(e.target)) {
      if (e.target?.classList?.contains("date-item")) {
        dateContextMenu.classList.remove("open");
        return;
      }
      dateContextMenu.classList.add("open");
    } else {
      dateContextMenu.classList.remove("open");
    }
  });
}

function initDateSelect() {
  const dateSelect = document.querySelector("#select-date");
  const monthYearDisplay = dateSelect.querySelector(".month-picker span");
  const datePicker = dateSelect.querySelector(".date-picker");
  const placeholders = datePicker.querySelectorAll(
    ".date-picker .date .placeholder"
  );
  const dates = datePicker.querySelectorAll(".date-picker .date .date-item");
  const dateDisplay = dateSelect.querySelector(".value");
  let date = new Date();
  let currentSelectedDate = new Date(date.getTime());

  monthYearDisplay.textContent = date.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  dates[currentSelectedDate.getDate() - 1].classList.add("selected");

  const numPlaceholderToShow = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  for (let i = 0; i < numPlaceholderToShow; i++) {
    placeholders[i].classList.remove("hide");
  }

  const numDaysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  for (let i = numDaysInMonth - 1; i < 31; i++) {
    dates[i].classList.add("hide");
  }

  // const input = dateSelect.querySelector("input");
  // input.value = date.toISOString().split("T")[0];

  dateSelect.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      if (e.target.classList.contains("prev")) {
        date.setMonth(date.getMonth() - 1);
      } else {
        date.setMonth(date.getMonth() + 1);
      }

      monthYearDisplay.textContent = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const numPlaceholderToShow = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).getDay();
      placeholders.forEach((placeholder) => placeholder.classList.add("hide"));
      dates.forEach((date) => date.classList.remove("hide"));
      for (let i = 0; i < numPlaceholderToShow; i++) {
        placeholders[i].classList.remove("hide");
      }
      const numDaysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      for (let i = numDaysInMonth; i < 31; i++) {
        dates[i].classList.add("hide");
      }

      if (
        date.getMonth() === currentSelectedDate.getMonth() &&
        date.getFullYear() === currentSelectedDate.getFullYear()
      ) {
        dates[currentSelectedDate.getDate() - 1].classList.add("selected");
      } else {
        dates[currentSelectedDate.getDate() - 1].classList.remove("selected");
      }
    } else if (e.target.classList.contains("date-item")) {
      currentSelectedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        e.target.textContent
      );
      dates.forEach((date) => date.classList.remove("selected"));
      e.target.classList.add("selected");
      dateDisplay.textContent = currentSelectedDate.toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  });
}

function initPlusMinus() {
  const room = document.getElementById("room-number");
  const adult = document.getElementById("adult-number");
  const child = document.getElementById("child-number");
  const roomDisplay = room.querySelector(".value");
  const adultDisplay = adult.querySelector(".value");
  const childDisplay = child.querySelector(".value");
  let roomValue = 1;
  let adultValue = 1;
  let childValue = 0;

  const roomMinus = room.querySelector(".minus");
  const roomPlus = room.querySelector(".plus");

  const adultMinus = adult.querySelector(".minus");
  const adultPlus = adult.querySelector(".plus");

  const childMinus = child.querySelector(".minus");
  const childPlus = child.querySelector(".plus");

  roomMinus.addEventListener("click", () => {
    if (roomValue > 1) {
      roomValue--;
      roomDisplay.textContent = roomValue;
    }
  });
  roomPlus.addEventListener("click", () => {
    roomValue++;
    roomDisplay.textContent = roomValue;
  });

  adultMinus.addEventListener("click", () => {
    if (adultValue > 1) {
      adultValue--;
      adultDisplay.textContent = adultValue;
    }
  });
  adultPlus.addEventListener("click", () => {
    if (adultValue + childValue > 4 * roomValue) {
      childValue = 0;
      childDisplay.textContent = childValue;
      adultValue = 1;
      adultDisplay.textContent = adultValue;
      return;
    } else if (adultValue + childValue == 4 * roomValue) return;

    adultValue++;
    adultDisplay.textContent = adultValue;
  });

  childMinus.addEventListener("click", () => {
    if (childValue > 0) {
      childValue--;
      childDisplay.textContent = childValue;
    }
  });
  childPlus.addEventListener("click", () => {
    if (adultValue + childValue > 4 * roomValue) {
      childValue = 0;
      childDisplay.textContent = childValue;
      adultValue = 1;
      adultDisplay.textContent = adultValue;
      return;
    } else if (adultValue + childValue == 4 * roomValue) return;
    childValue++;
    childDisplay.textContent = childValue;
  });
}

function initSelectHotel() {
  const selectHotel = document.getElementById("select-hotel");
  const hotelOptions = selectHotel.querySelectorAll("li");
  const display = selectHotel.querySelector(".value");
  let selectedOption = null;

  hotelOptions.forEach((option) => {
    option.addEventListener("click", () => {
      if (selectedOption) {
        selectedOption.classList.remove("selected");
      }
      display.textContent = option.textContent;
      selectHotel.classList.remove("open");
      selectedOption = option;
      selectedOption.classList.add("selected");
    });
  });
}

function initClosePanel() {
  const linksOpen = document.getElementById("if-links-open");
  const bookingOpen = document.getElementById("if-booking-open");
  const closeLinks = document.getElementById("close-links");
  const closeBooking = document.getElementById("close-booking");
  closeLinks.addEventListener("click", () => {
    linksOpen.checked = false;
    removeSelectedLink();
  });
  closeBooking.addEventListener("click", () => {
    bookingOpen.checked = false;
  });

  const preventClick = document.getElementById("page-prevent-click");
  preventClick.addEventListener("click", () => {
    linksOpen.checked = false;
    bookingOpen.checked = false;
    removeSelectedLink();
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
