// frame change
export function personFrameChange(sprites) {
  return function () {
    35 < this.currentFrame && this.currentFrame <= 51 ? (sprites.animateStep1.visible = true,
      sprites.animateStep2.visible = false) : 51 < this.currentFrame ? (sprites.animateStep1.visible = false,
      sprites.animateStep2.visible = true) : (sprites.animateStep2.visible = false,
      sprites.animateStep1.visible = false)
  }
}