class Runner {
  constructor(run, jump, fall) {
    this.action = run;
    this.run = run;
    this.jump = jump;
    this.duck = fall;
    this.speed = 0;
    this.height = 150;
    this.g = 3;
    this.speed = 0;
    this.y = height-250

  }
  
  show() {
    image(this.action, 50, this.y)
  }

  idle(imageIdle) {
    this.action = imageIdle;
  }
  
  update() {
    if (this.y < height-250) {
      playerAction = 1;
      this.action = this.jump;
      this.y = this.y+this.speed;
      this.speed = this.speed+this.g;
      if (this.y>height-300) {
        this.y = height-250;
        this.speed = 0;
      }
    } else {
      if (!keyIsDown(DOWN_ARROW))
        playerAction = 2;
      this.y = height-250
      this.action = this.run;
    }
  }

}