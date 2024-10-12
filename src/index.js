import Bike from "./Bike.js";
import BikeSession from "./BikeSession.js";
import EchelonDeviceConnector from "./EchelonDeviceConnector.js";

const bike = new Bike()
const bikeSession = new BikeSession(bike)
const deviceConnector = new EchelonDeviceConnector(
  bikeSession.cadenceCallback,
  bikeSession.resistanceCallback
);

const connectButton = document.getElementById("connectButton");
const currentSpeedNode = document.getElementById("currentSpeed");
const totalDistanceNode = document.getElementById("totalDistance");
const averagePowerNode = document.getElementById("averagePower");
let updateInterval = null

connectButton.addEventListener("click", async function (event) {
  if (deviceConnector.device?.gatt.connected) {
    await deviceConnector.disconnect();
    connectButton.textContent = "Connect";
    return;
  }

  await deviceConnector.connect();
  connectButton.textContent = "Disconnect";
  updateInterval = setInterval(updateDisplay, 1000);
});

const updateDisplay = () => {
  currentSpeedNode.textContent = `${bikeSession.currentSpeedInKmPerH.toFixed(2)} km/h`;
  totalDistanceNode.textContent = `${bikeSession.totalDistanceInKm.toFixed(2)} km`;
  averagePowerNode.textContent = `${bikeSession.currentPowerInWatts.toFixed(2)} w`;
}