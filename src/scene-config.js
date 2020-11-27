import {
  renderBg,
  renderDot
} from './util-render-func';

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
  }
]