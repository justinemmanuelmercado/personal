import * as PIXI from "pixi.js";
import { generateMonochromaticColors } from "../helpers";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { AsciiFilter } from "@pixi/filter-ascii";
import Prism from "prismjs";

let canvasBg: PIXI.Graphics;

// PixiJs BG
const heroSection = document.getElementsByClassName("hero");
const minSpeed = 1;
const maxSpeed = 5;
const minSize = 10;
const maxSize = 20;
const baseColor = "#f8f8f8";
const bgColor = "#000";
const numOfCircles = 100;
const hoverSize = 50;
const asciiFontSize = 24;
const hoverColor = "#fff";
const explosionColor = "#e1e1e1";

// Terminal Animation
const terminalElement = document.querySelector("code.bash") as HTMLElement;
const terminalText = [
  { text: "$ git clone https://github.com/your-repo.git", type: "command" },
  { text: "Cloning into 'your-repo'...", type: "instant" },
  { text: "remote: Counting objects: 100% (3/3), done.", type: "instant" },
  { text: "Unpacking objects: 100% (3/3), done.", type: "instant" },
  { text: "$ cd your-repo", type: "command" },
  { text: "$ ls", type: "command" },
  { text: "index.html  package.json  script.js  style.css", type: "instant" },
  { text: "$ npm install", type: "command" },
  { text: "added 50 packages, and audited 51 packages in 2s", type: "instant" },
  { text: "$ npm install react react-dom", type: "command" },
  {
    text: "added 210 packages, and audited 261 packages in 5s",
    type: "instant",
  },
  { text: "$ git add -A", type: "command" },
  { text: "$ git commit -m 'Added React packages'", type: "command" },
  { text: "[main e123456] Added React packages", type: "instant" },
  { text: "$ git push", type: "command" },
  { text: "Counting objects: 5, done.", type: "instant" },
  {
    text: "Writing objects: 100% (3/3), 300 bytes | 300.00 KiB/s, done.",
    type: "instant",
  },
  { text: "$ aws configure", type: "command" },
  { text: "AWS Access Key ID [None]:", type: "instant" },
  { text: "YourAWSAccessKey", type: "command" },
  { text: "AWS Secret Access Key [None]:", type: "instant" },
  { text: "YourAWSSecretAccessKey", type: "command" },
  { text: "Default region name [None]: us-west-2", type: "instant" },
  { text: "us-west-2", type: "command" },
  { text: "$ aws s3 mb s3://your-bucket-name", type: "command" },
  { text: "make_bucket: your-bucket-name", type: "instant" },
  {
    text: "$ aws s3 cp ./ s3://your-bucket-name/ --recursive",
    type: "command",
  },
  {
    text: "upload: ./index.html to s3://your-bucket-name/index.html",
    type: "instant",
  },
  {
    text: "upload: ./style.css to s3://your-bucket-name/style.css",
    type: "instant",
  },
  {
    text: "upload: ./script.js to s3://your-bucket-name/script.js",
    type: "instant",
  },
  {
    text: "upload: ./package-lock.json to s3://your-bucket-name/package-lock.json",
    type: "instant",
  },
  { text: "$ aws s3 ls s3://your-bucket-name", type: "command" },
  { text: "2023-08-26 13:00:06      10240 index.html", type: "instant" },
  { text: "2023-08-26 13:00:06       2048 script.js", type: "instant" },
  { text: "2023-08-26 13:00:06       4096 style.css", type: "instant" },
  { text: "2023-08-26 13:00:06       1500 package.json", type: "instant" },
  { text: "2023-08-26 13:00:06      18000 package-lock.json", type: "instant" },
  { text: "$ exit", type: "command" },
];
const chatText = [
  { text: "Client: Hey, how's it going?", type: "chat" },
  { text: "Justin: Doing great, thanks! What's up?", type: "chat" },
  {
    text: "Client: We need to deploy a new version of our website. Can you handle it?",
    type: "chat",
  },
  {
    text: "Justin: Of course! Do you have any new features or changes?",
    type: "chat",
  },
  {
    text: "Client: Yes, we've added some React components. The repo is updated.",
    type: "chat",
  },
  {
    text: "Justin: Awesome! I'll pull the latest code and deploy it.",
    type: "chat",
  },
  {
    text: "Client: Perfect. We're also moving to AWS S3 for hosting.",
    type: "chat",
  },
  { text: "Justin: Sounds good. I'll get that set up for you.", type: "chat" },
  { text: "Client: Great, let me know once it's live.", type: "chat" },
  { text: "Justin: Will do. Talk to you soon!", type: "chat" },
  { text: "Client: Thanks, looking forward to it!", type: "chat" },
];

const chatElement = document.querySelector("code.chat") as HTMLElement;
const htmlElement = document.querySelector("code.html") as HTMLElement;
const cssElement = document.querySelector("code.css") as HTMLElement;
const jsElement = document.querySelector("code.js") as HTMLElement;

function animateHero() {
  const words = document.querySelectorAll(".word");
  const caret = document.querySelector(".arrows-container.not-loaded");
  const eachWordDelay = 200;
  let delay = 0;

  words.forEach((word) => {
    setTimeout(() => {
      word.classList.add("loaded");
    }, delay);
    delay += eachWordDelay; // Increase the delay for each word
  });

  if (caret) {
    setTimeout(() => {
      caret.classList.remove("not-loaded");
    }, words.length * eachWordDelay);
  }
}

// Function to create a donut shape
function createDonut(x: number, y: number, app: PIXI.Application) {
  const donut = new PIXI.Graphics();
  let outerRadius = 50; // Initial outer radius
  let innerRadius = 100; // Inner radius to create the "donut" effect
  const speed = 10; // Speed at which the donut grows
  const shrinkSpeed = 3; // Speed the inner radius shrinks

  donut.lineStyle(innerRadius, 0xffffff); // Set the line style (thickness and color)
  donut.drawCircle(x, y, outerRadius);
  app.stage.addChild(donut);

  const growDonut = () => {
    outerRadius += speed; // Increase the outer radius to grow the donut
    innerRadius -= shrinkSpeed;
    donut.clear(); // Clear the previous drawing
    donut.lineStyle(innerRadius, explosionColor); // Reset the line style
    donut.drawCircle(x, y, outerRadius); // Redraw the donut with the new radius

    if (innerRadius < 0) {
      app.ticker.remove(growDonut); // Remove the ticker function
      app.stage.removeChild(donut); // Remove the donut from the stage
    }
  };

  // Add the ticker function to the app ticker
  app.ticker.add(growDonut);
}

function addScrollListener() {
  window.addEventListener("scroll", () => {
    const htmlElement = document.documentElement;
    const percentOfScreenHeightScrolled =
      htmlElement.scrollTop / htmlElement.clientHeight;

    const percentToFade = 0.3;
    if (percentOfScreenHeightScrolled > percentToFade) {
      const fadeOutPercentage =
        1 - (percentOfScreenHeightScrolled - percentToFade) / 0.25;
      const clampedFadeOutPercentage = Math.min(
        Math.max(fadeOutPercentage, 0.1),
        1
      );

      if (heroSection[0]) {
        (heroSection[0] as HTMLElement).style.opacity = String(
          clampedFadeOutPercentage
        );
      }
    } else {
      if (heroSection[0]) {
        (heroSection[0] as HTMLElement).style.opacity = "1"; // Ensure full opacity if less than 75%
      }
    }
  });
}

function addPointerEvent(app: PIXI.Application<HTMLCanvasElement>) {
  app.view.addEventListener("pointerdown", (event) => {
    const rect = app.view.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    createDonut(x, y, app);
  });
}

function createApp(): PIXI.Application<HTMLCanvasElement> {
  const app = new PIXI.Application<HTMLCanvasElement>();
  app.renderer.resize(window.innerWidth, window.innerHeight);
  return app;
}

function addBg(app: PIXI.Application) {
  app.stage.filters = [
    new KawaseBlurFilter(10, 10, true),
    new AsciiFilter(asciiFontSize),
  ];
  const colors = generateMonochromaticColors(baseColor, numOfCircles);
  canvasBg = new PIXI.Graphics();
  canvasBg.beginFill(bgColor);
  // canvasBg.beginFill(baseColor); // Your chosen background color
  canvasBg.drawRect(0, 0, app.renderer.width, app.renderer.height);
  canvasBg.endFill();
  app.stage.addChild(canvasBg);
  const circles = addRandomCircles(app, colors);

  // Define velocities for each circle
  const velocities = circles.map(() => ({
    y: Math.random() * maxSpeed - minSpeed,
  }));
  app.ticker.add(() => {
    circles.forEach((circle, index) => {
      const velocity = velocities[index];

      // Update positions
      const bounds = circle.getBounds();
      circle.y += velocity.y;

      if (bounds.top < 0) {
        circle.y += -bounds.top; // Move inside the boundary
        velocity.y = Math.abs(velocity.y); // Make velocity positive
      }
      if (bounds.bottom > app.renderer.height) {
        circle.y -= bounds.bottom - app.renderer.height; // Move inside the boundary
        velocity.y = -Math.abs(velocity.y); // Make velocity negative
      }
    });
  });
}

function addRandomCircles(
  app: PIXI.Application,
  colors: string[]
): PIXI.Graphics[] {
  const container = new PIXI.Container();
  container.width = app.renderer.width;
  container.height = app.renderer.height;
  const circles: PIXI.Graphics[] = [];

  colors.forEach((color) => {
    const circle = new PIXI.Graphics();
    circle.beginFill(color);
    const radius = Math.random() * maxSize + minSize;
    const x = Math.random() * (app.renderer.width - radius * 2);
    const y = Math.random() * (app.renderer.height - radius * 2);
    circle.drawRect(x + radius, y + radius, radius, radius * 4); // Draw with center coordinates
    app.stage.addChild(circle);
    circles.push(circle);
  });

  return circles;
}

function addFollowingCircle(app: PIXI.Application<HTMLCanvasElement>) {
  // Create a circle graphic with a 200-pixel radius and white color
  const circle = new PIXI.Graphics();
  circle.beginFill(hoverColor);
  circle.drawCircle(0, 0, hoverSize);
  circle.endFill();

  // Add the circle to the application
  app.stage.addChild(circle);

  // Variables to store the target position
  let targetX = circle.x;
  let targetY = circle.y;

  // Define a mousemove event listener to update the target position
  app.view.addEventListener("mousemove", (event) => {
    const rect = app.view.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  });

  // Define a speed factor for how fast the circle should follow the mouse
  const speedFactor = 0.1;

  // Add a ticker function to move the circle towards the target position
  app.ticker.add(() => {
    const dx = targetX - circle.x;
    const dy = targetY - circle.y;
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
    circle.x += dx * speedFactor;
    circle.y += dy * speedFactor;
  });
}

function typeCommand(
  commands: { text: string; type: string }[],
  preElement: HTMLElement,
  cb: Function,
  currentIndex: number,
  currentText: string
) {
  let commandIndex = 0;
  let commandString = commands[currentIndex].text;
  function typeChar() {
    let currentSubstring = commandString.substring(0, commandIndex + 1);
    let highlighted = Prism.highlight(
      currentText + currentSubstring,
      Prism.languages.sh,
      "sh"
    );

    if (commandIndex < commandString.length) {
      preElement.innerHTML = highlighted;
      commandIndex++;
      setTimeout(typeChar, 10);
    } else {
      currentText += currentSubstring;
      currentText += "\n";
      setTimeout(() => {
        cb(preElement, commands, currentIndex + 1, currentText);
      }, 1000);
    }
  }

  typeChar();
}

function typeChat(
  commands: { text: string; type: string }[],
  preElement: HTMLElement,
  cb: Function,
  currentIndex: number,
  currentText: string
) {
  currentText += commands[currentIndex].text + "\n";
  preElement.innerHTML = currentText;
  setTimeout(() => {
    cb(preElement, commands, currentIndex + 1, currentText);
  }, 1000);
}

function typeInstant(
  commands: { text: string; type: string }[],
  preElement: HTMLElement,
  cb: Function,
  currentIndex: number,
  currentText: string
) {
  currentText += commands[currentIndex].text + "\n";
  const highlighted = Prism.highlight(
    currentText,
    Prism.languages.bash,
    "bash"
  );
  preElement.innerHTML = highlighted;
  setTimeout(() => {
    cb(preElement, commands, currentIndex + 1, currentText);
  }, 1000);
}

function typeTerminal(
  preElement: HTMLElement,
  messages: { text: string; type: string }[],
  currentIndex: number = 0,
  currentText: string = ""
) {
  if (!preElement) return;
  if (currentIndex < messages.length) {
    if (messages[currentIndex].type === "command") {
      typeCommand(
        messages,
        preElement,
        typeTerminal,
        currentIndex,
        currentText
      );
    } else if (messages[currentIndex].type === "chat") {
      typeChat(messages, preElement, typeTerminal, currentIndex, currentText);
    } else {
      typeInstant(
        messages,
        preElement,
        typeTerminal,
        currentIndex,
        currentText
      );
    }
  }
}

function injectStringToCode(
  str: string,
  codeElement: HTMLElement,
  grammar: Prism.Grammar,
  language: string
) {
  let codeIndex = 0;

  if (codeElement) {
    codeElement.classList.add("code-cursor");
  }

  function typeCode() {
    if (codeIndex < str.length) {
      const currentCode = str.substring(0, codeIndex + 1);
      const highlighted = Prism.highlight(currentCode, grammar, language);
      if (codeElement) {
        codeElement.innerHTML = highlighted;
      }
      codeIndex++;
      setTimeout(typeCode, 10); // Adjust the speed here
    }
  }
  typeCode();
}

function initTabs() {
  let tabs = document.querySelectorAll(".tab");
  let pres = document.querySelectorAll("pre");

  pres.forEach((pre) => pre.classList.add("pre-inactive"));
  pres[0].classList.replace("pre-inactive", "pre-active");
  tabs[0].classList.add("tab-active");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      let target = e.target as HTMLElement;
      let dataTarget = target.getAttribute("data-target");

      pres.forEach((pre) =>
        pre.classList.replace("pre-active", "pre-inactive")
      );
      tabs.forEach((tab) => tab.classList.remove("tab-active"));

      document
        .querySelector(`pre[data-tag="${dataTarget}"]`)
        ?.classList.replace("pre-inactive", "pre-active");

      target.classList.add("tab-active");
    });
  });
}

export async function setupHero(view: HTMLElement) {
  const rawHtml = (await import(`../../index.html?raw`)).default;
  const rawCss = (await import(`../style/index.css?raw`)).default;
  const rawJs = (await import(`../index.ts?raw`)).default;
  const app = createApp();
  addBg(app);
  initTabs();
  injectStringToCode(
    rawHtml,
    htmlElement as HTMLElement,
    Prism.languages.html,
    "html"
  );
  injectStringToCode(
    rawCss,
    cssElement as HTMLElement,
    Prism.languages.css,
    "css"
  );
  injectStringToCode(rawJs, jsElement as HTMLElement, Prism.languages.js, "js");
  typeTerminal(terminalElement, terminalText);
  typeTerminal(chatElement, chatText);
  addFollowingCircle(app);
  addPointerEvent(app);
  addScrollListener();
  setTimeout(() => {
    animateHero();
  }, 200);
  view.appendChild(app.view);
}
