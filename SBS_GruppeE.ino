
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Wire.h>

#ifdef ARDUINO_SAMD_VARIANT_COMPLIANCE
#define SERIAL SerialUSB
#else
#define SERIAL Serial
#endif

const int pinFeucht = A0;

ESP8266WebServer server(80);

const char* ssid = "Moin";
const char* password = "21JG05D1972Jg21L091965";

int Soil_Moisture = 0 ;
int Water_Stand = 0;
const int PUMP_PIN = D6;

unsigned char low_data[8] = {0};
unsigned char high_data[12] = {0};


#define NO_TOUCH       0xFE
#define THRESHOLD      100
#define ATTINY1_HIGH_ADDR   0x78
#define ATTINY2_LOW_ADDR   0x77

void getHigh12SectionValue(void)
{
  memset(high_data, 0, sizeof(high_data));
  Wire.requestFrom(ATTINY1_HIGH_ADDR, 12);
  while (12 != Wire.available());

  for (int i = 0; i < 12; i++) {
    high_data[i] = Wire.read();
  }
  delay(10);
}

void getLow8SectionValue(void)
{
  memset(low_data, 0, sizeof(low_data));
  Wire.requestFrom(ATTINY2_LOW_ADDR, 8);
  while (8 != Wire.available());

  for (int i = 0; i < 8 ; i++) {
    low_data[i] = Wire.read(); // receive a byte as character
  }
  delay(10);
}

void check()
{
  int sensorvalue_min = 250;
  int sensorvalue_max = 255;
  int low_count = 0;
  int high_count = 0;
  
    uint32_t touch_val = 0;
    uint8_t trig_section = 0;
    low_count = 0;
    high_count = 0;
    getLow8SectionValue();
    getHigh12SectionValue();

    for (int i = 0; i < 8; i++)
    {
      //Serial.print(low_data[i]);
      //Serial.print(".");
      if (low_data[i] >= sensorvalue_min && low_data[i] <= sensorvalue_max)
      {
        low_count++;
      }
      if (low_count == 8)
      {
        //Serial.print("      ");
        //Serial.print("PASS");
      }
    }
    //Serial.println("  ");
    //Serial.println("  ");
    //Serial.println("high 12 sections value = ");
    for (int i = 0; i < 12; i++)
    {
      //Serial.print(high_data[i]);
      //Serial.print(".");

      if (high_data[i] >= sensorvalue_min && high_data[i] <= sensorvalue_max)
      {
        high_count++;
      }
      if (high_count == 12)
      {
        //Serial.print("      ");
        //Serial.print("PASS");
      }
    }

    //Serial.println("  ");
    //Serial.println("  ");

    for (int i = 0 ; i < 8; i++) {
      if (low_data[i] > THRESHOLD) {
        touch_val |= 1 << i;

      }
    }
    for (int i = 0 ; i < 12; i++) {
      if (high_data[i] > THRESHOLD) {
        touch_val |= (uint32_t)1 << (8 + i);
      }
    }

    while (touch_val & 0x01)
    {
      trig_section++;
      touch_val >>= 1;
    }
    Water_Stand = trig_section * 5;
}
void pumpeAn() {
  digitalWrite(PUMP_PIN, HIGH);
  server.send(200, "text/plain", "Pumpe AN");
}

void pumpeAus() {
  digitalWrite(PUMP_PIN, LOW);
  server.send(200, "text/plain", "Pumpe AUS");
}
void setCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

void HandleOptions() {
  setCorsHeaders();
  server.send(204); // 204 No Content
}

void HandleGetFeucht(){
  setCorsHeaders();
  
  String jsonResponse = "{\"moisture\":" + String(Soil_Moisture) + "}";
 
  server.send(200, "application/json", jsonResponse);
  
}
void HandleGetStand(){
  setCorsHeaders();
  
  String jsonResponse = "{\"stand\":" + String(Water_Stand) + "}";
 
  server.send(200, "application/json", jsonResponse);
  
}
void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);
  Wire.begin();
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi..");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  //Serial.println("\nConnected to the WiFi network");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/pumpe/an", pumpeAn);
  server.on("/pumpe/aus", pumpeAus);
  server.on("/feucht", HTTP_GET, HandleGetFeucht);
  server.on("/stand", HTTP_GET,HandleGetStand);
  server.on("/feucht", HTTP_OPTIONS, HandleOptions);
  server.begin();
  }

void loop() {
  server.handleClient();
  check();
static unsigned long lastUpdate = 0;
if(millis()- lastUpdate > 2000){
  Soil_Moisture = analogRead(pinFeucht);
  lastUpdate = millis();
  }
}
