import * as PIXI from "pixi.js";

export async function renderSketchingAnimation(sketching: HTMLElement) {
  const app = addSketchingCanvas(sketching);
  addBg(app);
  addItems(app);
}

function addSketchingCanvas(
  parent: HTMLElement
): PIXI.Application<HTMLCanvasElement> {
  const app = new PIXI.Application<HTMLCanvasElement>();
  app.renderer.resize(parent.clientWidth, parent.clientHeight);

  if (parent) {
    parent.appendChild(app.view);
  }

  return app;
}

function addBg(app: PIXI.Application) {
  const canvasBg = new PIXI.Graphics();
  const sketchingBg = "#222222";
  canvasBg.beginFill(sketchingBg); // Your chosen background color
  canvasBg.drawRect(0, 0, app.renderer.width, app.renderer.height);
  canvasBg.endFill();
  app.stage.addChild(canvasBg);
}

  function addItems(app: PIXI.Application) {
    const lineColor = "#f8f8f8";
    const lineThickness = 2;
    const items = new PIXI.Container();
    app.stage.addChild(items);
  
    const circle = new PIXI.Graphics().lineStyle(lineThickness, lineColor).drawCircle(0, 0, 60);
    const diamond = new PIXI.Graphics()
      .lineStyle(lineThickness, lineColor)
      .moveTo(0, -60)
      .lineTo(60, 0)
      .lineTo(0, 60)
      .lineTo(-60, 0)
      .closePath();
    const triangle = new PIXI.Graphics()
      .lineStyle(lineThickness, lineColor)
      .moveTo(0, -60)
      .lineTo(60, 60)
      .lineTo(-60, 60)
      .closePath();

    const circle2 = new PIXI.Graphics().lineStyle(lineThickness, lineColor).drawCircle(45, 0, 60);
  
    items.addChild(circle, diamond, triangle, circle2);
  
    [circle, diamond, triangle, circle2].forEach((shape, index) => {
      shape.x = 100 * (index + 1);
      shape.y = 100 + index * 100; 
      shape.scale.set(0);
    });
  
    let animationStage = 0;
    const growthSpeed = 1;
    app.ticker.add(() => {
      if (animationStage === 0 && circle.scale.x < 1) {
        circle.scale.set(circle.scale.x + growthSpeed);
      } else if (animationStage === 0 && circle.scale.x >= 1) {
        animationStage = 1;
      }
  
      if (animationStage === 1 && diamond.scale.x < 1) {
        diamond.scale.set(diamond.scale.x + growthSpeed);
      } else if (animationStage === 1 && diamond.scale.x >= 1) {
        animationStage = 2;
      }
  
      if (animationStage === 2 && triangle.scale.x < 1) {
        triangle.scale.set(triangle.scale.x + growthSpeed);
      } else if (animationStage === 2 && triangle.scale.x >= 1) {
        animationStage = 3;
      }
  
      if (animationStage === 3 && circle2.scale.x < 1) { // Rectangle animation added
        circle2.scale.set(circle2.scale.x + growthSpeed);
      }
    });
  }
  
  
