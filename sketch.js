var portName = '/dev/tty.usbmodem123456781';
var serial;
var newData;
var inData;
var jumpValue, squatValue, motionSpeed;
var playerSquat;

// Assest vars
let runningG, runningP, forest;
let forestBackground;
let mainR, mainF, mainJ;
let runningMenu, menuMusic;
let val1, val2;
let fade;
let b1, b2, b3, b4, b5;
let MENU;
let mFor;

let jsData = new Date();
let dayOW = getDayofWeek(jsData.getDay());

let jumpIcon, squatIcon;

let player;
let playerSpeed, prevSpeed;
let exerciseMode;
let playerAction;
let userData;
let age, weight, uheight, name;
let points;
let obst;
let radio;
let BMR;
let idleTime, jogTime, runTime;
let speedTime;
let currentTime;
let cumTime;
let earnPoints;
let timeToggle;
let toggleSpeed = true;
let targetSpeed = "Jog";
let playerLives;

let playerSpeeds = ["Idle", "Jogging", "Running"]
let dayOfWeeks = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"]
let plot3, plot4;
let days = [0,0,0,15.4,35.8,24.2,0]; 

function preload() {
  heartIcon = loadImage("icons/heart.png")
  bmrIcon = loadImage("icons/bmr.png")
  noice = loadSound("assets/noice.mp3")
  nice = loadImage("images/nice.gif")
  runnerIdle = loadImage("mainC/idle.png")
  caloriesIcon = loadImage("icons/calorie.png")
  stepsIcon = loadImage("icons/steps.png")
  timeIcon = loadImage("icons/time.png")
  distanceIcon = loadImage("icons/distance.png")
  pointsIcon = loadImage("icons/points.png")
  menuMusic = loadSound("assets/menu.mp3");
  playMusic = loadSound("assets/runningTheme.mp3")
  jumpIcon = loadImage("images/jump.png");
  squatIcon = loadImage("images/squat.png");
  runningMenu = loadImage("images/runMenu.jpg")
  mFor = loadImage("images/mFor.gif")
  mainR = loadImage("mainC/cRun.gif");
  mainF = loadImage("mainC/cFall.gif");
  mainJ = loadImage("mainC/cJump.gif");
}

function setup() {
  createCanvas(700, 600);
  playerSquat = false;
  newValue = false;
  points = 0; earnPoints = true;
  playerLives = 3;
  playerSpeed = 0
  currentTime = 0; cumTime = 0;
  idleTime = 0; jogTime = 0; runTime = 0;
  userData = localStorage.getItem("userStat");
  menuMusic.loop();
  menuMusic.setVolume(.5)
  menuMusic.pause();
  playMusic.setVolume(.5)
  playMusic.pause();
  // Load images.
  heartIcon.resize(50,50);
  mainR.resize(200,200);
  mainJ.resize(200,200);
  mainF.resize(200,200);
  squatIcon.resize(150,150);
  jumpIcon.resize(150,150);
  runnerIdle.resize(200,200)
  nice.resize(200,200)
  mainF.delay(50);
  runningMenu.resize(500,600);
  player = new Runner(mainR, mainJ, mainF);
  obst = new Obstacle(-3, squatIcon, jumpIcon, nice);
  // forest.resize(700,500);

  // Setup music slider
  musicSlider = createSlider(0, 50, 50);
  musicSlider.position(400, 200);
  musicSlider.style('width', '120px');
  musicSlider.hide();

  // Setup forms
  userStatsArr = split(userData, ' ')
  name = userStatsArr[0]
  age = userStatsArr[1]
  weight = userStatsArr[2]
  uheight = userStatsArr[3]
  nameInput = createInput(userStatsArr[0]);
  nameInput.position(100, 200);
  nameInput.hide();
  weightInput = createInput(userStatsArr[2]);
  weightInput.position(100, 300);
  weightInput.hide();
  heightInput = createInput(userStatsArr[3]);
  heightInput.position(100, 400);
  heightInput.hide();
  ageInput = createInput(userStatsArr[1]);
  ageInput.position(100, 500);
  ageInput.hide();

  // Setup checkbox 
  checkbox = createCheckbox('', true);
  checkbox.position(400, 270);
  checkbox.changed(function myCheckedEvent() {
    if (this.checked()) {
      exerciseMode = true;
    } else {
      exerciseMode = false;
    }
  })
  exerciseMode = true;
  checkbox.hide();

  // Setup radio 
  radio = createRadio();
  radio.option('Male', 0);
  radio.option('Female', 1);
  radio.option('Non-binary', 2);
  radio.value(userStatsArr[4])
  radio.style("color","white")
  radio.position(400, 400)
  radio.hide();
  getBMR();

  // Init vars.
  fade = 0;
  MENU = 0;

  // Setup buttons.
  b2 = createButton('Play');
  b2.mousePressed(function showPlay() {
    playerLives = 3;
    startTime = millis();
    speedTime = millis();
    timeToggle = millis();
    currentTime = millis();
    MENU = 2;
    points = 0;
    cumTime = 0;
    b5.show()
    b4.hide()
    b3.hide();
    b2.hide()
    b1.hide()
  });
  b2.position(500, 150);

  b3 = createButton('Stats');
  b3.position(500, 225);
  b3.mousePressed(function showStats() {
    MENU = 3;
    b5.show()
    b4.hide()
    b3.hide()
    b2.hide()
    b1.hide()
  });

  b1 = createButton('Settings');
  b1.position(500, 300);
  b1.mousePressed(function showSettings() {
    MENU = 1;
    musicSlider.show();
    ageInput.show();
    weightInput.show();
    nameInput.show();
    radio.show();
    heightInput.show();
    checkbox.show();
    b5.show()
    b4.hide()
    b3.hide()
    b2.hide()
    b1.hide()
  });

  b4 = createButton('About');
  b4.position(500, 375);
  b4.mousePressed(function showAbout() {
    MENU = 4;
    b5.show()
    b4.hide()
    b3.hide()
    b2.hide()
    b1.hide()
  });

  b5 = createButton('Back');
  b5.position(560, 540);
  b5.mousePressed(goBack);

  b5.hide();

  // Connect to serial port to listen to.
  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.list();
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
  serial.open(portName); 
}

function goBack() {
  if (MENU == 2) {
    checkSpeed();
    ellapsedTime = millis() - startTime;
    timeFormat = millisToMinutesAndSeconds(ellapsedTime)
    MENU = 5;
  }
  else if (MENU ==1) {
    age = parseInt(ageInput.value());
    weight = parseInt(weightInput.value());
    uheight = parseFloat(heightInput.value());
    name = nameInput.value();
    userData = name + " " + age + " " + weight + " " + uheight + " " + radio.value();
    localStorage.setItem("userStat", userData);
    MENU = 0;
    getBMR();
    b5.hide();
    b4.show()
  }
  else {
    if (playMusic.isPlaying()) 
      playMusic.stop()
    MENU = 0;
    b5.hide();
    b4.show()
  }
  musicSlider.hide();
  ageInput.hide();
  checkbox.hide();
  weightInput.hide();
  nameInput.hide();
  radio.hide();
  heightInput.hide();
}

function draw() {
  background(20);  
  if (newValue) {
    playerSpeed = motionSpeed;
    if (squatValue === 1) {
      playerSquat = true;
    } else {
      playerSquat = false;
    }
  }
  // text(inData, 400,500);
  if (MENU == 0)
    showMenu();
  if (MENU == 1)
    showSettings();
  if (MENU == 2)
    playGame();
  if (MENU == 3)
    showStats();
  if (MENU == 4)
    showAbout();
  if (MENU == 5)
    showSummary();
}

function showStats() {
  fill(255)
  textSize(32);
  textAlign(CENTER);
  text("Your Stats", 350, 50)
  textAlign(LEFT);
  textSize(24)
  text("Welcome " + name, 50, 150)
  textSize(20)
  text("Your Basal Metabolic Rate (BMR) is " + BMR + ". \nThis is just the number of calories your body uses.", 130, 220)
  image(bmrIcon, 50, 200);
  plotCals();
}

function showAbout() {
  fill(255)
  textSize(32);
  textAlign(CENTER);
  text("About RunPrix", 350, 50)
  textSize(20)
  text("We’re RunPrix, a globally recognized Video Game Team. \nOur growing popularity stems from our level of commitment to \nkeeping people healthy and happy during difficult times like \nthe COVID-19 pandemic. Our device uses accelerometric and \ngyroscopic  technologies to calculate your different motions \n(i.e. running speed and squat form) and gamify your \nworkout routine with corresponding visuals. \n\nStay safe, healthy, and entertained with RunPrix.", 350,100);
}

function showSummary() {
  fill(255);
  background(50)
  textSize(32);
  textAlign(CENTER);
  // Left side
  text("Your " + dayOW + " Workout Summary", 350, 50)
  textSize(24)
  image(timeIcon, 25, 150)
  text("Total Time", 150, 150)
  text(timeFormat, 150, 200)
  image(stepsIcon, 0, 280)
  text("Total Steps", 150, 300)
  stepsMin = round(ellapsedTime/60000,2);
  text(round(stepsMin * 100,2), 150, 350)
  image(pointsIcon, 25, 450)
  text("Total Points", 150, 450)
  text(points, 150, 500)

  // Right Side
  plotGame()
  image(caloriesIcon, 230, 430)
  text("Calories:", 380, 450)
  hrTime = ellapsedTime/3600000;
  colriesBurned = round((BMR/24)*5*hrTime, 2);
  text(colriesBurned, 380, 500)
  days[jsData.getDay()-1] = colriesBurned
  image(distanceIcon, 480, 450)
  distanceTrav = calculateDist();
  text("Distance:", 600, 450)
  text(distanceTrav, 600, 500)
}

function showSettings() {
  textSize(32);
  textAlign(CENTER);
  text("Settings", 350, 50)
  textAlign(LEFT);
  textSize(28)
  fill(255);
  text("Enter Name:", 100, 170);
  text("Enter Weight (lbs):", 100, 270);
  text("Enter Height (inch):", 100, 370);
  text("Enter Age:", 100, 470);

  // Right side
  text("Music Vol", 400, 170);
  let musVal = musicSlider.value();
  menuMusic.setVolume(musVal * .01);
  playMusic.setVolume(musVal * .01);
  text("Exercise Mode", 440, 290)
  text("Gender:", 400, 370);
}

function keyPressed() {
  if (keyCode === UP_ARROW && player.y == height-250) {
    player.speed = -35;
    player.y = height-300;
  }
}

function keyTyped() {
  prevSpeed = playerSpeed;
  if (key === '0') 
    playerSpeed = 0
  if (key === '1') 
    playerSpeed = 1
  if (key === '2') 
    playerSpeed = 2
}

function showMenu() {
  textAlign(LEFT);
  if (!menuMusic.isPlaying())
    menuMusic.play()
  b4.show();
  b3.show();
  b2.show()
  b1.show();
  image(runningMenu,0,0);
  // Right side of menu
  noStroke();
  fill(20);
  beginShape();
  vertex(500, 0);
  vertex(700, 0);
  vertex(700, 600);
  vertex(400, 600);
  endShape(CLOSE);
  fill(255, 255, 255, fade);
  textSize(42);
  text("Run", 525, 80);
  fill(255,0,0, fade);
  text("Prix", 600, 80);
  if (fade >= 255) {
    stroke(255);
    line(525, 85, 675, 85);
    fade = 255;
  } else {
    fade += 2;
  }
}

function playGame() {
  cumTime += millis() - currentTime;
  currentTime = millis();
  textAlign(LEFT);
  textSize(32)
  fill(255)

  if (menuMusic.isPlaying())
    menuMusic.stop()

  if (!playMusic.isPlaying())
    playMusic.play()

  // Background
  image(mFor, 0, 0);

  // Check player actions
  checkSpeed();
  if (keyIsDown(UP_ARROW)) {
    playerAction = 1;
    player.g = 2;
  } else{
    player.g = 3;
  }

  if (keyIsDown(DOWN_ARROW) || playerSquat) {
    player.action = mainF;
    playerAction = 0;
    player.height = 75;
  } else {
    player.height = 150;
  }

  player.show();
  player.update();
  // text(inData, 10,10);

  // Top left popup
  text("Speed: " + playerSpeeds[playerSpeed], 20,100)
  text("Time: " + millisToMinutesAndSeconds(cumTime), 20,150)

  // Check in in mode
  if (exerciseMode) {
    text("Points: " + points, 20,50)
    checkHealth();
    obst.checkComplete(playerAction)
    obst.show();
    obst.update();
  } else {
    if (millisToMin(millis()) - millisToMin(timeToggle) >= 2 ) {
      toggleSpeed = !toggleSpeed;
      timeToggle = millis();
    }
    if (toggleSpeed) 
      targetSpeed = "Jog"
    else 
      targetSpeed = "Run"

    text("Target Speed: " + targetSpeed, 20,50)
  }
}

function checkHealth() {
  if (playerLives >= 3) {
    image(heartIcon, 50, 530)
  }
  if (playerLives >= 2) {
    image(heartIcon, 100, 530)
  } 
  if (playerLives >= 1) {
    image(heartIcon, 150, 530)
  } 
  if (playerLives <= 0) {
    goBack();
  }

}

function checkSpeed() {
  if (playerSpeed != prevSpeed) {
    // IDLE
    if(playerSpeed == 0) {
      player.idle(runnerIdle);
      ellapseT = millis() - speedTime
      idleTime += ellapseT
      speedTime = millis()
    }
    // JOG
    else if (playerSpeed == 1) {
      mainR.delay(50);
      ellapseT = millis() - speedTime
      jogTime += ellapseT
      speedTime = millis()
    }
    // RUN
    else if (playerSpeed == 2) {
      mainR.delay(20);
      ellapseT = millis() - speedTime
      runTime += ellapseT
      speedTime = millis()
    }
  }
}

// Functions to set up serial port 
// Lists ports available.
function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

// Break up our serial input.
// INPUT: <button1> <button2> <slider> <accelerometer> <light> <sound> <tempF>
// All inputs are sperated by '|' 
function serialEvent() {
 let currentString = serial.readLine();
 trim(currentString);
 inData = currentString;
 let splitData = split(inData, '|');
 console.log(splitData)
  if (splitData.length === 2) {
    motionSpeed = int(trim(splitData[0]));
    squatValue = int(trim(splitData[1]));
    // jumpValue = int(trim(splitData[1]));
    newValue = true;
  } else {
    newValue = false;
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

// Utility functions 
function millisToMinutesAndSeconds(milliseconds) {
  let seconds = (int) (milliseconds / 1000) % 60 ;
  let minutes = (int) ((milliseconds / (1000*60)) % 60);
  let hour   = (int) ((milliseconds / (1000*60*60)) % 24);
  return hour + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function millisToMin(milliseconds) {
  let minutes = (int) ((milliseconds / (1000*60)) % 60);
  return round(minutes)
}

function getDayofWeek(day) {
  switch (day) {
    case 0:
    case 7:
      return "Sunday";
    case 1:
      return "Monday"
    case 2:
      return "Tuesday"
    case 3:
      return "Wednesday"
    case 4:
      return "Thursday"
    case 5:
      return "Friday"
    case 6:
      return "Saturday"
    default: 
      return "Unknown"
  }
}


function plotGame() {
  let points3 = [];
  max1 = max(idleTime, jogTime)
  max2 = max(max1, runTime)
  points3[0] = new GPoint(0,millisToMin(idleTime), "Idle");
  points3[1] = new GPoint(1,millisToMin(jogTime), "Jogging");
  points3[2] = new GPoint(2,millisToMin(runTime), "Running");
  // points3[0] = new GPoint(0,(idleTime), "Idle");
  // points3[1] = new GPoint(1,(jogTime), "Jogging");
  // points3[2] = new GPoint(2,(runTime), "Running");
  
  plot3 = new GPlot(this);
  plot3.setPos(270, 100);millisToMin
  plot3.setFontColor(color(255,255,255))
  plot3.setDim(300, 150);
  plot3.setYLim(0, millisToMin(max2));
  plot3.setXLim(3);
  plot3.getYAxis().getAxisLabel().setText("Time (Minutes)");
  plot3.getTitle().setText("Activity Summary");
  plot3.setPoints(points3);
  plot3.startHistograms(GPlot.VERTICAL);
  plot3.getHistogram().setDrawLabels(true);
  plot3.getHistogram().setRotateLabels(true);
  plot3.getHistogram().setBgColors(
    [color(255, 0, 0, 50), color(255, 0, 0, 100),color(255, 0, 0, 150)]); 

  // Draw the third plot
  plot3.beginDraw();
  plot3.drawYAxis();
  plot3.drawTitle();
  plot3.drawHistograms();
  plot3.endDraw();
}



function getBMR() {
  if(radio.value() === 'Male') {
    BMR = round((4.536*weight)+(15.88*uheight)-(5*age)+5,2);
  } else if (radio.value() === 'Female') {
    BMR = round((4.536*weight)+(15.88*uheight)-(5*age)-161,2);
  } else {
    BMR = round((4.536*weight)+(15.88*uheight)-(5*age)-83,2);
  }
}

function calculateDist() {
  joggingDist = (millisToMin(jogTime)/60 * 4)
  runningDist = (millisToMin(runTime)/60 *7)
  totDist = round(joggingDist + runningDist,2);
  return totDist
}

function plotCals() {
  let points3 = [];

  for (let i = 0; i < days.length; i++) {
    points3[i] = new GPoint(i,days[i], dayOfWeeks[i]);
  }

  maxY = max(days);

  plot4 = new GPlot(this);
  plot4.setPos(30, 280);
  plot4.setFontColor(color(255,255,255))
  plot4.setDim(500, 200);
  plot4.setYLim(0, maxY+50);
  plot4.setXLim(3);
  plot4.getYAxis().getAxisLabel().setText("Calories");
  plot4.getTitle().setText("Calories Burned");
  plot4.setPoints(points3);
  plot4.startHistograms(GPlot.VERTICAL);
  plot4.getHistogram().setDrawLabels(true);
  plot4.getHistogram().setRotateLabels(true);
  plot4.getHistogram().setBgColors(
    [color(255, 0, 0, 50), color(255, 0, 0, 100),color(255, 0, 0, 150)]); 

  // Draw the third plot
  plot4.beginDraw();
  plot4.drawYAxis();
  plot4.drawTitle();
  plot4.drawHistograms();
  plot4.endDraw();
}