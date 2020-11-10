import * as PIXI from 'pixi.js';
import {
  TweenMax,
  TimelineMax
} from 'gsap';
import PhyTouch from 'phy-touch';

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
    loader
      .add('static/things_02.json')
      .add('static/tengman01.json')
      .add('static/tengman02.json')
      .add('static/first_person.json')
      .add('static/q1_person_0.json')
      .add('static/q1_person_1.json')
      .add('static/q1_2.json')
      .load(this.setup.bind(this))
  }
  setup(loader) {
    let things02 = loader.resources['static/things_02.json'].textures;
    let tree = PIXI.Sprite.from(things02['first_tree.png']);
    let people2 = PIXI.Sprite.from(things02['people2.png']);
    people2.y = 450;
    this.app.stage.addChild(people2, tree);

    let firstContainer = new PIXI.Container();
    firstContainer.x = 245;
    firstContainer.y = 222;
    var title = PIXI.Sprite.from(things02["first_title.png"]);
    title.y = 54;
    var logo = PIXI.Sprite.from(things02["first_logo.png"]),
      text = PIXI.Sprite.from(things02["first_text.png"]);
    text.y = 594;
    // 红色黑的的点
    var points = new PIXI.Container;
    for (var n = 0; n < 9; n++) {
      var m = new PIXI.Container,
        v = m.blackDot = PIXI.Sprite.from(things02["black_dot.png"]),
        h = m.redDot = PIXI.Sprite.from(things02["red_dot.png"])
      h.visible = !1,
        m.x = n % 3 * 78,
        m.y = 78 * parseInt(n / 3),
        m.addChild(v, h),
        points.addChild(m)
    }
    points.children[0].blackDot.visible = !1,
      points.children[0].redDot.visible = !0;
    var g = 0,
      x = 0;
    setInterval(function () {
        points.children[g].blackDot.visible = !0,
          points.children[g].redDot.visible = !1,
          x = g,
          g = parseInt(9 * Math.random()),
          x == g && (g = parseInt(9 * Math.random()),
            x = g),
          points.children[g].blackDot.visible = !1,
          points.children[g].redDot.visible = !0
      }, 300),
      points.position.set(180, 395),
      firstContainer.addChild(points, title, text, logo);
    this.app.stage.addChild(firstContainer);

    // 第一屏动画
    let firstAnimate = new PIXI.Container(),
      icon = PIXI.Sprite.from(things02["slide_icon.png"])
    firstAnimate.addChild(icon);
    let max = new TweenMax.fromTo(icon, 0.5, {
      y: 0,
    }, {
      y: -30
    })
    max.yoyo(true).repeat(-1)
    icon.x = 80;
    firstAnimate.position.set(272, this.height / this.scale - 285 * this.scale);
    this.app.stage.addChild(firstAnimate)
    // 藤蔓一
    var a = [];
    for (var n = 0; n < 60; n++) {
      n < 30 ? a.push(loader.resources['static/tengman01.json'].textures["tengman_000" + n + ".png"]) : a.push(loader.resources['static/tengman02.json'].textures["tengman_000" + n + ".png"]);
    }
    var i = new PIXI.AnimatedSprite(a);
    i.animationSpeed = .4;
    i.play();
    this.app.stage.addChild(i);
    // 少女荡秋千
    var s = [];
    for (var n = 0; n < 76; n++) {
      s.push(loader.resources['static/first_person.json'].textures[`a_000${n}.png`]);
    }
    var r = new PIXI.AnimatedSprite(s);
    r.position.set(420, 58)
    r.animationSpeed = .4
    r.play();
    this.app.stage.addChild(r);

    // 人物一动画
    this.x = [];
    for (var i = 5; i < 72; i++) {
      let n = i < 10 ? `0${i}` : i;
      if (i < 40) {
        this.x.push(loader.resources['static/q1_person_0.json'].textures[`a_000${n}.png`])
      } else {
        this.x.push(loader.resources['static/q1_person_1.json'].textures[`a_000${n}.png`])
      }
    }
    this.X = PIXI.Sprite.from(loader.resources['static/q1_2.json'].textures["q1_tengman_0.png"]);
    this.X.y = 90;
    this.S = PIXI.Sprite.from(loader.resources['static/q1_2.json'].textures["q1_tengman_1.png"]);
    this.S.y = 90;
    this.S.visible = !1;
    this.X.visible = !1;
    let nc = this.nc = PIXI.Sprite.from(this.x[0]);
    nc.y = 90;
    this.app.stage.addChild(nc, this.X, this.S);

    this.initTouch();
  }
  change() {
    let X = this.X;
    let S = this.S;
    35 < this.currentFrame && this.currentFrame <= 51 ? (X.visible = !0,
      S.visible = !1) : 51 < this.currentFrame ? (X.visible = !1,
      S.visible = !0) : (S.visible = !1,
      X.visible = !1)
  }
  play(progress) {
    let index = this.currentFrame = Math.floor(progress * 5 * 34);
    console.log(index, progress)
    if (index >= 0 && index < 67) {
      this.change()
      this.nc.texture = PIXI.Sprite.from(this.x[index]).texture;
    }
  }
  initTouch() {
    new PhyTouch({
      touch: "#app", //反馈触摸的dom
      vertical: true, //不必需，默认是true代表监听竖直方向touch
      target: {
        y: 0
      }, //运动的对象
      property: "y", //被运动的属性
      min: -2000, //不必需,运动属性的最小值
      max: 0, //不必需,滚动属性的最大值
      sensitivity: 1, //不必需,触摸区域的灵敏度，默认值为1，可以为负数
      factor: 1, //不必需,表示触摸位移运动位移与被运动属性映射关系，默认值是1
      moveFactor: 1, //不必需,表示touchmove位移与被运动属性映射关系，默认值是1
      step: 45, //用于校正到step的整数倍
      bindSelf: false,
      maxSpeed: 2, //不必需，触摸反馈的最大速度限制 
      value: 0,
      change: (value) => {
        let progress = -value / 2000;
        this.play(progress);
      }
    })
  }

}

new LongPoem({});