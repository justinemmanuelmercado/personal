let animationFrameId: number;

export function renderCtaAnimation() {
  const button = document.querySelector(
    ".socials-cta-button"
  ) as HTMLButtonElement;
  const container = document.querySelector(".socials") as HTMLDivElement;

  if (!button || !container) {
    return;
  }

  const onMouseMove = (e: MouseEvent) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const xDiff = x - centerX;
      const yDiff = y - centerY;
      // Check if mouse is inside button bounds
      if (
        e.clientX >= buttonBounds.left &&
        e.clientX <= buttonBounds.right &&
        e.clientY >= buttonBounds.top &&
        e.clientY <= buttonBounds.bottom
      ) {
        console.log("Mouse inside button, stopping animation.");
        return;
      }

      // If mouse is not inside button, continue with animation
      button.style.setProperty(
        "--x",
        `${Math.min(Math.max(xDiff, -30), 30)}px`
      );
      button.style.setProperty(
        "--y",
        `${Math.min(Math.max(yDiff, -20), 20)}px`
      );
    });
  };

  container.addEventListener("mousemove", onMouseMove);
}
