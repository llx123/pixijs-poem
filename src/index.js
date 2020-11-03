import * as PIXI from 'pixi.js';


class LongPoem {
  constructor(options) {
    this.init(options);
  }
  init(options) {
    this.initData(options);
    this.initScene();
  }
  initData() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scale = this.width / 750;
  }
  initScene() {
    const {
      width,
      height,
      scale
    } = this;
    this.app = new PIXI.Application({
      width: width,
      height: height,
      backgroundColor: 16711673
    });
    this.app.stage.scale.set(scale, scale);
    // 加入场景
    document.querySelector('#app').appendChild(this.app.view);
    this.load();
  }
  load() {
    const loader = PIXI.Loader.shared;
    loader.add('static/things_02.json').load(this.setup.bind(this))
  }
  setup(loader) {
    let things02 = loader.resources['static/things_02.json'].textures;
    let tree = things02['first_tree.png'];
    let t2 = PIXI.Sprite.from(tree);
    this.app.stage.addChild(t2)

    var u = new PIXI.Container;
    for (var n = 0; n < 9; n++) {
      var m = new PIXI.Container,
        v = m.blackDot = PIXI.Sprite.from(things02["black_dot.png"]),
        h = m.redDot = PIXI.Sprite.from(things02["red_dot.png"])
      h.visible = !1,
        m.x = n % 3 * 78,
        m.y = 78 * parseInt(n / 3),
        m.addChild(v, h),
        u.addChild(m)
    }
    u.children[0].blackDot.visible = !1,
      u.children[0].redDot.visible = !0;
    var g = 0,
      x = 0;
    setInterval(function () {
        u.children[g].blackDot.visible = !0,
          u.children[g].redDot.visible = !1,
          x = g,
          g = parseInt(9 * Math.random()),
          x == g && (g = parseInt(9 * Math.random()),
            x = g),
          u.children[g].blackDot.visible = !1,
          u.children[g].redDot.visible = !0
      }, 300),
      u.position.set(180, 395),
      this.app.stage.addChild(u);
  }
}

new LongPoem({});