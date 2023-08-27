let animationFrameId: number;

export function renderSocialsAnimation() {
  const button = document.querySelector(
    ".socials-cta-button"
  ) as HTMLButtonElement;
  const container = document.querySelector(
    ".socials"
  ) as HTMLDivElement;

  if (!button || !container) {
    return;
  }

  const onMouseMove = (e: MouseEvent) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    let currentX = 0;
    let currentY = 0;
    
    animationFrameId = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const xDiff = x - centerX;
      const yDiff = y - centerY;
      const speed = 0.01
      console.log(xDiff, yDiff)
    
      const distance = Math.sqrt(xDiff ** 2 + yDiff ** 2);
      const radius = 10000;
    
      // Calculate the target X and Y positions within the circle
      const targetX = (xDiff / distance) * Math.min(distance, radius);
      const targetY = (yDiff / distance) * Math.min(distance, radius);
    
      // Add some easing to smooth out the movement
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;
    
      button.style.setProperty("--x", `${currentX}px`);
      button.style.setProperty("--y", `${currentY}px`);
    });
    
  };

  container.addEventListener("mousemove", onMouseMove);
}
