import "./style/clean.css";
import "./style/index.css";

import { setupHero } from "./sections/hero";
import { renderCtaAnimation } from "./sections/socials";

const hero = document.getElementById("hero-animation");
const planning = document.querySelector(".planning") as HTMLElement;
async function main() {
  renderCtaAnimation();
  if (hero) {
    await setupHero(hero);
  }
  if (planning) {
    addPlanningEventListener(planning);
  }
  addIntersectionObserversToItems();
}

function addIntersectionObserversToItems() {
  const items = document.querySelectorAll(".to-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scrolled");
        } else {
          entry.target.classList.remove("scrolled");
        }
      });
    },
    {
      rootMargin: "0px 0px -150px 0px",
    }
  );

  items.forEach((item) => {
    observer.observe(item);
  });
}

function addPlanningEventListener(planning: HTMLElement) {
  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const planningOffsetTop = planning.offsetTop;
    const planningHeight = planning.offsetHeight;

    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

    const percentToFade = 0.6;
    if (
      scrollTop >= planningOffsetTop &&
      scrollTop <= planningOffsetTop + planningHeight &&
      scrollPercentage >= percentToFade
    ) {
      const fadeOutPercentage =
        1 - (scrollPercentage - percentToFade) / 0.25;
      const clampedFadeOutPercentage = Math.min(
        Math.max(fadeOutPercentage, 0.0),
        1
      );

      if (planning) {
        (planning).style.opacity = String(
          clampedFadeOutPercentage
        );
      }
    } else {
      if (planning) {
        (planning).style.opacity = "1"; // Ensure full opacity if less than 75%
      }
    }
  }, { passive: true });
}

main();
