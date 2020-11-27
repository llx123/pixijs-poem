import {
  Sprite,
  Container
} from 'pixi.js';

export function renderBg(parent, resources) {
  for (let i = 0; i < 5; i++) {
    var bg1 = Sprite.from(resources.bg1.texture),
      bg2 = Sprite.from(resources.bg2.texture);
    bg1.y = 2945 * i * 2,
      bg2.y = 2945 * (2 * i + 1)
    parent.addChild(bg1, bg2)
  }
}

export function renderDot(parent, resources) {
  for (let i = 0; i < 9; i++) {
    var container = new Container,
      black = container.blackDot = Sprite.from(resources['things_02'].textures["black_dot.png"]),
      red = container.redDot = Sprite.from(resources['things_02'].textures["red_dot.png"])
    red.visible = false,
      container.x = i % 3 * 78,
      container.y = 78 * parseInt(i / 3),
      container.addChild(black, red),
      parent.addChild(container)
  }
  parent.children[0].blackDot.visible = false,
    parent.children[0].redDot.visible = true;
  var dotNum = 0,
    x = 0;
  setInterval(function () {
    parent.children[dotNum].blackDot.visible = true,
      parent.children[dotNum].redDot.visible = false,
      x = dotNum,
      dotNum = parseInt(9 * Math.random()),
      x == dotNum && (dotNum = parseInt(9 * Math.random()),
        x = dotNum),
      parent.children[dotNum].blackDot.visible = false,
      parent.children[dotNum].redDot.visible = true
  }, 300)
}