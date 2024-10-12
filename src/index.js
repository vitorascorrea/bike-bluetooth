import Bike from "./session-models/Bike.js";
import BikeSession from "./session-models/BikeSession.js";
import DebugConnector from "./connectors/DebugConnector.js";
import EchelonDeviceConnector from "./connectors/EchelonDeviceConnector.js";

const bike = new Bike();
const bikeSession = new BikeSession(bike);
let deviceConnector = null;
let updateInterval = null;

const connectButton = document.getElementById("connectButton");
const connectorSelectNode = document.getElementById("connectorSelect");

const currentSpeedNode = document.getElementById("currentSpeed");
const totalDistanceNode = document.getElementById("totalDistance");
const averagePowerNode = document.getElementById("averagePower");
const maxSpeedNode = document.getElementById("maxSpeed");
const maxPowerNode = document.getElementById("maxPower");

connectButton.addEventListener("click", async function (event) {
  if (deviceConnector?.active()) {
    try {
      await deviceConnector.stopListening();
      connectButton.textContent = "Connect";
      clearInterval(updateInterval);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  connectorSelect();

  try {
    await deviceConnector.startListening();
    connectButton.textContent = "Disconnect";
    updateInterval = setInterval(sessionLoop, 1000);
  } catch (error) {
    console.error(error);
  }
});

const connectorSelect = () => {
  const selectedConnector = connectorSelectNode.value;

  if (!selectedConnector) {
    console.error("Select a connector");
  }

  switch (selectedConnector) {
    case "echelon":
      deviceConnector = new EchelonDeviceConnector(
        bikeSession.cadenceCallback,
        bikeSession.resistanceCallback
      );
      break;
    case "debug":
      deviceConnector = new DebugConnector(
        bikeSession.cadenceCallback,
        bikeSession.resistanceCallback
      );
      break;
    default:
      break;
  }
};

const sessionLoop = () => {
  bikeSession.updateSessionStats();

  currentSpeedNode.textContent = `${bike
    .currentSpeedInKmPerH()
    .toFixed(2)} km/h`;
  averagePowerNode.textContent = `${bike.currentPowerInWatts().toFixed(2)} w`;
  totalDistanceNode.textContent = `${bikeSession.totalDistanceInKm.toFixed(
    2
  )} km`;
  maxSpeedNode.textContent = `${bikeSession.maxSpeedInKmPerH.toFixed(2)} km/h`;
  maxPowerNode.textContent = `${bikeSession.maxPowerInWatts.toFixed(2)} w`;
};
