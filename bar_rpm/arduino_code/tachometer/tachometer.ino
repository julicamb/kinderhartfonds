/*
 * Created 02/02/2017
 * Simen De Troch
 */

// EP16-22 kinderhartfonds
// Tachometer with arduino hall sensor kit
// this code measures the difference in output when a magnet passes by a hall sensor
// by calculating the amount of time the output changes per minute we can calculate the rpm

//for converting the analog signal coming from hall sensor to digital through arduino code
int refSig = 400;
//the digital value of the incoming analog signals from the hall sensor
int hsVal;
int prevVal = 0;
//time variables to calculate the rpm
unsigned long time,currentTime;


void setup()
{
 Serial.begin(9600);
 // pin A0 is the signal input
 pinMode(13, INPUT);
}

//Measure RPM
void loop() {
  if (Serial.available()) {
    char input = Serial.read();
    // read the input on analog pin 0:
    int sensorValue = analogRead(A0);
    // print out the value you read:
    Serial.println(sensorValue);
    delay(1); // delay in between reads for stability
 }
  
  //read raw value of hall sensor
  int sig = analogRead(A0);
  //convert it to digital true/false form
  if(sig > refSig) {
    hsVal = HIGH;
  }
  else {
    hsVal = LOW;
  }
  //check for rising edge in value
  if(prevVal == 0 && hsVal == 1) {
    currentTime = micros();
    //print the rpm
    Serial.println(1000000*60 / (currentTime - time));
    time = micros();
  }
  prevVal = hsVal;
}

