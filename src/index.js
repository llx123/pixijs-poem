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
    this.frameList = [];
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
        if (Array.isArray(item.nameList)) { // addSprite
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
          let n = i < 10 && item.addZero ? `0${i}` : i
          i < boundary ?
            arr.push(resources[item.filename].textures[`${item.texture}${n}.png`]) :
            arr.push(resources[item.filenameBoundary].textures[`${item.textureBoundary}${n}.png`]);
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
      } else if (type === 'frameList') { // addSpriteWithData
        for (let index = 0; index < item.imgList.length; index++) {
          let img = item.imgList,
            resource = resources[item.filename].textures;
          let i = this.sprites[parent][img[index].name] = Sprite.from(resource[img[index].name]);
          if (i.data = img[index].data,
            i.position.set(img[index].x, img[index].y),
            img[index].pivot) {
            let s = img[index];
            i.pivot.set(s.pivot.x, s.pivot.y),
              i.position = {
                x: s.x + s.pivot.x,
                y: s.y + s.pivot.y
              }
          }
          this.sprites[parent].addChild(i);
          this.frameList.push(i)
        }
      }
      if (sprite) {
        id && (this.sprites[id] = sprite);
        item.prop && setSpriteProp(sprite, item.prop);
        parent && this.sprites[parent].addChild(sprite);
      }
    })

    // 01-questions 
    var Question1 = this.sprites['question1'];
    (() => {
      this.sprites['q1b'].play = function () {
        console.log('play');
      }
      this.sprites['q1b'].stop = function () {
        console.log('stop');
      }

      var y = Question1.questions = new Container;
      y.scrollY = 1450,
        y.selected = false,
        y.addChild(this.sprites['q1kuo']),
        y.position.set(263, 490);

      for (var w = [this.sprites['q1a'], this.sprites['q1b'], this.sprites['q1c'], this.sprites['q1d']], b = (n) => {
          var o = new Container;
          o.select = false,
            o.y = 210 * n,
            o.addChild(w[n]),
            w[n].visible = false,
            o.ani = w[n];
          var e = o.textBg = Sprite.from(things02["01_text_bg.png"]);
          e.x = -5,
            e.visible = false;
          var t = o.text = Sprite.from(things02["01_t" + (n + 1) + ".png"]);
          if (3 == n) {
            var a = o.flower = Sprite.from(things02["01_3_flower.png"]);
            a.visible = false,
              a.position.set(-112, -73),
              o.addChild(a)
          }
          this.eachSelect(t, () => {
              var e = o;
              if (1 != e.active)
                if (this.doSelect(0, n),
                  y.children.forEach(function (e, t) {
                    1 == e.active && (e.active = false,
                      e.ani.stop(),
                      e.ani.visible = false,
                      e.textBg.visible = false,
                      4 == t && (e.flower.visible = false))
                  }),
                  e.active = true,
                  e.ani.play(),
                  e.ani.visible = true,
                  e.textBg.visible = true,
                  3 == n && (e.flower.visible = true),
                  0 == this.sprites['01_left_kuo'].visible)
                  this.sprites['01_left_kuo'].visible = true,
                  this.sprites['01_right_kuo'].visible = true,

                  this.sprites['01_left_kuo'].y = 210 * n - 20,
                  this.sprites['01_right_kuo'].y = 210 * n - 20,
                  this.sprites['01_right_kuo'].x = 0 == n ? 429 : 340;
                else {
                  var t, a = 210 * n - 20;
                  t = 0 == n ? 429 : 340,
                    this.sprites['01_left_kuo'].y = e.y,
                    this.sprites['01_right_kuo'].y = e.y
                }
            }),
            o.addChild(e, t),
            y.addChild(o)
        }, X = 0; X < 4; X++) {
        b(X);
      }
      this.Question1 = Question1;
      Question1.addChild(y)
    })();
    // 02-questions
    var Question2 = this.sprites['question2'],
      Ve = this.height;
    (() => {
      Ve += Question1.height - 100,
        Question2.y = Ve,
        Question2.addChild(this.sprites['q2a'], this.sprites['q2b']);

      var y = "q1_q2_person_0",
        w = "q1_q2_person_1",
        b = "q1_q2_person_2";

      for (var s = [], r = 0; r < 45; r++) {
        s.push(resources[r < 24 ? y : r < 31 ? w : b].textures["a_000" + r + ".png"]);
      }
      var d = Sprite.from(resources['q1_q2_person_2'].textures["q1_q2_tengman.png"]);
      d.visible = false;
      var p = new AnimatedSprite(s);
      p.position.set(0, 0),
        p.animationSpeed = .3,
        p.onFrameChange = function () {
          this.currentFrame < 35 ? d.visible = false : d.visible = true
        },
        p.y = -200,
        d.y = -200,
        Question2.addChild(d, p),
        this.animateList.push({
          ani: p,
          startStamp: 2048,
          endStamp: 2959,
          endFrame: 44
        });
      var l = Question2.questions = new Container;
      l.selected = false,
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
          a.active = false;
          for (var e = [], n = 0; n < (0 == t ? 25 : 1 == t ? 48 : 2 == t ? 25 : 63); n++)
            e.push(resources['q2_0_1'].textures[(0 == t ? "a" : 1 == t ? "b" : 2 == t ? "c" : "d") + "_000" + n + ".png"]);
          var o = a.ani = new AnimatedSprite(e);
          o.animationSpeed = .3,
            o.position.set(m[t].x, m[t].y);
          var i = a.letterBg = Sprite.from(things02["02_selection_bg.png"]);
          i.position.set(u[t].x, u[t].y),
            i.visible = false;
          var s = a.text = Sprite.from(things02["02_text_" + t + ".png"]);
          a.addChild(i, s, o),
            this.eachSelect(a, () => {
              var e = a;
              1 != e.active && (this.doSelect(1, t),
                l.children.forEach(function (e, t) {
                  1 == e.active && (e.active = false,
                    e.ani.gotoAndStop(0),
                    e.letterBg.visible = false)
                }),
                e.active = true,
                e.ani.play(),
                e.letterBg.visible = true)
            }),
            a.position.set(c[t].x, c[t].y),
            l.addChild(a)
        }, h = 0; h < 4; h++)
        v(h);
      Question2.addChild(l);
      this.Question2 = Question2
    })();
    // 03-questions
    var Question3 = this.sprites['question3'];
    (() => {
      Ve += Question2.height - 200,
        Question3.y = Ve;
      for (var p = [], l = 0; l < 54; l++)
        p.push(resources['q2_q3'].textures["q2_q3_000" + l + ".png"]);
      var c = Sprite.from(resources['q2_q3'].textures["q2_q3_tengman.png"]);
      c.visible = false;
      var u = new AnimatedSprite(p);
      u.position.set(0, 0),
        u.animationSpeed = .3,
        u.onFrameChange = function () {
          this.currentFrame < 37 ? c.visible = false : c.visible = true
        },
        u.position.set(492, -250),
        c.position.set(492, -250),
        Question3.addChild(c, u),
        this.animateList.push({
          ani: u,
          startStamp: 3652,
          endStamp: 4282,
          endFrame: 53
        });
      var m = Question3.questions = new Container;
      m.selected = false,
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
            v.removeChild(a)
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
        _.visible = false,
        _.animationSpeed = .3,
        _.loop = false;
      var f = new Container;
      f.visible = false;
      var y = Sprite.from(things02["q3_cloud1.png"]);
      y.position.set(-135, 10);
      var w = Sprite.from(things02["q3_cloud2.png"]);
      w.position.set(96, 32);
      var b = Sprite.from(things02["q3_sun.png"]);
      b.pivot.set(72, 71),
        b.position.set(124, 71),
        f.y = 500,
        f.addChild(b, y, w),
        f.gotoAndPlay = () => {
          f.visible = true
        },
        f.stop = function () {
          f.visible = false
        };
      var X = new Container;
      X.visible = false;
      var S = Sprite.from(things02["q3_cloud3.png"]);
      S.position.set(18, 146);
      var C = Sprite.from(things02["q3_cloud4.png"]);
      C.position.set(124, 48);
      var q = Sprite.from(things02["q3_moon.png"]);
      q.position.set(44, 0),
        X.y = 500,
        X.addChild(q, S, C),
        X.gotoAndPlay = () => {
          X.visible = true
        },
        X.stop = function () {
          X.visible = false
        };
      for (var j = (t) => {
          var a = new Container;
          a.active = false,
            a.x = t % 2 * 230,
            a.y = 310 * parseInt(t / 2);
          var e = a.text = Sprite.from(things02["03_" + t + ".png"]),
            n = a.chosen_bg = Sprite.from(things02["03_selection_bg.png"]);
          n.visible = false,
            n.position.set(-18, 69),
            0 == t ? a.ani = _ : 1 == t ? (a.addChild(v),
              a.ani = v) : 2 == t ? a.ani = X : 3 == t && (a.ani = f),
            a.addChild(n, e),
            this.eachSelect(a, () => {
              var e = a;
              1 != e.active && (this.doSelect(2, t),
                m.children.forEach(function (e, t) {
                  1 == e.active && (e.active = false,
                    e.ani.stop(),
                    e.ani.visible = false,
                    e.chosen_bg.visible = false)
                }),
                e.active = true,
                e.ani.visible = true,
                e.ani.gotoAndPlay(0),
                e.chosen_bg.visible = true)
            }),
            m.addChild(a)
        }, A = 0; A < 4; A++)
        j(A);
      Question3.addChild(m, _, f, X);
      var M = Question3.smoke = Sprite.from(resources['q3_a2'].textures["q3_smoke.png"]);
      M.position.set(0, 438),
        Question3.addChild(M),
        this.Question3 = Question3
    })();
    // 04-questions
    var Question4 = this.sprites['question4'];
    (() => {
      Ve += Question3.height - 550,
        Question4.y = Ve;

      var W = 'q3_q4_person_1',
        z = 'q3_q4_person_0';
      for (var n = [], o = 0; o < 60; o++) {
        n.push(resources[o < 28 ? z : W].textures["a_000" + (o < 10 ? "0" + o : o) + ".png"]);
      }
      var i = Sprite.from(resources['q3_q4_person_1'].textures["q3_q4_tengman.png"]);
      i.visible = false;
      var s = new AnimatedSprite(n);
      s.position.set(0, 0),
        s.animationSpeed = .3,
        s.onFrameChange = function () {
          this.currentFrame < 32 ? i.visible = false : i.visible = true
        },
        s.y = -80,
        i.y = -80,
        Question4.addChild(i, s),
        this.animateList.push({
          ani: s,
          startStamp: 4900,
          endStamp: 5602,
          endFrame: 59
        });
      var d = Question4.questions = new Container;
      d.selected = false,
        d.scrollY = 5880,
        d.position.set(249, 632);
      for (var r = (t) => {
          var a = new Container;
          a.active = false;
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
          s.visible = false;
          var r = a.unchosen = Sprite.from(things02["04_" + t + "_unchosen.png"]);
          a.addChild(i, r, s),
            this.eachSelect(a, () => {
              var e = a;
              1 != e.active && (this.doSelect(3, t),
                d.children.forEach(function (e, t) {
                  1 == e.active && (e.active = false,
                    e.ani.stop(),
                    e.unchosen.visible = true,
                    e.chosen.visible = false)
                }),
                e.active = true,
                e.ani.play(),
                e.unchosen.visible = false,
                e.chosen.visible = true)
            }),
            d.addChild(a)
        }, p = 0; p < 4; p++)
        r(p);
      Question4.addChild(d),
        this.Question4 = Question4
    })();
    // 05-questions
    var Ee = this.sprites['question5'];;
    (() => {
      Ve += Question4.height - 500,
        Ee.y = Ve;
      for (var e = [], t = 1; t < 83; t++)
        e.push(resources['q4_q5_person'].textures["a_001" + (t < 10 ? "0" + t : t) + ".png"]);
      var a = Sprite.from(resources['q4_q5_person'].textures["q4_q5_tengman.png"]);
      a.visible = false;
      var n = new AnimatedSprite(e);
      n.position.set(0, 0),
        n.animationSpeed = .3,
        n.onFrameChange = function () {
          this.currentFrame < 31 ? a.visible = false : a.visible = true
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
        Ee.addChild(s)
      var u = Ee.questions = new Container;
      u.selected = false,
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
          t.active = false;
          var a = Sprite.from(things02["door.png"]);
          t.position.set(e % 2 * 250, 373 * parseInt(e / 2));
          var n = Sprite.from(things02["5_selection_" + e + ".png"]);
          n.position.set(193 - n.width - 10, 256);
          var o = t.letterBg = Sprite.from(things02["05_selection_bg.png"]);
          o.visible = false,
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
            c.visible = false,
            this.eachSelect(t, () => {
              var a = t;
              1 != a.active && (this.doSelect(4, e),
                u.children.forEach(function (a, e) {
                  1 == a.active && (a.active = false,
                    a.letterBg.visible = false,
                    a.ani.stop(),
                    a.tween && a.tween.stop(),
                    a.ani.visible = false
                  )
                }),
                a.active = true,
                a.ani.visible = true,
                a.letterBg.visible = true,
                a.ani.gotoAndPlay(0),
                a.tween && a.tween.stop()
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
    var Question6 = this.sprites['question6'];
    (() => {
      Ve += Ee.height - 250,
        Question6.y = Ve;
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
        Question6.addChild(a);
      for (var n = [], o = 0; o < 61; o++)
        n.push(resources[o < 29 ? ne : o < 37 ? oe : ie].textures["a_000" + o + ".png"]);
      var i = Sprite.from(resources[ie].textures["q5_q6_tengman.png"]);
      i.visible = false;
      var s = new AnimatedSprite(n);
      s.position.set(0, 0),
        s.animationSpeed = .3,
        s.onFrameChange = function () {
          this.currentFrame < 41 ? i.visible = false : i.visible = true
        },
        this.animateList.push({
          ani: s,
          startStamp: 7943,
          endStamp: 8500,
          endFrame: 60
        }),
        Question6.addChild(i, s);
      var r = Question6.questions = new Container;
      r.selected = false,
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
          a.active = false;
          var le = "q6_0",
            ce = "q6_1";
          for (var e = [], n = 0; n < 40; n++)
            e.push(resources[t < 2 ? le : ce].textures[(0 == t ? "a" : 1 == t ? "b" : 2 == t ? "c" : "d") + "_000" + n + ".png"]);
          var o = a.ani = new AnimatedSprite(e);
          o.animationSpeed = .3,
            o.loop = false;
          var i = Sprite.from(things02["5_selection_" + t + ".png"]);
          i.position.set(p[t].x, p[t].y);
          var s = a.letterBg = Sprite.from(things02["06_selection_bg.png"]);
          s.position.set(p[t].x - 24, p[t].y - 17),
            s.visible = false,
            a.addChild(o, s, i),
            this.eachSelect(a, () => {
              var e = a;
              1 != e.active && (this.doSelect(5, t),
                r.children.forEach(function (e, t) {
                  1 == e.active && (e.active = false,
                    e.ani.gotoAndStop(0),
                    e.letterBg.visible = false)
                }),
                e.active = true,
                e.ani.play(),
                e.letterBg.visible = true)
            }),
            a.position.set(d[t].x, d[t].y),
            r.addChild(a)
        }, c = 0; c < 4; c++)
        l(c);
      Question6.addChild(r),
        this.Question6 = Question6,
        this.app.stage.addChild(Question6)
    })();
    (function () {
      for (var o = [Question1, Question2, Question3, Question4, Ee, Question6], i = [{
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
          t.visible = false;
          var a = Sprite.from(things02["not_icon.png"]),
            n = Sprite.from(things02["not_text.png"]);
          n.position.set(28, 1),
            t.addChild(a, n),
            t.position.set(i[e].x, i[e].y),
            t.play = function () {
              t.visible = true,
                console.log('start');
            },
            t.stop = function () {
              t.visible = false,
                console.log('stop');
            },
            o[e].addChild(t)
        }, t = 0; t < o.length; t++)
        e(t);
      var Ne = new Container;
      var a = Ne.nameNotice = new Container;
      a.visible = false;
      var n = Sprite.from(things02["not_icon.png"]),
        s = Sprite.from(things02["no_name.png"]);
      s.position.set(28, 1);
      var r = Sprite.from(things02["long_name.png"]);
      r.position.set(28, 1);
      var d = Sprite.from(things02["wrong_name.png"]);
      d.position.set(28, 1),
        s.visible = d.visible = r.visible = false,
        a.addChild(n, s, d, r),
        a.position.set(99, 671),
        a.play = function (e) {
          a.visible = true,
            "no_name" === e && (s.visible = true),
            "long_name" === e && (r.visible = true),
            "wrong_name" === e && (d.visible = true)
        },
        a.stop = function () {
          a.visible = false,
            s.visible = d.visible = r.visible = false,
            console.log('stop');
        },
        Ne.addChild(a);
      var p = Ne.sexNotice = new Container;
      p.visible = false;
      var l = Sprite.from(things02["not_icon.png"]),
        c = Sprite.from(things02["no_sex.png"]);
      c.position.set(28, 1),
        p.addChild(l, c),
        p.position.set(99, 1e3),
        p.play = function () {
          p.visible = true,
            p.tween.start()
        },
        p.stop = function () {
          p.visible = false,
            p.tween.stop()
        },
        Ne.addChild(p)
    })()
    // 结束
    this.height < 1334 && this.setScale();
    this.lineProp = renderLine(Container, things02, this.app.stage, Sprite, this.height);

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
        4200 < i && i <= 6e3 ? this.Question3.smoke.alpha = Math.max((4500 - i) / 300, 0) : 2e3 < i && i <= 4200 && (this.Question3.smoke.alpha = 1);


        this.frameList.forEach(function (e, t) {
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
                n.start.hidden && (e.visible = false),
                e.withScroll && e.gotoAndStop(0),
                e.isAuto && (e.gotoAndPlay(0),
                  e.stopped = false)) : i >= n.startStamp && i <= n.endStamp ? (n.start.x && (e.position.x = e.pivot.x + n.start.x + o * (n.end.x - n.start.x)),
                n.start.y && (e.position.y = e.pivot.y + n.start.y + o * (n.end.y - n.start.y)),
                n.start.rotation && (e.rotation = n.start.rotation + o * (n.end.rotation - n.start.rotation)),
                n.start.alpha && (e.alpha = n.start.alpha + o * (n.end.alpha - n.start.alpha)),
                n.start.scale && e.scale.set(n.start.scale + o * (n.end.scale - n.start.scale)),
                n.start.scale3d && e.scale3d.set(n.start.scale3d + o * (n.end.scale3d - n.start.scale3d)),
                e.withScroll && e.gotoAndStop(o * (e.totalFrames - 1)),
                e.isAuto && 1 == e.stopped && (e.gotoAndPlay(0),
                  e.stopped = false),
                n.start.hidden && (e.visible = true),
                n.end.hidden && (e.visible = true)) : a == e.data.length - 1 && (n.start.x && (e.position.x = e.pivot.x + n.end.x),
                n.start.y && (e.position.y = e.pivot.y + n.end.y),
                n.start.rotation && (e.rotation = n.end.rotation),
                n.start.alpha && (e.alpha = n.end.alpha),
                n.start.scale && e.scale.set(n.end.scale),
                n.start.scale3d && e.scale3d.set(n.end.scale3d),
                n.end.hidden && (e.visible = false),
                e.withScroll && e.gotoAndStop(e.totalFrames - 1),
                e.isAuto && (e.gotoAndStop(0),
                  e.stopped = true))
            }
        })
      }
    })
  }
  questionStep(t) {
    if (this.scrollStep = t,
      this.lineProp.labels.children.forEach(function (a, e) {
        1 == a.active && e !== t && (a.active = false,
          a.bigNum.visible = false,
          a.smallNum.visible = true
        )
      }),
      -1 != t) {
      var a = this.lineProp.labels.children[t];
      1 != a.active && (a.smallNum.visible = false,
        a.bigNum.visible = true,
        a.active = true
      )
    }
  }
  eachSelect(a, t) {
    a.interactive = true,
      a.buttonMode = true,
      a.on("touchstart", function (e) {
        var t = e.data.originalEvent;
        a.startY = t.touches[0].pageY,
          a.touch = true,
          a.yValue = 0
      }).on("touchmove", function (e) {
        if (a.touch) {
          var t = e.data.originalEvent;
          a.yValue = Math.abs(t.touches[0].pageY - a.startY)
        }
      }).on("touchend", function (e) {
        a.touch && (30 < a.yValue || (
          t()))
      })
  }
  doSelect(e, t) {
    let De = [this.Question1.questions, this.Question2.questions, this.Question3.questions, this.Question4.questions, this.Ee.questions, this.Question6.questions];
    De[e].selected = true,
      De[e].selectIndex = t,
      De[e].parent.notSelect.stop()
  }
  setScale() {
    this.sprites.firstContainer.pivot.set(60, 0)
    this.sprites.firstContainer.x = 305
    this.sprites.firstContainer.scale.set(1 - (1334 - this.height) / 1e3)
    this.sprites.firstAnimate.position.set(272, this.height - 225)
  }
}

new LongPoem({});