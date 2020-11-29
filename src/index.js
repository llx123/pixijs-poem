import {
  addSprite,
  renderLine,
  addSpriteWithData,
  setSpriteProp
} from './utils';
import {
  questionOrnament
} from './question-ornament';
import {
  sceneList
} from './scene-config';
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
    this.pageHeight = 9e3;
    this.animateList = [];
    this.ze = [];
    this.sprites = {}
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
    this.sprites.stage = this.app.stage;
    // this.app.stage.scale.set(scale, scale); 这个方法模糊会导致模糊 更改使用viewport
    document.querySelector('#app').appendChild(this.app.view);
    this.load();
  }
  load() {
    const loader = Loader.shared;
    loader
      .add('bg1', 'static/bg1.jpg')
      .add('bg2', 'static/bg2.jpg')
      .add('things_02', 'static/things_02.json')
      .add('tengman01', 'static/tengman01.json')
      .add('tengman02', 'static/tengman02.json')
      .add('first_person', 'static/first_person.json')
      .add('q1_person_0', 'static/q1_person_0.json')
      .add('q1_person_1', 'static/q1_person_1.json')
      .add('q1_1', 'static/q1_1.json')
      .add('q1_2', 'static/q1_2.json')
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
      .add('0405_leaf', 'static/0405_leaf.json')
      .add('q3_q4_person_0', 'static/q3_q4_person_0.json')
      .add('q3_q4_person_1', 'static/q3_q4_person_1.json')
      .add('q4_0', 'static/q4_0.json')
      .add('q4_1', 'static/q4_1.json')
      .add('q4_2', 'static/q4_2.json')
      .add('q4_3', 'static/q4_3.json')
      .add('q4_q5_person', 'static/q4_q5_person.json')
      .add('q5_a_0', 'static/q5_a_0.json')
      .add('q5_a_1', 'static/q5_a_1.json')
      .add('q5_a_2', 'static/q5_a_2.json')
      .add('q5_b', 'static/q5_b.json')
      .add('06_leaf', 'static/06_leaf.json')
      .add('q5_q6_0', 'static/q5_q6_0.json')
      .add('q5_q6_1', 'static/q5_q6_1.json')
      .add('q5_q6_2', 'static/q5_q6_2.json')
      .add('q6_0', 'static/q6_0.json')
      .add('q6_1', 'static/q6_1.json')
      .load(this.setup.bind(this))
  }
  setup(loader) {
    let resources = loader.resources,
      things02 = resources['things_02'].textures;

    // render by config
    sceneList.map((item) => {
      let sprite;
      const {
        id,
        type,
        parent,
        to,
      } = item;
      if (type === 'sprite') {
        if (Array.isArray(item.nameList)) {
          item.nameList.map(name => {
            let sp = Sprite.from(resources[item.filename].textures[name.name])
            name.prop && setSpriteProp(sp, name.prop);
            name.id && (this.sprites[name.id] = sp);
            parent && this.sprites[parent].addChild(sp);
          })
        } else {
          sprite = Sprite.from(resources[item.filename].textures[item.name]);
        }
        if (to) {
          TweenMax.to(sprite, 1, to);
        }
      } else if (type === 'container') {
        sprite = new Container();
      } else if (type === 'callback') {
        item.render(this.sprites[parent], resources);
      } else if (type === 'animate') {
        let arr = [],
          boundary = item.boundary || item.range[1];
        for (let i = item.range[0]; i < item.range[1]; i++) {
          i < boundary ?
            arr.push(resources[item.filename].textures[`${item.texture}${i}.png`]) :
            arr.push(resources[item.filenameBoundary].textures[`${item.textureBoundary}${i}.png`]);
        }
        sprite = new AnimatedSprite(arr);
        sprite.animationSpeed = item.speed;
        item.autoPlay && sprite.play();
      } else if (type === 'frame') {
        this[item.arrName] = [];
        for (var i = item.range[0]; i < item.range[1]; i++) {
          let n = i < 10 && item.addZero ? `0${i}` : i,
            boundary = item.boundary || item.range[1];
          i < boundary ?
            this[item.arrName].push(resources[item.filename].textures[`${item.texture}${n}.png`]) :
            this[item.arrName].push(resources[item.filenameBoundary].textures[`${item.textureBoundary}${n}.png`])
        }
        sprite = new AnimatedSprite(this[item.arrName]);
        item.onFrameChange && (sprite.onFrameChange = item.onFrameChange(this.sprites))
        this[item.animateList].push({
          ani: sprite,
          ...item.frame
        });
      }
      if (sprite) {
        id && (this.sprites[id] = sprite);
        item.prop && setSpriteProp(sprite, item.prop);
        parent && this.sprites[parent].addChild(sprite);
      }
    })

    this.height < 1334 && this.setScale();
    this.lineProp = renderLine(Container, things02, this.app.stage, Sprite, this.height);

    // 01-questions 
    var Ae = new Container;
    (() => {
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
        img: questionOrnament.q1
      }, Sprite, this.ze)

      for (var s = [], r = 0; r < 45; r++) {
        s.push(resources['q1_1'].textures["a_000" + (r < 10 ? "0" + r : r) + ".png"]);
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
        c.push(resources['q1_2'].textures["C_000" + (u < 10 ? "0" + u : u) + ".png"]);
      var m = new AnimatedSprite(c);
      m.position.set(-150, 30),
        m.animationSpeed = .3;
      for (var v = [], h = 0; h < 61; h++)
        v.push(resources['q1_2'].textures["D_000" + (h < 10 ? "0" + h : h) + ".png"]);
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
    })();
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
          img: questionOrnament.q3
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
            // a.position.set(e.x, e.y),
            // a.scale.set(o * t),
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
        // b.rotation = e.rotate
        // }).repeat(1 / 0),
        f.y = 500,
        f.addChild(b, y, w),
        f.gotoAndPlay = () => {
          f.visible = !0
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
          // y.x = -135 - 90 * e.x,
          // w.x = 96 + 110 * e.x
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
          X.visible = !0
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
          // S.x = 18 - 90 * e.x,
          // C.x = 124 + 110 * e.x
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
    // 04-questions
    var $e = new Container;
    (() => {
      Ve += Te.height - 550,
        $e.y = Ve,
        addSprite({
          box: $e,
          resource: things02,
          img: [{
            name: "04_title.png",
            x: 203,
            y: 420
          }, {
            name: "04_airplane.png",
            x: 564,
            y: 1413
          }]
        }, Sprite),
        addSpriteWithData({
          box: $e,
          resource: things02,
          img: questionOrnament.q4
        }, Sprite);
      for (var e = [], t = 0; t < 50; t++)
        e.push(resources['0405_leaf'].textures["4_leaf_000" + t + ".png"]);
      var a = new AnimatedSprite(e);
      a.animationSpeed = .3,
        a.position.set(571, 200),
        a.play(),
        $e.addChild(a);
      var W = 'q3_q4_person_1',
        z = 'q3_q4_person_0';
      for (var n = [], o = 0; o < 60; o++) {
        n.push(resources[o < 28 ? z : W].textures["a_000" + (o < 10 ? "0" + o : o) + ".png"]);
      }
      var i = Sprite.from(resources['q3_q4_person_1'].textures["q3_q4_tengman.png"]);
      i.visible = !1;
      var s = new AnimatedSprite(n);
      s.position.set(0, 0),
        s.animationSpeed = .3,
        s.onFrameChange = function () {
          this.currentFrame < 32 ? i.visible = !1 : i.visible = !0
        },
        s.y = -80,
        i.y = -80,
        $e.addChild(i, s),
        this.animateList.push({
          ani: s,
          startStamp: 4900,
          endStamp: 5602,
          endFrame: 59
        });
      var d = $e.questions = new Container;
      d.selected = !1,
        d.scrollY = 5880,
        d.position.set(249, 632);
      for (var r = (t) => {
          var a = new Container;
          a.active = !1;
          var G = 'q4_0',
            H = 'q4_1',
            ee = 'q4_2',
            te = 'q4_3';
          for (var e = [], n = 0; n < (1 == t ? 100 : 50); n++) {
            var o = void 0;
            o = 0 == t || 1 == t && n < 18 ? G : 1 == t && 18 <= n && n < 86 ? H : 1 == t && 86 <= n || 2 == t ? ee : te,
              e.push(resources[o].textures[(0 == t ? "A" : 1 == t ? "B" : 2 == t ? "C" : "D") + "_000" + (n < 10 ? "0" + n : n) + ".png"])
          }
          var i = a.ani = new AnimatedSprite(e);
          i.position.set(26, 28),
            i.animationSpeed = 1 == t ? .15 : .3,
            a.y = 170 * t;
          var s = a.chosen = Sprite.from(things02["04_" + t + "_chosen.png"]);
          s.visible = !1;
          var r = a.unchosen = Sprite.from(things02["04_" + t + "_unchosen.png"]);
          a.addChild(i, r, s),
            this.ut(a, () => {
              var e = a;
              1 != e.active && (this.mt(3, t),
                d.children.forEach(function (e, t) {
                  1 == e.active && (e.active = !1,
                    e.ani.stop(),
                    e.unchosen.visible = !0,
                    e.chosen.visible = !1)
                }),
                e.active = !0,
                e.ani.play(),
                e.unchosen.visible = !1,
                e.chosen.visible = !0)
            }),
            d.addChild(a)
        }, p = 0; p < 4; p++)
        r(p);
      $e.addChild(d),
        this.$e = $e,
        this.app.stage.addChild($e)
    })();
    // 05-questions
    var Ee = new Container;
    (() => {
      Ve += $e.height - 500,
        Ee.y = Ve;
      for (var e = [], t = 1; t < 83; t++)
        e.push(resources['q4_q5_person'].textures["a_001" + (t < 10 ? "0" + t : t) + ".png"]);
      var a = Sprite.from(resources['q4_q5_person'].textures["q4_q5_tengman.png"]);
      a.visible = !1;
      var n = new AnimatedSprite(e);
      n.position.set(0, 0),
        n.animationSpeed = .3,
        n.onFrameChange = function () {
          this.currentFrame < 31 ? a.visible = !1 : a.visible = !0
        },
        this.animateList.push({
          ani: n,
          startStamp: 6442,
          endStamp: 6900,
          endFrame: 81
        }),
        Ee.addChild(a, n);
      for (var o = [], i = 0; i < 47; i++)
        o.push(resources['0405_leaf'].textures["5_leaf_000" + i + ".png"]);
      var s = new AnimatedSprite(o);
      s.animationSpeed = .3,
        s.position.set(0, 975),
        s.play(),
        Ee.addChild(s),
        addSprite({
          box: Ee,
          resource: things02,
          img: [{
            name: "5_title.png",
            x: 257,
            y: 862
          }, {
            name: "cloud6.png",
            x: -56,
            y: 680
          }]
        }, Sprite),
        addSpriteWithData({
          box: Ee,
          resource: things02,
          img: questionOrnament.q5
        }, Sprite);
      var u = Ee.questions = new Container;
      u.selected = !1,
        u.scrollY = 7400,
        Ee.addChild(u),
        u.position.set(215, 1112);
      for (var m = [{
          x: 76,
          y: -301
        }, {
          x: 92,
          y: -83
        }, {
          x: -49,
          y: -87
        }, {
          x: 88,
          y: -81
        }], r = (e) => {
          var t = new Container;
          t.active = !1;
          var a = Sprite.from(things02["door.png"]);
          t.position.set(e % 2 * 250, 373 * parseInt(e / 2));
          var n = Sprite.from(things02["5_selection_" + e + ".png"]);
          n.position.set(193 - n.width - 10, 256);
          var o = t.letterBg = Sprite.from(things02["05_selection_bg.png"]);
          o.visible = !1,
            o.position.set(124, 224);
          var i = t.text = Sprite.from(things02["5_text_" + e + ".png"]);
          i.position.set(96 + (97 - i.width) / 2, 42);
          var s = [];
          var se = "q5_a_0",
            re = "q5_a_1",
            de = "q5_a_2",
            pe = "q5_b",
            le = "q6_0";
          if (0 == e)
            for (var r = 0; r < 100; r++)
              s.push(resources[r < 43 ? se : r < 88 ? re : de].textures["a_000" + r + ".png"]);
          else if (1 == e)
            for (var d = 0; d < 50; d++)
              s.push(resources[pe].textures["b_000" + d + ".png"]);
          else if (2 == e)
            for (var p = 0; p < 50; p++)
              s.push(resources[p < 40 ? pe : le].textures["c_000" + p + ".png"]);
          else
            for (var l = 0; l < 40; l++)
              s.push(resources[de].textures["d_000" + l + ".png"]);
          var c = t.ani = new AnimatedSprite(s);
          c.position.set(m[e].x, m[e].y),
            c.animationSpeed = .3,
            c.visible = !1,
            this.ut(t, () => {
              var a = t;
              1 != a.active && (this.mt(4, e),
                u.children.forEach(function (a, e) {
                  1 == a.active && (a.active = !1,
                    a.letterBg.visible = !1,
                    a.ani.stop(),
                    a.tween && a.tween.stop(),
                    // a.tween = new E.default.Tween({
                    //   alpha: 1
                    // }).to({
                    //   alpha: 0
                    // }, 500).onUpdate(function (e, t) {
                    //   a.ani.alpha = e.alpha,
                    //     a.text.alpha = 1 - e.alpha
                    // }).onComplete(function () {
                    a.ani.visible = !1
                    // }).start()
                  )
                }),
                a.active = !0,
                a.ani.visible = !0,
                a.letterBg.visible = !0,
                a.ani.gotoAndPlay(0),
                a.tween && a.tween.stop()
                // a.tween = new E.default.Tween({
                //   alpha: 0
                // }).to({
                //   alpha: 1
                // }, 500).onUpdate(function (e, t) {
                //   a.ani.alpha = e.alpha,
                //     a.text.alpha = 1 - e.alpha
                // }).start()
              )
            }),
            t.addChild(a, o, n, i, c),
            u.addChild(t)
        }, d = 0; d < 4; d++)
        r(d);
      this.Ee = Ee
      this.app.stage.addChild(Ee)
    })();
    // 06-questions
    var Ie = new Container();
    (() => {
      Ve += Ee.height - 250,
        Ie.y = Ve,
        addSprite({
          box: Ie,
          resource: things02,
          img: [{
            name: "06_star_1.png",
            x: 21,
            y: 335
          }, {
            name: "06_star_2.png",
            x: 22,
            y: 641
          }, {
            name: "moon.png",
            x: 28,
            y: 605
          }, {
            name: "06_title.png",
            x: 200,
            y: 977
          }, {
            name: "06_flower.png",
            x: 0,
            y: 1750
          }]
        }, Sprite),
        addSpriteWithData({
          box: Ie,
          resource: things02,
          img: questionOrnament.q6
        }, Sprite);
      var ue = '06_leaf',
        ne = 'q5_q6_0',
        oe = 'q5_q6_1',
        ie = 'q5_q6_2';
      for (var e = [], t = 0; t < 56; t++)
        e.push(resources[ue].textures["6_leaf_000" + t + ".png"]);
      var a = new AnimatedSprite(e);
      a.animationSpeed = .3,
        a.position.set(550, 620),
        a.play(),
        Ie.addChild(a);
      for (var n = [], o = 0; o < 61; o++)
        n.push(resources[o < 29 ? ne : o < 37 ? oe : ie].textures["a_000" + o + ".png"]);
      var i = Sprite.from(resources[ie].textures["q5_q6_tengman.png"]);
      i.visible = !1;
      var s = new AnimatedSprite(n);
      s.position.set(0, 0),
        s.animationSpeed = .3,
        s.onFrameChange = function () {
          this.currentFrame < 41 ? i.visible = !1 : i.visible = !0
        },
        this.animateList.push({
          ani: s,
          startStamp: 7943,
          endStamp: 8500,
          endFrame: 60
        }),
        Ie.addChild(i, s);
      var r = Ie.questions = new Container;
      r.selected = !1,
        r.scrollY = 9050,
        r.position.set(256, 1165);
      for (var d = [{
          x: 0,
          y: 0
        }, {
          x: 257,
          y: 118
        }, {
          x: 14,
          y: 397
        }, {
          x: 225,
          y: 520
        }], p = [{
          x: 70,
          y: 293
        }, {
          x: 44,
          y: 263
        }, {
          x: 48,
          y: 257
        }, {
          x: 69,
          y: 228
        }], l = (t) => {
          var a = new Container;
          a.active = !1;
          var le = "q6_0",
            ce = "q6_1";
          for (var e = [], n = 0; n < 40; n++)
            e.push(resources[t < 2 ? le : ce].textures[(0 == t ? "a" : 1 == t ? "b" : 2 == t ? "c" : "d") + "_000" + n + ".png"]);
          var o = a.ani = new AnimatedSprite(e);
          o.animationSpeed = .3,
            o.loop = !1;
          var i = Sprite.from(things02["5_selection_" + t + ".png"]);
          i.position.set(p[t].x, p[t].y);
          var s = a.letterBg = Sprite.from(things02["06_selection_bg.png"]);
          s.position.set(p[t].x - 24, p[t].y - 17),
            s.visible = !1,
            a.addChild(o, s, i),
            this.ut(a, () => {
              var e = a;
              1 != e.active && (this.mt(5, t),
                r.children.forEach(function (e, t) {
                  1 == e.active && (e.active = !1,
                    e.ani.gotoAndStop(0),
                    e.letterBg.visible = !1)
                }),
                e.active = !0,
                e.ani.play(),
                e.letterBg.visible = !0)
            }),
            a.position.set(d[t].x, d[t].y),
            r.addChild(a)
        }, c = 0; c < 4; c++)
        l(c);
      Ie.addChild(r),
        this.Ie = Ie,
        this.app.stage.addChild(Ie)
    })();
    (function () {
      for (var o = [Ae, Me, Te, $e, Ee, Ie], i = [{
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
        4200 < i && i <= 6e3 ? this.Te.smoke.alpha = Math.max((4500 - i) / 300, 0) : 2e3 < i && i <= 4200 && (this.Te.smoke.alpha = 1);
      
      
        this.ze.forEach(function (e, t) {
          if (e.data)
            for (var a = 0; a < e.data.length; a++) {
              var n = e.data[a];
              if (n.pause)
                break;
              var o = (i - n.startStamp) / (n.endStamp - n.startStamp);
              i < n.startStamp ? 0 == a && (n.start.x && (e.position.x = e.pivot.x + n.start.x),
                n.start.y && (e.position.y = e.pivot.y + n.start.y),
                n.start.rotation && (e.rotation = n.start.rotation),
                n.start.alpha && (e.alpha = n.start.alpha),
                n.start.scale && e.scale.set(n.start.scale),
                n.start.scale3d && e.scale3d.set(n.start.scale3d),
                n.start.hidden && (e.visible = !1),
                e.withScroll && e.gotoAndStop(0),
                e.isAuto && (e.gotoAndPlay(0),
                  e.stopped = !1)) : i >= n.startStamp && i <= n.endStamp ? (n.start.x && (e.position.x = e.pivot.x + n.start.x + o * (n.end.x - n.start.x)),
                n.start.y && (e.position.y = e.pivot.y + n.start.y + o * (n.end.y - n.start.y)),
                n.start.rotation && (e.rotation = n.start.rotation + o * (n.end.rotation - n.start.rotation)),
                n.start.alpha && (e.alpha = n.start.alpha + o * (n.end.alpha - n.start.alpha)),
                n.start.scale && e.scale.set(n.start.scale + o * (n.end.scale - n.start.scale)),
                n.start.scale3d && e.scale3d.set(n.start.scale3d + o * (n.end.scale3d - n.start.scale3d)),
                e.withScroll && e.gotoAndStop(o * (e.totalFrames - 1)),
                e.isAuto && 1 == e.stopped && (e.gotoAndPlay(0),
                  e.stopped = !1),
                n.start.hidden && (e.visible = !0),
                n.end.hidden && (e.visible = !0)) : a == e.data.length - 1 && (n.start.x && (e.position.x = e.pivot.x + n.end.x),
                n.start.y && (e.position.y = e.pivot.y + n.end.y),
                n.start.rotation && (e.rotation = n.end.rotation),
                n.start.alpha && (e.alpha = n.end.alpha),
                n.start.scale && e.scale.set(n.end.scale),
                n.start.scale3d && e.scale3d.set(n.end.scale3d),
                n.end.hidden && (e.visible = !1),
                e.withScroll && e.gotoAndStop(e.totalFrames - 1),
                e.isAuto && (e.gotoAndStop(0),
                  e.stopped = !0))
            }
        })
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
    let De = [this.Ae.questions, this.Me.questions, this.Te.questions, this.$e.questions, this.Ee.questions, this.Ie.questions];
    De[e].selected = !0,
      De[e].selectIndex = t,
      De[e].parent.notSelect.stop()
    // _t.remove(De[e]),
    // ht()
  }
  setScale() {
    this.sprites.firstContainer.pivot.set(60, 0)
    this.sprites.firstContainer.x = 305
    this.sprites.firstContainer.scale.set(1 - (1334 - this.height) / 1e3)
    this.sprites.firstAnimate.position.set(272, this.height - 225)
  }
}

new LongPoem({});