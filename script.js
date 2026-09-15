window.addEventListener("DOMContentLoaded", function() {
const button = document.getElementById("button");
const water = document.getElementById("water");
const wave = document.getElementById("wave");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let Schwelle = 0;
const MiniIP = "http://192.168.178.115";
let percent;
let i = 0;
async function pumpeAn2(){
            try {
                
                const response = await fetch(MiniIP + "/pumpe/an");
                const text = await response.text();
                console.log("Pumpe eingeschaltet:", text);
                
            } catch (error) {
                console.error("Fehler beim Einschalten der Pumpe:", error);
        
            }
        }
async function pumpeAus2(){
            try {
                const response = await fetch(MiniIP + "/pumpe/aus");
                const text = await response.text();
                console.log("Pumpe ausgeschaltet:", text);
            } catch (error) {
                console.error("Fehler beim Ausschalten der Pumpe:", error);
            }
        }


button2.addEventListener("click", async function(){
    async function pumpeAn(){
            try {
                
                const response = await fetch(MiniIP + "/pumpe/an");
                const text = await response.text();
                console.log("Pumpe eingeschaltet:", text);
                
            } catch (error) {
                console.error("Fehler beim Einschalten der Pumpe:", error);
        
            }
        }
        
        async function pumpeAus(){
            try {
                const response = await fetch(MiniIP + "/pumpe/aus");
                const text = await response.text();
                console.log("Pumpe ausgeschaltet:", text);
            } catch (error) {
                console.error("Fehler beim Ausschalten der Pumpe:", error);
            }
        }
pumpeAn();
await sleep(3000);
pumpeAus();
    
})
button.addEventListener("click", async function(){
    let feuchtigkeit;
    let rawfeuchtigkeit; 
   const d1MiniIP = "http://192.168.178.115/feucht";
   const d1MiniIP2 = "http://192.168.178.115/stand";

    //function FeuchtigkeitProzent(rawfeuchtigkeit) {
  //let percent = ((750 - rawfeuchtigkeit) / (750 - 300)) * 100;
  
  //return Math.min(Math.max(Math.round(percent), 0), 100);

    //feuchtigkeit = FeuchtigkeitProzent(rawfeuchtigkeit);
    

// feuchtigkeit = Math.floor(Math.random()*100)+1;
async function holeDaten() {
    try {
        const response = await fetch(d1MiniIP);
        const data = await response.json();



        console.log("Erfolgreich empfangen:", data.moisture);
 
        return data.moisture;

    } catch (error) {
        console.error("Fehler beim Abrufen der D1 Mini Daten:", error);
        document.getElementById("variable-anzeige").innerText = "Fehler!";
    }
}
async function holeDaten2() {
    try {
        const response = await fetch(d1MiniIP2);
        const data = await response.json();



        console.log("Erfolgreich empfangen:", data.stand);
 
        return data.stand;

    } catch (error) {
        console.error("Fehler beim Abrufen der D1 Mini Daten:", error);
        document.getElementById("variable-anzeige").innerText = "Fehler!";
    }
}

rawfeuchtigkeit = await holeDaten();
percent = Math.round(((750 - rawfeuchtigkeit) / (750 - 300)) * 100);
document.getElementById("feuchtigkeit").textContent = percent + "%";
    

    alert("Bodenfeuchtigkeit wurde gemessen");
    water.style.height = percent-25 + "%";
    if(percent < 25){
        water.style.height = "0%";
    }
    wave.style.bottom = percent-27 + "%";

const progress = document.getElementById("progress");
progress.value = await holeDaten2();
document.getElementById("wasserstand").textContent = "Wasserstand: " + progress.value + "%";

})

//const progress = document.getElementById("progress");
//progress.value = Math.floor(Math.random()*100)+1;
//^document.getElementById("wasserstand").textContent = "Wasserstand: " + progress.value + "%";

const threshhold = document.getElementById("threshhold");
threshhold.addEventListener("click", function() {
    const enteredValue = prompt("Aktuelle Bewässerungsschwelle:"+ Schwelle +"%\nBitte gib einen Wert zwischen 0 und 99 ein:", "99"); 

  if (enteredValue !== null && enteredValue !== "" && !isNaN(enteredValue) && Number(enteredValue) >= 0 && Number(enteredValue) <= 99) {
    
    Schwelle = Number(enteredValue);
  }
 
});


    button3.addEventListener("click", async function(){
        
      i = i + 1;
      while (i==1){
        document.getElementById("button3").textContent = "Stoppen";
        let feuchtigkeit;
    let rawfeuchtigkeit; 
   const d1MiniIP = "http://192.168.178.115/feucht";
   const d1MiniIP2 = "http://192.168.178.115/stand";

async function holeDaten() {
    try {
        const response = await fetch(d1MiniIP);
        const data = await response.json();



        console.log("Erfolgreich empfangen:", data.moisture);
 
        return data.moisture;

    } catch (error) {
        alert("Fehler beim Abrufen der D1 Mini Daten: " + error);
        console.error("Fehler beim Abrufen der D1 Mini Daten:", error);
        document.getElementById("variable-anzeige").innerText = "Fehler!";
    }
}
async function holeDaten2() {
    try {
        const response = await fetch(d1MiniIP2);
        const data = await response.json();



        console.log("Erfolgreich empfangen:", data.stand);
 
        return data.stand;

    } catch (error) {
        console.error("Fehler beim Abrufen der D1 Mini Daten:", error);
        document.getElementById("variable-anzeige").innerText = "Fehler!";
    }
}

rawfeuchtigkeit = await holeDaten();
percent = Math.round(((750 - rawfeuchtigkeit) / (750 - 300)) * 100);
document.getElementById("feuchtigkeit").textContent = percent + "%";
    

    //alert("Bodenfeuchtigkeit wurde gemessen");
    water.style.height = percent-25 + "%";
    if(percent < 25){
        water.style.height = "0%";
    }
    wave.style.bottom = percent-27 + "%";

const progress = document.getElementById("progress");
progress.value = await holeDaten2();
document.getElementById("wasserstand").textContent = "Wasserstand: " + progress.value + "%";

if(percent < Schwelle){
    pumpeAn2();
    await sleep(9000);
    pumpeAus2();
    await sleep(300000);
    pumpeAus2();
}
if(progress.value < 25){
    //alert("Wasserstand zu niedrig! Bitte Wasser nachfüllen!");
    //await sleep(3000);
}
      }
if ( i >1){
    i = 0;
    document.getElementById("button3").textContent = "Starten";
}
if(i==1){
    document.getElementById("button3").textContent = "Stoppen";
}
});

});