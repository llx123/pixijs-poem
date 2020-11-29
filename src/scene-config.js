import {
  renderBg,
  renderDot
} from './util-render-func';
import {
  personFrameChange
} from './frame-change'

let height = window.innerHeight;

export const sceneList = [{
    id: 'firstScene',
    parent: 'stage',
    type: 'container'
  },
  {
    type: 'callback', // 背景图
    parent: 'firstScene',
    render: renderBg
  },
  {
    parent: 'firstScene',
    type: 'sprite',
    filename: 'things_02',
    name: 'first_tree.png'
  },
  {
    parent: 'firstScene',
    type: 'sprite',
    filename: 'things_02',
    name: 'people2.png',
    prop: {
      y: 450
    }
  },
  {
    id: 'firstContainer', // 第一屏中间部分
    parent: 'firstScene',
    type: 'container',
    prop: {
      x: 245,
      y: 222
    }
  },
  {
    parent: 'firstContainer',
    type: 'sprite',
    filename: 'things_02',
    name: 'first_title.png',
    prop: {
      y: 54
    }
  },
  {
    parent: 'firstContainer',
    type: 'sprite',
    filename: 'things_02',
    name: 'first_logo.png'
  },
  {
    parent: 'firstContainer',
    type: 'sprite',
    filename: 'things_02',
    name: 'first_text.png',
    prop: {
      y: 594
    }
  },
  {
    id: 'dots',
    parent: 'firstContainer',
    type: 'container',
    prop: {
      x: 180,
      y: 395
    }
  },
  {
    type: 'callback',
    parent: 'dots',
    render: renderDot
  },
  {
    id: 'firstAnimate',
    parent: 'firstScene',
    type: 'container',
    prop: {
      x: 272,
      y: height - 285
    }
  },
  {
    parent: 'firstAnimate',
    type: 'sprite',
    filename: 'things_02',
    name: 'slide_icon.png',
    prop: {
      x: 80
    },
    to: {
      y: -30,
      yoyo: true,
      yoyoEase: true,
      repeat: -1
    }
  },
  {
    parent: 'firstAnimate',
    type: 'sprite',
    filename: 'things_02',
    name: 'slide_text.png',
    prop: {
      y: 64
    }
  },
  {
    parent: 'firstScene',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "first_grass.png",
      prop: {
        x: 667,
        y: 1006
      }
    }, {
      name: "music.png",
      prop: {
        x: 557,
        y: height - 120
      }
    }]
  },
  {
    parent: 'firstScene',
    type: 'animate',
    filename: 'first_person',
    range: [0, 76],
    autoPlay: true,
    texture: 'a_000',
    speed: .4,
    prop: {
      x: 420,
      y: 58
    }
  },
  {
    parent: 'firstScene',
    type: 'animate',
    filename: 'tengman01',
    filenameBoundary: 'tengman02',
    range: [0, 60],
    boundary: 30,
    autoPlay: true,
    texture: 'tengman_000',
    textureBoundary: 'tengman_000',
    speed: .4
  },
  {
    id: 'newAnimPerson1',
    parent: 'firstScene',
    type: 'frame',
    arrName: 'qPerson',
    filename: 'q1_person_0',
    animateList: 'animateList',
    filenameBoundary: 'q1_person_1',
    texture: 'a_000',
    textureBoundary: 'a_000',
    range: [5, 72],
    boundary: 40,
    addZero: true,
    frame: {
      startStamp: 475,
      endStamp: 1214,
      endFrame: 66
    },
    prop: {
      y: 490
    },
    onFrameChange: personFrameChange
  },
  {
    parent: 'firstScene',
    type: 'sprite',
    filename: 'q1_2',
    nameList: [{
      id: 'animateStep1',
      name: "q1_tengman_0.png",
      prop: {
        y: 490,
        visible: false
      }
    }, {
      id: 'animateStep2',
      name: "q1_tengman_1.png",
      prop: {
        y: 490,
        visible: false
      }
    }]
  }
]