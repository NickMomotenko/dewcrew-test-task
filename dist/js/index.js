(() => {
  const buttonsContainer = document.querySelector(".team__arrow-btn");

  const sliderList = document.querySelector(".team__list");
  const sliderArr = document.querySelectorAll(".team__item");

  const optionContainer = document.querySelector(".team__controlls");
  const optionList = Array.from(
    document.querySelectorAll(".team__controlls-item")
  );

  let currentIndex = 0;

  const doTransitionByIndex = (index) => {
    sliderList.style.transform = `translateX(-${index * 100}%)`;
  };

  const addClass = (index) => {
    optionList.forEach((item, ind) => {
      if (ind !== index) {
        item.classList.remove("active");
      } else item.classList.add("active");
    });

    sliderArr.forEach((item, ind) => {
      if (ind !== index) {
        item.classList.remove("active");
      } else item.classList.add("active");
    });
  };

  const useSlider = (arg) => {
    const isDirection = typeof arg === "string";
    const isIndex = typeof arg === "number";

    if (isDirection) {
      if (arg === "next" && currentIndex !== --sliderArr.length) {
        currentIndex = currentIndex + 1;
        doTransitionByIndex(currentIndex);
        addClass(currentIndex);
      } else if (arg === "prev" && currentIndex >= 1) {
        currentIndex = currentIndex - 1;
        doTransitionByIndex(currentIndex);
        addClass(currentIndex);
      }
    }

    if (isIndex) {
      currentIndex = arg;
      doTransitionByIndex(currentIndex);
      addClass(currentIndex);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    sliderArr[0].classList.add("active");
    optionList[0].classList.add("active");
  });

  buttonsContainer.addEventListener("click", (event) => {
    const target = event.target;

    const link = target.closest(".team__arrow-link");

    if (link?.classList.contains("team__arrow-link--prev")) {
      useSlider("prev");
    } else if (link?.classList.contains("team__arrow-link--next")) {
      useSlider("next");
    }
  });

  optionContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (target?.classList.contains("team__controlls-btn")) {
      const itemIndex = optionList.indexOf(target.parentNode);

      useSlider(itemIndex);
    } else if (target?.classList.contains("team__controlls-item")) {
      const itemIndex = optionList.indexOf(target);

      useSlider(itemIndex);
    }
  });
})();
