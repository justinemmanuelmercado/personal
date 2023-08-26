import * as PIXI from "pixi.js";

const svgIds = ["cursor", "dotted-square", "resize-square"];

export async function renderSketchingAnimation(sketching: HTMLElement) {
  const app = addSketchingCanvas(sketching);
  addBg(app);
  const svgs = await loadSvgs();
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

async function loadSvgs(): Promise<Record<string, PIXI.Texture>> {
  const svgs: Record<string, PIXI.Texture> = {};

  for (const id of svgIds) {
    const svg = await PIXI.Texture.fromURL(`${id}.svg`);
    svgs[id] = svg;
  }

  return svgs;
}

function addBg(app: PIXI.Application) {
  const canvasBg = new PIXI.Graphics();
  const sketchingBg = "#cdcdcd";
  canvasBg.beginFill(sketchingBg); // Your chosen background color
  canvasBg.drawRect(0, 0, app.renderer.width, app.renderer.height);
  canvasBg.endFill();
  app.stage.addChild(canvasBg);
}

  // Function to create a rectangle with a gray border
  function createRectangle(width: number, height: number) {
    return new PIXI.Graphics()
      .lineStyle(4, 0x808080) // Gray border
      .beginFill(0, 0) // Transparent fill
      .drawRect(0, 0, width, height)
      .endFill();
  }

  function addItems(app: PIXI.Application) {
    const items = new PIXI.Container();
    app.stage.addChild(items);
  
    const circle = new PIXI.Graphics().lineStyle(4, 0x808080).drawCircle(0, 0, 30);
    const diamond = new PIXI.Graphics()
      .lineStyle(4, 0x808080)
      .moveTo(0, -30)
      .lineTo(30, 0)
      .lineTo(0, 30)
      .lineTo(-30, 0)
      .closePath();
    const triangle = new PIXI.Graphics()
      .lineStyle(4, 0x808080)
      .moveTo(0, -30)
      .lineTo(30, 30)
      .lineTo(-30, 30)
      .closePath();
    const rectangle = new PIXI.Graphics().lineStyle(4, 0x808080).drawRect(-30, -15, 60, 30); // Rectangle added
  
    items.addChild(circle, diamond, triangle, rectangle);
  
    [circle, diamond, triangle, rectangle].forEach((shape, index) => {
      shape.x = app.screen.width / 2;
      shape.y = 100 + index * 100; // Position adjusted to include the rectangle
      shape.scale.set(0);
    });
  
    let animationStage = 0;
    const growthSpeed = 0.01;
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
  
      if (animationStage === 3 && rectangle.scale.x < 1) { // Rectangle animation added
        rectangle.scale.set(rectangle.scale.x + growthSpeed);
      }
    });
  }
  
  
