import "./style/clean.css";
import "./style/index.css";

import { setupHero } from "./sections/hero";
import { renderSketchingAnimation } from "./sections/sketching";
import { renderSocialsAnimation } from './sections/socials';

const hero = document.getElementById("hero-animation");
const sketching = document.getElementById("sketching");
async function main() {
  renderSocialsAnimation();
  if (hero) {
    await setupHero(hero);
  }

  addIntersectionObserversToItems();

  if (sketching) {
    await renderSketchingAnimation(sketching);
  }

}

function addIntersectionObserversToItems() {
  const items = document.querySelectorAll(".item");
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
      rootMargin: "0px 0px -250px 0px",
    }
  );

  items.forEach((item) => {
    observer.observe(item);
  });
}



await main();