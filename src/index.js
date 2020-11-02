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
    let t1 = loader.resources['static/things_02.json'].textures['first_tree.png'];    
    let t2 = PIXI.Sprite.from(t1);
    this.app.stage.addChild(t2)
  }
}

new LongPoem({});