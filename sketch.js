var portName = '/dev/tty.usbmodem123456781';

let running, running2
let val1, val2;
let newData;
let inData;

function preload() {
  running = loadImage("images/running.gif");
  running2 = loadImage("images/running.gif");
}

function setup() {
  createCanvas(400, 400);
  running.resize(100,100);
  running.delay(20);
  running2.resize(100,100);
  running2.delay(50);

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

function draw() {
  background(220);  
  image(running, 50, 50);
  image(running2, 200, 50);
  text(inData, 10,10);
}

// Functions to set up serial port 
// Lists ports available.
function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

// Break up our serial input.
// INPUT: <button1> <button2> <slider> <accelerometer> <light> <sound> <tempF>
// All inputs are sperated by '|' 
function serialEvent() {
  inData = serial.readLine();
  // let splitData = split(inData, '|');
  // if (splitData.length === 2) {
  //   val1 = int(trim(splitData[0]));
  //   val2 = int(trim(splitData[1]));
  //   newValue = true;
  // } else {
  //   newValue = false;
  // }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}