#include <Wire.h>
#include <RTClib.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include <LiquidCrystal.h>
#include <ESP32Servo.h>

Servo myServo1;
Servo myServo2;
RTC_DS3231 rtc;

const char* ssid = "home1234_fbnpa_2.4";  // Your WiFi SSID
const char* password = "CLB279CA36";      // Your WiFi Password

const char* mqttServer = "192.168.1.102";
const int mqttPort = 1883;                // MQTT Port
const char* mqttTopic1 = "med/udetails";  // Topic for sending user details
const char* mqttTopic2 = "med/realtime";  // Topic for sending time
const char* mqttTopic3 = "med/buzzer";
const char* mqttTopic4 = "med/button";  // Topic for receiving buzzer state
const char* mqttTopic5 = "med/alarm";

WiFiClient espClient;
PubSubClient client(espClient);

#define BUZZER_PIN 18  // Define the buzzer pin (D5 on ESP32)
#define BUTTON_PIN1 14
#define BUTTON_PIN2 5

LiquidCrystal lcd(19, 26, 27, 32, 33, 25);

// Function to connect to WiFi
void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

// Function to connect to MQTT
void connectToMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32-Wokwi")) {
      Serial.println("Connected to MQTT");
      client.subscribe("med/buzzer");
      Serial.println("Subscribed to med/buzzer");
      client.subscribe("med/alarm");
      Serial.println("Subscribed to med/alarm");
    } else {
      Serial.print("Failed, rc=");
      Serial.println(client.state());
    }
  }
}

void cb1(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Received message from MQTT: ");
  Serial.print(topic);
  Serial.print(" -> ");
  Serial.println(message);

  if (String(topic) == mqttTopic3) {
    lcd.clear();
    lcd.print(message);
  }

  if (String(topic) == mqttTopic5) {
    if (message == "ON") {
      Serial.println("Turning BUZZER ON");
      digitalWrite(BUZZER_PIN, HIGH);
    } else if (message == "OFF") {
      Serial.println("Turning BUZZER OFF");
      digitalWrite(BUZZER_PIN, LOW);
    }
  }
}

void setup() {
  Serial.begin(115200);

  myServo1.attach(4);
  myServo2.attach(2);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  pinMode(BUTTON_PIN1, INPUT_PULLUP);
  pinMode(BUTTON_PIN2, INPUT_PULLUP);

  lcd.begin(20, 4);

  connectToWiFi();
  client.setServer(mqttServer, mqttPort);
  connectToMQTT();

  Serial.println("Enter Email: ");
  while (Serial.available() == 0) {}  // Wait for user input
  String email = Serial.readStringUntil('\n');
  email.trim();
  Serial.println("Sending Email: " + email);
  client.publish(mqttTopic1, email.c_str());
  Serial.println("Published Email to MQTT");

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1)
      ;
  }
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, setting time...");
    rtc.adjust(DateTime(__DATE__, __TIME__));  // Set RTC to compile time
  }
}

void loop() {
  if (!client.connected()) {
    connectToMQTT();
  }
  client.loop();

  DateTime now = rtc.now();
  char buffer[20];
  sprintf(buffer, "%02d:%02d", now.hour(), now.minute());
  Serial.println(buffer);
  client.publish(mqttTopic2, buffer);
  client.setCallback(cb1);

  if ((digitalRead(BUTTON_PIN1) == LOW) || (digitalRead(BUTTON_PIN2) == LOW) && (digitalRead(BUZZER_PIN) == HIGH)) {
    digitalWrite(BUZZER_PIN, LOW);
    Serial.println("buzzer off");

    if ((digitalRead(BUTTON_PIN1) == LOW) && (digitalRead(BUTTON_PIN2) == HIGH)) {
      myServo1.write(0);  // Move servo to 90 degrees
      delay(1000);
      myServo1.write(180); 
      delay(60000); // Move servo to 0 degrees
    } else if((digitalRead(BUTTON_PIN1) == HIGH) && (digitalRead(BUTTON_PIN2) == LOW)) {
      myServo2.write(0);  // Move servo to 90 degrees
      delay(1000);
      myServo2.write(180);
      delay(60000);
    }

  } else {
    Serial.println("Press the button");
  }

  delay(10000);  // Send every 10 seconds
}
