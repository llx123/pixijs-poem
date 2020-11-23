import {
  addSprite,
  renderLine,
  addSpriteWithData
} from './utils';
import {
  AnimatedSprite,
  Application,
  Container,
  Sprite,
  Loader
} from 'pixi.js';
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

    this.scrollStep = -1;
    this.pageHeight = 5890;
    this.animateList = [];
  }
  initScene() {
    const {
      width,
      height,
      scale
    } = this;
    this.app = new Application({
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
    const loader = Loader.shared;
    loader
      .add('bg1', 'static/bg1.jpg')
      .add('bg2', 'static/bg2.jpg')
      .add('static/things_02.json')
      .add('static/tengman01.json')
      .add('static/tengman02.json')
      .add('static/first_person.json')
      .add('static/q1_person_0.json')
      .add('static/q1_person_1.json')
      .add('static/q1_1.json')
      .add('static/q1_2.json')
      .add('01_leaf1', 'static/01_leaf1.json')
      .add('01_leaf2', 'static/01_leaf2.json')
      .add('q2_leaf', 'static/q2_leaf.json')
      .add('q1_q2_person_0', 'static/q1_q2_person_0.json')
      .add('q1_q2_person_1', 'static/q1_q2_person_1.json')
      .add('q1_q2_person_2', 'static/q1_q2_person_2.json')
      .add('q2_0_1', 'static/q2_0_1.json')
      .add('q3_leaf1', 'static/q3_leaf1.json')
      .add('q3_leaf2', 'static/q3_leaf2.json')
      .add('q2_q3', 'static/q2_q3.json')
      .add('q3_a0', 'static/q3_a0.json')
      .add('q3_a1', 'static/q3_a1.json')
      .add('q3_a2', 'static/q3_a2.json')
      .load(this.setup.bind(this))
  }
  setup(loader) {
    let firstScene = new Container();

    let resources = loader.resources;
    let things02 = resources['static/things_02.json'].textures;

    // 背景图
    for (var e = 0; e < 5; e++) {
      var t = Sprite.from(resources.bg1.texture),
        a = Sprite.from(resources.bg2.texture);
      t.y = 2945 * e * 2,
        a.y = 2945 * (2 * e + 1),
        firstScene.addChild(t, a)
    }


    let tree = Sprite.from(things02['first_tree.png']);
    let people2 = Sprite.from(things02['people2.png']);
    people2.y = 450;

    let firstContainer = new Container();
    firstContainer.x = 245;
    firstContainer.y = 222;
    var title = Sprite.from(things02["first_title.png"]);
    title.y = 54;
    var logo = Sprite.from(things02["first_logo.png"]),
      text = Sprite.from(things02["first_text.png"]);
    text.y = 594;
    // 红色黑的的点
    var points = new Container;
    for (var n = 0; n < 9; n++) {
      var m = new Container,
        v = m.blackDot = Sprite.from(things02["black_dot.png"]),
        h = m.redDot = Sprite.from(things02["red_dot.png"])
      h.visible = false,
        m.x = n % 3 * 78,
        m.y = 78 * parseInt(n / 3),
        m.addChild(v, h),
        points.addChild(m)
    }
    points.children[0].blackDot.visible = false,
      points.children[0].redDot.visible = true;
    var dotNum = 0,
      x = 0;
    setInterval(function () {
        points.children[dotNum].blackDot.visible = true,
          points.children[dotNum].redDot.visible = false,
          x = dotNum,
          dotNum = parseInt(9 * Math.random()),
          x == dotNum && (dotNum = parseInt(9 * Math.random()),
            x = dotNum),
          points.children[dotNum].blackDot.visible = false,
          points.children[dotNum].redDot.visible = true
      }, 300),
      points.position.set(180, 395),
      firstContainer.addChild(points, title, text, logo);

    // 第一屏动画
    let firstAnimate = new Container(),
      icon = Sprite.from(things02["slide_icon.png"]),
      slide_text = Sprite.from(things02["slide_text.png"]);
    slide_text.y = 64;
    firstAnimate.addChild(icon, slide_text);
    let max = new TweenMax.fromTo(icon, 0.5, {
      y: 0,
    }, {
      y: -30
    })
    max.yoyo(true).repeat(-1)
    icon.x = 80;

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
    var animateTeng1 = new AnimatedSprite(a);
    animateTeng1.animationSpeed = .4;
    animateTeng1.play();
    // 少女荡秋千
    var s = [];
    for (var n = 0; n < 76; n++) {
      s.push(resources['static/first_person.json'].textures[`a_000${n}.png`]);
    }
    var animateGirl = new AnimatedSprite(s);
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

    this.animateStep1 = Sprite.from(resources['static/q1_2.json'].textures["q1_tengman_0.png"]);
    this.animateStep1.y = 490;
    this.animateStep2 = Sprite.from(resources['static/q1_2.json'].textures["q1_tengman_1.png"]);
    this.animateStep2.y = 490;
    this.animateStep2.visible = false;
    this.animateStep1.visible = false;
    let newAnimPerson1 = new AnimatedSprite(this.qPerson);
    newAnimPerson1.y = 490;

    this.animateList.push({
      ani: newAnimPerson1,
      startStamp: 475,
      endStamp: 1214,
      endFrame: 66
    });
    let _this = this;
    newAnimPerson1.onFrameChange = function () {
      35 < this.currentFrame && this.currentFrame <= 51 ? (_this.animateStep1.visible = true,
        _this.animateStep2.visible = false) : 51 < this.currentFrame ? (_this.animateStep1.visible = false,
        _this.animateStep2.visible = true) : (_this.animateStep2.visible = false,
        _this.animateStep1.visible = false)
    };

    firstScene.addChild(people2, tree, firstContainer, animateTeng1, animateGirl, this.animateStep1, this.animateStep2, newAnimPerson1, firstAnimate);
    addSprite({
      box: firstScene,
      resource: things02,
      img: [{
        name: "first_grass.png",
        x: 667,
        y: 1006
      }, {
        name: "music.png",
        x: 557,
        y: this.height - 120
      }]
    }, Sprite);

    this.app.stage.addChild(firstScene);

    this.lineProp = renderLine(Container, things02, this.app.stage, Sprite, this.height);
    // test开始
    var Ae = new Container;
    Ae.y = this.height;
    var e = [];
    for (var t = 0; t < 57; t++) {
      e.push(resources['01_leaf1'].textures["2_000" + (t < 10 ? "0" + t : t) + ".png"])
    }
    var a = new AnimatedSprite(e);
    a.animationSpeed = .3,
      a.x = 515,
      a.play();
    for (var n = [], o = 0; o < 47; o++) {
      n.push(resources['01_leaf2'].textures["a_000" + (o < 10 ? "0" + o : o) + ".png"])
    }
    var i = new AnimatedSprite(n);
    i.animationSpeed = .28,
      i.y = 409,
      i.play()
    Ae.addChild(a, i);
    addSprite({
      box: Ae,
      resource: things02,
      img: [{
        name: "01_title.png",
        x: 236,
        y: 317
      }, {
        name: "01_right_leaf.png",
        x: 675,
        y: 154
      }, {
        name: "01_flower.png",
        x: 461,
        y: 1210
      }]
    }, Sprite);

    addSpriteWithData({
      box: Ae,
      resource: things02,
      img: [{
        name: "01_leaf_1.png",
        x: 35,
        y: 90,
        data: [{
          startStamp: 100,
          endStamp: 1600,
          start: {
            x: 35,
            y: 90,
            rotation: .01
          },
          end: {
            x: 135,
            y: 290,
            rotation: -Math.PI / 180 * 30
          }
        }]
      }, {
        name: "01_leaf_2.png",
        x: 50,
        y: 71,
        data: [{
          startStamp: 100,
          endStamp: 2e3,
          start: {
            x: 50,
            y: 71,
            rotation: .01
          },
          end: {
            x: 60,
            y: 271,
            rotation: Math.PI / 180 * 30
          }
        }]
      }, {
        name: "01_leaf_3.png",
        x: 122,
        y: 154,
        data: [{
          startStamp: 100,
          endStamp: 2e3,
          start: {
            x: 122,
            y: 154,
            rotation: .01
          },
          end: {
            x: 522,
            y: 254,
            rotation: -Math.PI / 180 * 30
          }
        }]
      }, {
        name: "01_leaf_4.png",
        x: 700,
        y: 749,
        data: [{
          startStamp: 600,
          endStamp: 2500,
          start: {
            x: 700,
            y: 749,
            rotation: Math.PI / 180 * 10
          },
          end: {
            x: 500,
            y: 800,
            rotation: Math.PI / 180 * 30
          }
        }]
      }, {
        name: "01_leaf_5.png",
        x: 611,
        y: 916,
        data: [{
          startStamp: 600,
          endStamp: 2500,
          start: {
            x: 711,
            y: 816,
            rotation: .01
          },
          end: {
            x: 460,
            y: 1016,
            rotation: Math.PI / 180 * 20
          }
        }]
      }, {
        name: "01_leaf_6.png",
        x: 625,
        y: 929,
        data: [{
          startStamp: 600,
          endStamp: 2500,
          start: {
            x: 525,
            y: 829,
            rotation: .01
          },
          end: {
            x: 725,
            y: 1029,
            rotation: -Math.PI / 180 * 20
          }
        }]
      }, {
        name: "01_leaf_7.png",
        x: 665,
        y: 1003,
        data: [{
          startStamp: 600,
          endStamp: 2800,
          start: {
            x: 665,
            y: 953
          },
          end: {
            x: 645,
            y: 1083
          }
        }]
      }, {
        name: "01_leaf_8.png",
        x: 56,
        y: 1210,
        data: [{
          startStamp: 1e3,
          endStamp: 3e3,
          start: {
            x: 156,
            y: 1110,
            rotation: .01
          },
          end: {
            x: -30,
            y: 1310,
            rotation: Math.PI / 180 * 30
          }
        }]
      }, {
        name: "01_leaf_9.png",
        x: 680,
        y: 288,
        data: [{
          startStamp: 100,
          endStamp: 1600,
          start: {
            x: 680,
            y: 258,
            rotation: .01
          },
          end: {
            x: 680,
            y: 288,
            rotation: -Math.PI / 180 * 10
          }
        }]
      }]
    }, Sprite)

    for (var s = [], r = 0; r < 45; r++) {
      s.push(resources['static/q1_1.json'].textures["a_000" + (r < 10 ? "0" + r : r) + ".png"]);
    }
    var d = new AnimatedSprite(s);
    d.position.set(-70, -65),
      d.animationSpeed = .3;
    d.play();
    var p = new Container();
    p.play = function () {
      console.log('play');
    }
    p.stop = function () {
      console.log('stop');
    }
    for (var c = [], u = 0; u < 60; u++)
      c.push(resources['static/q1_2.json'].textures["C_000" + (u < 10 ? "0" + u : u) + ".png"]);
    var m = new AnimatedSprite(c);
    m.position.set(-150, 30),
      m.animationSpeed = .3;
    for (var v = [], h = 0; h < 61; h++)
      v.push(resources['static/q1_2.json'].textures["D_000" + (h < 10 ? "0" + h : h) + ".png"]);
    var g = new AnimatedSprite(v);
    g.position.set(280, -120),
      g.animationSpeed = .3;

    var x = new Container,
      _ = Sprite.from(things02["01_left_kuo.png"]),
      f = Sprite.from(things02["01_right_kuo.png"]);
    x.addChild(_, f),
      _.x = -50,
      _.visible = !1,
      f.visible = !1;
    var y = Ae.questions = new Container;
    y.scrollY = 1450,
      y.selected = !1,
      y.addChild(x),
      y.position.set(263, 490);

    // 01-questions
    for (var w = [d, p, m, g], b = (n) => {
        var o = new Container;
        o.select = !1,
          o.y = 210 * n,
          o.addChild(w[n]),
          w[n].visible = !1,
          o.ani = w[n];
        var e = o.textBg = Sprite.from(things02["01_text_bg.png"]);
        e.x = -5,
          e.visible = !1;
        var t = o.text = Sprite.from(things02["01_t" + (n + 1) + ".png"]);
        if (3 == n) {
          var a = o.flower = Sprite.from(things02["01_3_flower.png"]);
          a.visible = !1,
            a.position.set(-112, -73),
            o.addChild(a)
        }
        this.ut(t, () => {
            var e = o;
            if (1 != e.active)
              if (this.mt(0, n),
                y.children.forEach(function (e, t) {
                  1 == e.active && (e.active = !1,
                    e.ani.stop(),
                    e.ani.visible = !1,
                    e.textBg.visible = !1,
                    4 == t && (e.flower.visible = !1))
                }),
                e.active = !0,
                e.ani.play(),
                e.ani.visible = !0,
                e.textBg.visible = !0,
                3 == n && (e.flower.visible = !0),
                0 == _.visible)
                _.visible = !0,
                f.visible = !0,
                // new E.default.Tween({
                //   alpha: 0
                // }).to({
                //   alpha: 1
                // }, 300).onUpdate(function (e, t) {
                //   _.alpha = e.alpha,
                //     f.alpha = e.alpha
                // }).start(),
                _.y = 210 * n - 20,
                f.y = 210 * n - 20,
                f.x = 0 == n ? 429 : 340;
              else {
                var t, a = 210 * n - 20;
                t = 0 == n ? 429 : 340,
                  // new E.default.Tween({
                  //   y: _.y
                  // }).to({
                  //   y: a
                  // }, 300).onUpdate(function (e, t) {
                  _.y = e.y,
                  f.y = e.y
                // }).start(),
                // new E.default.Tween({
                //   x: f.x
                // }).to({
                //   x: t
                // }, 300).onUpdate(function (e, t) {
                //   f.x = e.x
                // }).start()
              }
          }),
          o.addChild(e, t),
          y.addChild(o)
      }, X = 0; X < 4; X++) {
      b(X);
    }

    this.Ae = Ae;
    Ae.addChild(y)
    this.app.stage.addChild(Ae);
    // 02-questions
    var Me = new Container,
      Ve = this.height;
    (() => {
      Ve += Ae.height - 100,
        Me.y = Ve;
      for (var e = [], t = 0; t < 50; t++)
        e.push(resources['q2_leaf'].textures["leaf1_000" + t + ".png"]);
      var a = new AnimatedSprite(e);
      a.animationSpeed = .3,
        a.y = -60,
        a.play();
      for (var n = [], o = 0; o < 53; o++)
        n.push(resources['q2_leaf'].textures["leaf2_000" + o + ".png"]);
      var i = new AnimatedSprite(n);
      i.animationSpeed = .3,
        i.y = 440,
        i.play(),
        Me.addChild(a, i),
        addSprite({
          box: Me,
          resource: things02,
          img: [{
            name: "02_title.png",
            x: 237,
            y: 436
          }, {
            name: "02_flower_1.png",
            x: 460,
            y: 4
          }, {
            name: "02_flower_2.png",
            x: 323,
            y: 81
          }, {
            name: "02_flower_3.png",
            x: 309,
            y: 162
          }, {
            name: "02_flower_4.png",
            x: 178,
            y: 200
          }, {
            name: "02_flower_5.png",
            x: 579,
            y: 416
          }]
        }, Sprite);

      var y = "q1_q2_person_0",
        w = "q1_q2_person_1",
        b = "q1_q2_person_2";

      for (var s = [], r = 0; r < 45; r++) {
        s.push(resources[r < 24 ? y : r < 31 ? w : b].textures["a_000" + r + ".png"]);
      }
      var d = Sprite.from(resources['q1_q2_person_2'].textures["q1_q2_tengman.png"]);
      d.visible = !1;
      var p = new AnimatedSprite(s);
      p.position.set(0, 0),
        p.animationSpeed = .3,
        p.onFrameChange = function () {
          this.currentFrame < 35 ? d.visible = !1 : d.visible = !0
        },
        p.y = -200,
        d.y = -200,
        Me.addChild(d, p),
        this.animateList.push({
          ani: p,
          startStamp: 2048,
          endStamp: 2959,
          endFrame: 44
        });
      var l = Me.questions = new Container;
      l.selected = !1,
        l.scrollY = 3010,
        l.position.set(254, 596);
      for (var c = [{
          x: 0,
          y: 0
        }, {
          x: 225,
          y: 216
        }, {
          x: 0,
          y: 346
        }, {
          x: 225,
          y: 605
        }], u = [{
          x: -18,
          y: 83
        }, {
          x: -18,
          y: 17
        }, {
          x: -18,
          y: 65
        }, {
          x: -18,
          y: -4
        }], m = [{
          x: 60,
          y: -40
        }, {
          x: -48,
          y: -197
        }, {
          x: 63,
          y: 0
        }, {
          x: 14,
          y: -106
        }], v = (t) => {
          var a = new Container;
          a.active = !1;
          for (var e = [], n = 0; n < (0 == t ? 25 : 1 == t ? 48 : 2 == t ? 25 : 63); n++)
            e.push(resources['q2_0_1'].textures[(0 == t ? "a" : 1 == t ? "b" : 2 == t ? "c" : "d") + "_000" + n + ".png"]);
          var o = a.ani = new AnimatedSprite(e);
          o.animationSpeed = .3,
            o.position.set(m[t].x, m[t].y);
          var i = a.letterBg = Sprite.from(things02["02_selection_bg.png"]);
          i.position.set(u[t].x, u[t].y),
            i.visible = !1;
          var s = a.text = Sprite.from(things02["02_text_" + t + ".png"]);
          a.addChild(i, s, o),
            this.ut(a, () => {
              var e = a;
              1 != e.active && (this.mt(1, t),
                l.children.forEach(function (e, t) {
                  1 == e.active && (e.active = !1,
                    e.ani.gotoAndStop(0),
                    e.letterBg.visible = !1)
                }),
                e.active = !0,
                e.ani.play(),
                e.letterBg.visible = !0)
            }),
            a.position.set(c[t].x, c[t].y),
            l.addChild(a)
        }, h = 0; h < 4; h++)
        v(h);
      Me.addChild(l);
      for (var g = [], x = 0; x < 54; x++)
        g.push(resources['q2_0_1'].textures["qingting_000" + x + ".png"]);
      var _ = new AnimatedSprite(g);
      _.animationSpeed = .3,
        _.position.set(170, 1250),
        _.play(),
        Me.addChild(_),
        this.Me = Me,
        this.app.stage.addChild(Me);
    })();
    // 03-questions
    var Te = new Container;
    (() => {
      Ve += Me.height - 200,
        Te.y = Ve,
        addSprite({
          box: Te,
          resource: things02,
          img: [{
            name: "03_title.png",
            x: 214,
            y: 674
          }, {
            name: "03_branch.png",
            x: 0,
            y: 176
          }, {
            name: "03_leaf_2.png",
            x: 20,
            y: 1295
          }]
        }, Sprite),
        addSpriteWithData({
          box: Te,
          resource: things02,
          img: [{
            name: "03_leaf_1_1.png",
            x: 128,
            y: 485,
            data: [{
              startStamp: 3200,
              endStamp: 5e3,
              start: {
                x: 128,
                y: 485,
                rotation: .01
              },
              end: {
                x: 178,
                y: 885,
                rotation: -Math.PI / 180 * 20
              }
            }]
          }, {
            name: "03_leaf_1_2.png",
            x: 136,
            y: 504,
            data: [{
              startStamp: 3200,
              endStamp: 5e3,
              start: {
                x: 136,
                y: 504,
                rotation: .01
              },
              end: {
                x: 386,
                y: 804,
                rotation: Math.PI / 180 * 30
              }
            }]
          }, {
            name: "03_leaf_1_3.png",
            x: 43,
            y: 568,
            data: [{
              startStamp: 3200,
              endStamp: 5e3,
              start: {
                x: 43,
                y: 568,
                rotation: .01
              },
              end: {
                x: -57,
                y: 768,
                rotation: Math.PI / 180 * 10
              }
            }]
          }, {
            name: "03_leaf_3.png",
            x: 120,
            y: 1634,
            data: [{
              startStamp: 4200,
              endStamp: 6e3,
              start: {
                x: 20,
                y: 1534
              },
              end: {
                x: 220,
                y: 1834
              }
            }]
          }, {
            name: "03_leaf_4.png",
            x: 100,
            y: 1534,
            data: [{
              startStamp: 4200,
              endStamp: 6e3,
              start: {
                x: 200,
                y: 1434
              },
              end: {
                x: 0,
                y: 1734
              }
            }]
          }]
        }, Sprite);
      for (var e = [], t = 0; t < 50; t++)
        e.push(resources['q3_leaf1'].textures["q3_leaf1_000" + t + ".png"]);
      var a = new AnimatedSprite(e);
      a.animationSpeed = .3,
        a.position.set(604, 17),
        a.play();
      for (var n = [], o = 0; o < 48; o++)
        n.push(resources['q3_leaf2'].textures["q3_leaf2_000" + o + ".png"]);
      var i = new AnimatedSprite(n);
      i.animationSpeed = .3,
        i.position.set(0, 92),
        i.play();
      for (var s = [], r = 0; r < 50; r++)
        s.push(resources['q3_leaf1'].textures["q3_flower_000" + r + ".png"]);
      var d = new AnimatedSprite(s);
      d.animationSpeed = .3,
        d.position.set(522, 380),
        d.play(),
        Te.addChild(a, i, d);
      for (var p = [], l = 0; l < 54; l++)
        p.push(resources['q2_q3'].textures["q2_q3_000" + l + ".png"]);
      var c = Sprite.from(resources['q2_q3'].textures["q2_q3_tengman.png"]);
      c.visible = !1;
      var u = new AnimatedSprite(p);
      u.position.set(0, 0),
        u.animationSpeed = .3,
        u.onFrameChange = function () {
          this.currentFrame < 37 ? c.visible = !1 : c.visible = !0
        },
        u.position.set(492, -250),
        c.position.set(492, -250),
        Te.addChild(c, u),
        this.animateList.push({
          ani: u,
          startStamp: 3652,
          endStamp: 4282,
          endFrame: 53
        });
      var m = Te.questions = new Container;
      m.selected = !1,
        m.scrollY = 4650,
        m.position.set(245, 806);
      var v = new Container;

      function h() {
        for (var e = function (e) {
            var a = Sprite.from(things02["bubble.png"]);
            a.rotation = Math.random() * Math.PI * 2;
            var t = {
                x: 170 * Math.random(),
                y: 80 * Math.random() + 80
              },
              n = {
                x: t.x + 100 * Math.random() - 50,
                y: t.y + Math.random() - 200 - 30
              },
              o = .3 * Math.random() + .7;
            // new E.default.Tween({
            //     x: t.x,
            //     y: t.y
            //   }).to({
                // x: n.x,
                // y: n.y
            //   }, 600 * Math.random() + 2300).onUpdate(function (e, t) {
            a.position.set(e.x, e.y),
              a.scale.set(o * t),
              // a.alpha = t < .2 ? 5 * t : .8 < t ? 5 * (1 - t) : 1
            //   }).onComplete(function () {
                v.removeChild(a)
            //   }).start(),
            v.addChild(a)
          }, t = 0; t < 2; t++) {
          e(t)
        }
      }
      v.gotoAndPlay = function () {
          v.timer && (clearInterval(v.timer),
              v.timer = null),
            h(),
            v.timer = setInterval(h, 300)
        },
        v.stop = function () {
          clearInterval(v.timer),
            v.timer = null,
            v.removeChildren()
        };
      var Y = "q3_a0",
        K = "q3_a1",
        Z = "q3_a2";
      for (var g = [], x = 0; x < 44; x++) {
        g.push(resources[x < 14 ? Y : x < 28 ? K : Z].textures["q3_a_000" + x + ".png"]);
      }
      var _ = new AnimatedSprite(g);
      _.y = 674,
        _.visible = !1,
        _.animationSpeed = .3,
        _.loop = !1;
      var f = new Container;
      f.visible = !1;
      var y = Sprite.from(things02["q3_cloud1.png"]);
      y.position.set(-135, 10);
      var w = Sprite.from(things02["q3_cloud2.png"]);
      w.position.set(96, 32);
      var b = Sprite.from(things02["q3_sun.png"]);
      b.pivot.set(72, 71),
        b.position.set(124, 71),
        // b.tween = new E.default.Tween({
        //   rotate: 0
        // }).to({
        //   rotate: 2 * Math.PI
        // }, 12e3).onUpdate(function (e, t) {
        b.rotation = e.rotate
      // }).repeat(1 / 0),
      f.y = 500,
        f.addChild(b, y, w),
        f.gotoAndPlay = () => {
          f.visible = !0,
            // new E.default.Tween({
            //   alpha: 0
            // }).to({
            //   alpha: 1
            // }, 500).onUpdate(function (e, t) {
            // f.alpha = e.alpha
          // }).start(),
          // new E.default.Tween({
          //   x: 0
          // }).to({
          //   x: 1
          // }, 1500).onUpdate(function (e, t) {
          y.x = -135 - 90 * e.x,
            w.x = 96 + 110 * e.x
          // }).start(),
          // b.tween.start()
        },
        f.stop = function () {
          f.visible = !1
            // b.tween.stop()
        };
      var X = new Container;
      X.visible = !1;
      var S = Sprite.from(things02["q3_cloud3.png"]);
      S.position.set(18, 146);
      var C = Sprite.from(things02["q3_cloud4.png"]);
      C.position.set(124, 48);
      var q = Sprite.from(things02["q3_moon.png"]);
      q.position.set(44, 0),
        X.y = 500,
        X.addChild(q, S, C),
        X.gotoAndPlay = () => {
          X.visible = !0,
            // new E.default.Tween({
            //   alpha: 0
            // }).to({
            //   alpha: 1
            // }, 500).onUpdate(function (e, t) {
            // X.alpha = e.alpha
          // }).start(),
          // new E.default.Tween({
          //   x: 0
          // }).to({
          //   x: 1
          // }, 1500).onUpdate(function (e, t) {
          S.x = 18 - 90 * e.x,
            C.x = 124 + 110 * e.x
          // }).start()
        },
        X.stop = function () {
          X.visible = !1
        };
      for (var j = (t) => {
          var a = new Container;
          a.active = !1,
            a.x = t % 2 * 230,
            a.y = 310 * parseInt(t / 2);
          var e = a.text = Sprite.from(things02["03_" + t + ".png"]),
            n = a.chosen_bg = Sprite.from(things02["03_selection_bg.png"]);
          n.visible = !1,
            n.position.set(-18, 69),
            0 == t ? a.ani = _ : 1 == t ? (a.addChild(v),
              a.ani = v) : 2 == t ? a.ani = X : 3 == t && (a.ani = f),
            a.addChild(n, e),
            this.ut(a, () => {
              var e = a;
              1 != e.active && (this.mt(2, t),
                m.children.forEach(function (e, t) {
                  1 == e.active && (e.active = !1,
                    e.ani.stop(),
                    e.ani.visible = !1,
                    e.chosen_bg.visible = !1)
                }),
                e.active = !0,
                e.ani.visible = !0,
                e.ani.gotoAndPlay(0),
                e.chosen_bg.visible = !0)
            }),
            m.addChild(a)
        }, A = 0; A < 4; A++)
        j(A);
      Te.addChild(m, _, f, X);
      var M = Te.smoke = Sprite.from(resources['q3_a2'].textures["q3_smoke.png"]);
      M.position.set(0, 438),
        Te.addChild(M),
        this.Te = Te,
        this.app.stage.addChild(Te)
    })();

    (function () {
      for (var o = [Ae, Me, Te], i = [{
          x: 265,
          y: 293
        }, {
          x: 266,
          y: 412
        }, {
          x: 243,
          y: 650
        }, {
          x: 232,
          y: 440
        }, {
          x: 286,
          y: 838
        }, {
          x: 229,
          y: 953
        }], e = function (e) {
          var t = o[e].notSelect = new Container;
          t.visible = !1;
          var a = Sprite.from(things02["not_icon.png"]),
            n = Sprite.from(things02["not_text.png"]);
          n.position.set(28, 1),
            t.addChild(a, n),
            t.position.set(i[e].x, i[e].y),
            // t.tween = new E.default.Tween({
            //   alpha: 1
            // }).to({
            //   alpha: 0
            // }, 500).onUpdate(function (e, t) {
            //   a.alpha = e.alpha
            // }).yoyo(!0).easing(E.default.Easing.Quadratic.Out).repeat(1 / 0),
            t.play = function () {
              t.visible = !0,
                // t.tween.start()
                console.log('start');
            },
            t.stop = function () {
              t.visible = !1,
                // t.tween.stop()
                console.log('stop');
            },
            o[e].addChild(t)
        }, t = 0; t < o.length; t++)
        e(t);
      var Ne = new Container;
      var a = Ne.nameNotice = new Container;
      a.visible = !1;
      var n = Sprite.from(things02["not_icon.png"]),
        s = Sprite.from(things02["no_name.png"]);
      s.position.set(28, 1);
      var r = Sprite.from(things02["long_name.png"]);
      r.position.set(28, 1);
      var d = Sprite.from(things02["wrong_name.png"]);
      d.position.set(28, 1),
        s.visible = d.visible = r.visible = !1,
        a.addChild(n, s, d, r),
        a.position.set(99, 671),
        // a.tween = new E.default.Tween({
        //   alpha: 1
        // }).to({
        //   alpha: 0
        // }, 500).onUpdate(function (e, t) {
        //   n.alpha = e.alpha
        // }).yoyo(!0).easing(E.default.Easing.Quadratic.Out).repeat(1 / 0),
        a.play = function (e) {
          a.visible = !0,
            // a.tween.start(),
            "no_name" === e && (s.visible = !0),
            "long_name" === e && (r.visible = !0),
            "wrong_name" === e && (d.visible = !0)
        },
        a.stop = function () {
          a.visible = !1,
            s.visible = d.visible = r.visible = !1,
            // a.tween.stop()
            console.log('stop');
        },
        Ne.addChild(a);
      var p = Ne.sexNotice = new Container;
      p.visible = !1;
      var l = Sprite.from(things02["not_icon.png"]),
        c = Sprite.from(things02["no_sex.png"]);
      c.position.set(28, 1),
        p.addChild(l, c),
        p.position.set(99, 1e3),
        // p.tween = new E.default.Tween({
        //   alpha: 1
        // }).to({
        //   alpha: 0
        // }, 500).onUpdate(function (e, t) {
        //   l.alpha = e.alpha
        // }).yoyo(!0).easing(E.default.Easing.Quadratic.Out).repeat(1 / 0),
        p.play = function () {
          p.visible = !0,
            p.tween.start()
        },
        p.stop = function () {
          p.visible = !1,
            p.tween.stop()
        },
        Ne.addChild(p)
    })()
    // 结束
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
        });
        (-value < this.height) ? this.lineProp.y = this.height: this.lineProp.y = -value;


        (i <= 800 || 1e4 < i) ?
        -1 !== this.scrollStep && this.questionStep(-1): (1200 < i && i <= 2200) ?
          0 !== this.scrollStep && this.questionStep(0) : 2700 < i && i <= 3600 ?
          1 !== this.scrollStep && this.questionStep(1) : 4200 < i && i <= 5e3 ?
          2 !== this.scrollStep && this.questionStep(2) : 5600 < i && i <= 6400 ?
          3 !== this.scrollStep && this.questionStep(3) : 7200 < i && i <= 8e3 ?
          4 !== this.scrollStep && this.questionStep(4) : 8800 < i && i <= 9500 &&
          5 !== this.scrollStep && this.questionStep(5);
      }
    })
  }
  questionStep(t) {
    if (this.scrollStep = t,
      this.lineProp.labels.children.forEach(function (a, e) {
        1 == a.active && e !== t && (a.active = false,
          // new E.default.Tween({
          //   scale: 1
          // }).to({
          //   scale: .382
          // }, 300).onUpdate(function (e, t) {
          //   a.bigNum.scale.set(e.scale),
          //     a.bigNum.alpha = 1 - t / 2
          // }).onComplete(function () {
          a.bigNum.visible = false,
          a.smallNum.visible = true
          // }).start()
        )
      }),
      -1 != t) {
      var a = this.lineProp.labels.children[t];
      1 != a.active && (a.smallNum.visible = false,
        a.bigNum.visible = true,
        a.active = true
        // new E.default.Tween({
        //   scale: .382
        // }).to({
        //   scale: 1
        // }, 300).onUpdate(function (e, t) {
        //   a.bigNum.scale.set(e.scale),
        //     a.bigNum.alpha = t / 2 + .5
        // }).start()
      )
    }
  }
  ut(a, t) {
    a.interactive = !0,
      a.buttonMode = !0,
      a.on("touchstart", function (e) {
        var t = e.data.originalEvent;
        a.startY = t.touches[0].pageY,
          a.touch = !0,
          a.yValue = 0
      }).on("touchmove", function (e) {
        if (a.touch) {
          var t = e.data.originalEvent;
          a.yValue = Math.abs(t.touches[0].pageY - a.startY)
        }
      }).on("touchend", function (e) {
        a.touch && (30 < a.yValue || (
          // $("#click")[0].currentTime = 0,
          // $("#click")[0].play(),
          t()))
      })
  }
  mt(e, t) {
    let De = [this.Ae.questions, this.Me.questions, this.Te.questions];
    De[e].selected = !0,
      De[e].selectIndex = t,
      De[e].parent.notSelect.stop()
    // _t.remove(De[e]),
    // ht()
  }
}

new LongPoem({});