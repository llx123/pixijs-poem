import {
  renderBg,
  renderDot
} from './util-render-func'
import {
  personFrameChange
} from './frame-change';
import {
  questionOrnament
} from './question-ornament';

const height = window.innerHeight;

const firstScene = [{
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

const questionScene = [{
    parent: 'stage',
    id: 'question1',
    type: 'container',
    prop: {
      y: height
    }
  },
  {
    parent: 'question1',
    type: 'animate',
    filename: '01_leaf1',
    range: [0, 57],
    addZero: true,
    autoPlay: true,
    texture: '2_000',
    speed: .3,
    prop: {
      x: 515
    }
  },
  {
    parent: 'question1',
    type: 'animate',
    filename: '01_leaf2',
    range: [0, 47],
    addZero: true,
    autoPlay: true,
    texture: 'a_000',
    speed: .28,
    prop: {
      y: 409
    }
  },
  {
    parent: 'question1',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "01_title.png",
      prop: {
        x: 236,
        y: 317
      }
    }, {
      name: "01_right_leaf.png",
      prop: {
        x: 675,
        y: 154
      }
    }, {
      name: "01_flower.png",
      prop: {
        x: 461,
        y: 1210
      }
    }]
  },
  {
    parent: 'question1',
    type: 'frameList',
    filename: 'things_02',
    imgList: questionOrnament.q1
  },
  {
    id: 'q1a',
    type: 'animate',
    filename: 'q1_1',
    range: [0, 45],
    addZero: true,
    autoPlay: true,
    texture: 'a_000',
    prop: {
      x: -70,
      y: -65,
      visible: false
    },
    speed: .3
  },
  {
    id: 'q1b',
    type: 'container'
  },
  {
    id: 'q1c',
    type: 'animate',
    filename: 'q1_2',
    range: [0, 60],
    addZero: true,
    autoPlay: true,
    texture: 'C_000',
    prop: {
      x: -150,
      y: 30,
      visible: false
    },
    speed: .3
  },
  {
    id: 'q1d',
    type: 'animate',
    filename: 'q1_2',
    range: [0, 61],
    addZero: true,
    autoPlay: true,
    texture: 'D_000',
    prop: {
      x: 280,
      y: -120,
      visible: false
    },
    speed: .3
  },
  {
    id: 'q1kuo',
    type: 'container',
  },
  {
    id: '01_left_kuo',
    parent: 'q1kuo',
    type: 'sprite',
    filename: 'things_02',
    name: '01_left_kuo.png',
    prop: {
      x: -50,
      visible: false
    }
  },
  {
    id: '01_right_kuo',
    parent: 'q1kuo',
    type: 'sprite',
    filename: 'things_02',
    name: '01_right_kuo.png',
    prop: {
      visible: false
    }
  },
  {
    parent: 'stage',
    id: 'question2',
    type: 'container'
  },
  {
    id: 'q2a',
    type: 'animate',
    filename: 'q2_leaf',
    range: [0, 50],
    autoPlay: true,
    texture: 'leaf1_000',
    prop: {
      y: -60
    },
    speed: .3
  },
  {
    id: 'q2b',
    type: 'animate',
    filename: 'q2_leaf',
    range: [0, 50],
    autoPlay: true,
    texture: 'leaf2_000',
    prop: {
      y: 440
    },
    speed: .3
  },
  {
    parent: 'question2',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "02_title.png",
      prop: {
        x: 237,
        y: 436
      }
    }, {
      name: "02_flower_1.png",
      prop: {
        x: 460,
        y: 4
      }
    }, {
      name: "02_flower_2.png",
      prop: {
        x: 323,
        y: 81
      }
    }, {
      name: "02_flower_3.png",
      prop: {
        x: 309,
        y: 162
      }
    }, {
      name: "02_flower_4.png",
      prop: {
        x: 178,
        y: 200
      }
    }, {
      name: "02_flower_5.png",
      prop: {
        x: 579,
        y: 416
      }
    }]
  },
  {
    id: 'q2qingting',
    parent: 'question2',
    type: 'animate',
    filename: 'q2_0_1',
    range: [0, 54],
    autoPlay: true,
    texture: 'qingting_000',
    prop: {
      x: 170,
      y: 1250
    },
    speed: .3
  },
  {
    parent: 'stage',
    id: 'question3',
    type: 'container'
  },
  {
    parent: 'question3',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "03_title.png",
      prop: {
        x: 214,
        y: 674
      }
    }, {
      name: "03_branch.png",
      prop: {
        x: 0,
        y: 176
      }
    }, {
      name: "03_leaf_2.png",
      prop: {
        x: 20,
        y: 1295
      }
    }]
  },
  {
    parent: 'question3',
    type: 'frameList',
    filename: 'things_02',
    imgList: questionOrnament.q3
  },
  {
    id: 'q3a',
    parent: 'question3',
    type: 'animate',
    filename: 'q3_leaf1',
    range: [0, 50],
    autoPlay: true,
    texture: 'q3_leaf1_000',
    prop: {
      x: 604,
      y: 17
    },
    speed: .3
  },
  {
    id: 'q3b',
    parent: 'question3',
    type: 'animate',
    filename: 'q3_leaf2',
    range: [0, 48],
    autoPlay: true,
    texture: 'q3_leaf2_000',
    prop: {
      x: 0,
      y: 92
    },
    speed: .3
  },
  {
    id: 'q3c',
    parent: 'question3',
    type: 'animate',
    filename: 'q3_leaf1',
    range: [0, 50],
    autoPlay: true,
    texture: 'q3_flower_000',
    prop: {
      x: 522,
      y: 380
    },
    speed: .3
  },
  {
    parent: 'stage',
    id: 'question4',
    type: 'container'
  },
  {
    parent: 'question4',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "04_title.png",
      prop: {
        x: 203,
        y: 420
      }
    }, {
      name: "04_airplane.png",
      prop: {
        x: 564,
        y: 1413
      }
    }]
  },
  {
    parent: 'question4',
    type: 'frameList',
    filename: 'things_02',
    imgList: questionOrnament.q4
  },
  {
    id: 'q4a',
    parent: 'question4',
    type: 'animate',
    filename: '0405_leaf',
    range: [0, 50],
    autoPlay: true,
    texture: '4_leaf_000',
    prop: {
      x: 571,
      y: 200
    },
    speed: .3
  },
  {
    parent: 'stage',
    id: 'question5',
    type: 'container'
  },
  {
    parent: 'question5',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "5_title.png",
      prop: {
        x: 257,
        y: 862
      }
    }, {
      name: "cloud6.png",
      prop: {
        x: -56,
        y: 680
      }
    }]
  },
  {
    parent: 'question5',
    type: 'frameList',
    filename: 'things_02',
    imgList: questionOrnament.q5
  },
  {
    parent: 'stage',
    id: 'question6',
    type: 'container'
  },
  {
    parent: 'question6',
    type: 'sprite',
    filename: 'things_02',
    nameList: [{
      name: "06_star_1.png",
      prop: {
        x: 21,
        y: 335
      }
    }, {
      name: "06_star_2.png",
      prop: {
        x: 22,
        y: 641
      }
    }, {
      name: "moon.png",
      prop: {
        x: 28,
        y: 605
      }
    }, {
      name: "06_title.png",
      prop: {
        x: 200,
        y: 977
      }
    }, {
      name: "06_flower.png",
      prop: {
        x: 0,
        y: 1750
      }
    }]
  },
  {
    parent: 'question6',
    type: 'frameList',
    filename: 'things_02',
    imgList: questionOrnament.q6
  }
]

export const sceneList = [...firstScene, ...questionScene]