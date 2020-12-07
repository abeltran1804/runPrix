let squat;
let jump;
let nice
let done;

class Obstacle {  
  constructor(s, sq, jmp, n) {
    done = true;
    squat = sq;
    jump = jmp;
    nice = n;
    let exc = int(random(2));
    // Squat
    if (exc == 0) {
      this.action = 0;
      this.image = squat
    }
    // Jump
    else if (exc == 1) {
      this.action = 1;
      this.image = jump
    } 
    
    this.x = 600;
    this.speed = s;
  }
  
  renew(s) {
    done = true;
    let exc = int(random(2));
    // Squat
    if (exc == 0) {
      this.action = 0;
      this.image = squat
    }
    //
    else if (exc == 1) {
      this.action = 1;
      this.image = jump
    } 
    
    this.x = 600;
    this.speed = s;
  }
  
  show() {

    if (this.image === squat) 
      text("Squat!", this.x+50, 380);
    else if (this.image === jump)
      text("Jump!", this.x+30, 380);
    image(this.image, this.x, 400);
  }
  
  update() {
    if (this.x<-50) {
      if (done) {
        playerLives += -1
      }
      this.renew(this.speed-.1);
    } else {
      this.x = this.x+this.speed;
    }
  }

  checkComplete(action) {
    if (action === this.action && done) {
      noice.play();
      done = false;
      this.image = nice;
      points += 1;
      playerAction = 2;
    } 
  }
}