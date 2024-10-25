import Bike from "./session/Bike.js";
import BikeSession from "./session/BikeSession.js";
import DebugConnector from "./connectors/DebugConnector.js";
import EchelonDeviceConnector from "./connectors/EchelonDeviceConnector.js";
import { formatTime } from "./utils/Utils.js";

const bike = new Bike();
const bikeSession = new BikeSession(bike);
let deviceConnector = null;

const connectButton = document.getElementById("connectButton");
const connectorSelectNode = document.getElementById("connectorSelect");

const currentSpeedNode = document.getElementById("currentSpeed");
const totalDistanceNode = document.getElementById("totalDistance");
const totalCaloriesNode = document.getElementById("totalCalories");
const averagePowerNode = document.getElementById("averagePower");
const maxSpeedNode = document.getElementById("maxSpeed");
const maxPowerNode = document.getElementById("maxPower");
const duration = document.getElementById("duration");

connectButton.addEventListener("click", async function (event) {
  if (deviceConnector?.active()) {
    try {
      await deviceConnector.stopListening();

      if (bikeSession.started()) {
        connectButton.textContent = "Continue Session";
      } else {
        connectButton.textContent = "Start Session";
      }

      bikeSession.stop();
    } catch (error) {
      console.error(error);
    }
    return;
  }

  connectorSelect();

  try {
    await deviceConnector.startListening();
    bikeSession.start(sessionLoop);
    connectButton.textContent = "Stop Session";
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
  currentSpeedNode.textContent = `${bike
    .currentSpeedInKmPerH()
    .toFixed(2)} km/h`;
  averagePowerNode.textContent = `${bike.currentPowerInWatts().toFixed(2)} w`;
  totalDistanceNode.textContent = `${bikeSession.totalDistanceInKm.toFixed(
    2
  )} km`;
  totalCaloriesNode.textContent = `${bikeSession.totalKCal.toFixed(2)} kcal`;
  maxSpeedNode.textContent = `${bikeSession.maxSpeedInKmPerH.toFixed(2)} km/h`;
  maxPowerNode.textContent = `${bikeSession.maxPowerInWatts.toFixed(2)} w`;
  duration.textContent = formatTime(bikeSession.durationInSeconds);
};
