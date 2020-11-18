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

    this.pageHeight = 5890;
    this.animateList = [];
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
    // this.app.stage.scale.set(scale, scale); 这个方法模糊会导致模糊 更改使用viewport
    // 加入场景
    document.querySelector('#app').appendChild(this.app.view);
    this.load();
  }
  load() {
    const loader = PIXI.Loader.shared;
    loader
      .add("bg1", 'static/bg1.jpg')
      .add("bg2", 'static/bg2.jpg')
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
    let firstScene = new PIXI.Container();

    let resources = loader.resources;
    let things02 = resources['static/things_02.json'].textures;

    // 背景图
    for (var e = 0; e < 5; e++) {
      var t = PIXI.Sprite.from(resources.bg1.texture),
        a = PIXI.Sprite.from(resources.bg2.texture);
      t.y = 2945 * e * 2,
        a.y = 2945 * (2 * e + 1),
        firstScene.addChild(t, a)
    }


    let tree = PIXI.Sprite.from(things02['first_tree.png']);
    let people2 = PIXI.Sprite.from(things02['people2.png']);
    people2.y = 450;

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
      h.visible = false,
        m.x = n % 3 * 78,
        m.y = 78 * parseInt(n / 3),
        m.addChild(v, h),
        points.addChild(m)
    }
    points.children[0].blackDot.visible = false,
      points.children[0].redDot.visible = true;
    var g = 0,
      x = 0;
    setInterval(function () {
        points.children[g].blackDot.visible = true,
          points.children[g].redDot.visible = false,
          x = g,
          g = parseInt(9 * Math.random()),
          x == g && (g = parseInt(9 * Math.random()),
            x = g),
          points.children[g].blackDot.visible = false,
          points.children[g].redDot.visible = true
      }, 300),
      points.position.set(180, 395),
      firstContainer.addChild(points, title, text, logo);

    // 第一屏动画
    let firstAnimate = new PIXI.Container(),
      icon = PIXI.Sprite.from(things02["slide_icon.png"]),
      slide_text = PIXI.Sprite.from(things02["slide_text.png"]);
    slide_text.y = 64;
    firstAnimate.addChild(icon, slide_text);
    let max = new TweenMax.fromTo(icon, 0.5, {
      y: 0,
    }, {
      y: -30
    })
    max.yoyo(true).repeat(-1)
    icon.x = 80;

    console.log(this.height - 285);
    firstAnimate.position.set(272, this.height - 285);
    this.height < 1334 && (firstContainer.pivot.set(60, 0),
      firstContainer.x = 305,
      firstContainer.scale.set(1 - (1334 - this.height) / 1e3),
      firstAnimate.position.set(272, this.height - 225));
    // 藤蔓一
    var a = [];
    for (var n = 0; n < 60; n++) {
      n < 30 ? a.push(resources['static/tengman01.json'].textures["tengman_000" + n + ".png"]) : a.push(resources['static/tengman02.json'].textures["tengman_000" + n + ".png"]);
    }
    var animateTeng1 = new PIXI.AnimatedSprite(a);
    animateTeng1.animationSpeed = .4;
    animateTeng1.play();
    // 少女荡秋千
    var s = [];
    for (var n = 0; n < 76; n++) {
      s.push(resources['static/first_person.json'].textures[`a_000${n}.png`]);
    }
    var animateGirl = new PIXI.AnimatedSprite(s);
    animateGirl.position.set(420, 58)
    animateGirl.animationSpeed = .4
    animateGirl.play();

    // 人物一动画
    this.qPerson = [];
    for (var i = 5; i < 72; i++) {
      let n = i < 10 ? `0${i}` : i;
      if (i < 40) {
        this.qPerson.push(resources['static/q1_person_0.json'].textures[`a_000${n}.png`])
      } else {
        this.qPerson.push(resources['static/q1_person_1.json'].textures[`a_000${n}.png`])
      }
    }

    this.animateStep1 = PIXI.Sprite.from(resources['static/q1_2.json'].textures["q1_tengman_0.png"]);
    this.animateStep1.y = 490;
    this.animateStep2 = PIXI.Sprite.from(resources['static/q1_2.json'].textures["q1_tengman_1.png"]);
    this.animateStep2.y = 490;
    this.animateStep2.visible = false;
    this.animateStep1.visible = false;
    let newAnimPerson1 = new PIXI.AnimatedSprite(this.qPerson);
    newAnimPerson1.y = 490;

    this.animateList.push({
      ani: newAnimPerson1,
      startStamp: 475,
      endStamp: 1214,
      endFrame: 66
    });
    let X = this.animateStep1;
    let S = this.animateStep2;
    newAnimPerson1.onFrameChange = function () {
      35 < this.currentFrame && this.currentFrame <= 51 ? (X.visible = true,
        S.visible = false) : 51 < this.currentFrame ? (X.visible = false,
        S.visible = true) : (S.visible = false,
        X.visible = false)
    };

    firstScene.addChild(people2, tree, firstContainer, animateTeng1, animateGirl, this.animateStep1, this.animateStep2, newAnimPerson1, firstAnimate);
    this.app.stage.addChild(firstScene);

    this.initTouch();
  }

  initTouch() {
    new PhyTouch({
      touch: "#app", //反馈触摸的dom
      vertical: true, //不必需，默认是true代表监听竖直方向touch
      target: {
        y: 0
      }, //运动的对象
      property: "y", //被运动的属性
      min: -this.pageHeight, //不必需,运动属性的最小值
      max: 0, //不必需,滚动属性的最大值
      sensitivity: 1, //不必需,触摸区域的灵敏度，默认值为1，可以为负数
      factor: 1, //不必需,表示触摸位移运动位移与被运动属性映射关系，默认值是1
      moveFactor: 1, //不必需,表示touchmove位移与被运动属性映射关系，默认值是1
      step: 45, //用于校正到step的整数倍
      bindSelf: false,
      maxSpeed: 2, //不必需，触摸反馈的最大速度限制 
      value: 0,
      change: (value) => {
        if (value > 0) {
          value = 0;
        }
        if (value < -this.pageHeight) {
          value = -this.pageHeight;
        }
        this.app.stage.y = value;
        let progress = -value / this.pageHeight;

        let i = -value;
        this.animateList.forEach(function (e, t) {
          i > e.startStamp && i < e.endStamp ? e.ani.gotoAndStop(Math.min((i - e.startStamp) / (e.endStamp - e.startStamp) * e.endFrame, e.endFrame)) : i <= e.startStamp ? e.ani.gotoAndStop(0) : i > e.endStamp && (e.noStop ? e.ani.playing || e.ani.gotoAndPlay(70) : e.ani.gotoAndStop(e.endFrame))
        })

      }
    })
  }

}

new LongPoem({});