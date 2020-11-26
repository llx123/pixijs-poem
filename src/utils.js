import {
  TweenMax
} from 'gsap';

export function addSprite(options, Sprite) {
  for (var container = options.box, img = options.img, resource = options.resource, index = 0; index < img.length; index++) {
    var i = Sprite.from(resource[img[index].name]);

    i.position.set(img[index].x, img[index].y),
      container.addChild(i)
  }
}

export function addSpriteWithData(options, Sprite) {
  for (var t = options.box, img = options.img, resource = options.resource, index = 0; index < img.length; index++) {
    var i = t[img[index].name] = Sprite.from(resource[img[index].name]);
    if (i.data = img[index].data,
      i.position.set(img[index].x, img[index].y),
      img[index].pivot) {
      var s = img[index];
      i.pivot.set(s.pivot.x, s.pivot.y),
        i.position = {
          x: s.x + s.pivot.x,
          y: s.y + s.pivot.y
        }
    }
    t.addChild(i);
  }
}

export function renderLine(Container, resource, stage, Sprite, y) {
  var lineProp = new Container,
    line = new Container;
  line.x = 156;
  lineProp.y = y;
  for (var t = 0; t < parseInt(window.innerHeight / 147) + 1; t++) {
    console.log(t);
    var lineItem = Sprite.from(resource["line.png"]);
    lineItem.y = 147 * t + 10,
      line.addChild(lineItem)
  }
  var step = lineProp.labels = new Container;
  step.y = 250,
    step.x = 120;
  for (var o = (window.innerHeight - 250 - 150) / 5, i = 0; i < 6; i++) {
    var s = new Container;
    s.active = false;
    var r = s.bigNum = Sprite.from(resource["0" + (i + 1) + ".png"]);
    r.visible = false;
    var d = s.smallNum = Sprite.from(resource["0" + (i + 1) + "_s.png"]);
    d.alpha = .5,
      r.pivot.set(r.width, r.height / 2),
      d.pivot.set(d.width, d.height / 2),
      s.addChild(d, r),
      s.y = o * i,
      step.addChild(s)
  }
  lineProp.addChild(line, step),
    stage.addChild(lineProp);
  return lineProp;
}

export function setSpriteProp(sprite, prop) {
  for (let key in prop) {
    if (typeof prop[key] === 'object') {
      setSpriteProp(sprite[key], prop[key])
    } else {
      sprite[key] = prop[key];
    }
  }
}