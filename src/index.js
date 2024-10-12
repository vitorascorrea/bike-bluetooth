import Bike from "./Bike.js";
import BikeSession from "./BikeSession.js";
import EchelonDeviceConnector from "./EchelonDeviceConnector.js";

const bike = new Bike()
const bikeSession = new BikeSession(bike)
const deviceConnector = new EchelonDeviceConnector(
  bikeSession.cadenceCallback,
  bikeSession.resistanceCallback
);

document.addEventListener("pointerup", async function (event) {
  if (deviceConnector.device?.gatt.connected) {
    return;
  }

  deviceConnector.connect();
});
