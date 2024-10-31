import Bike from "./session/Bike.js";
import BikeSession from "./session/BikeSession.js";
import DebugConnector from "./connectors/DebugConnector.js";
import EchelonDeviceConnector from "./connectors/EchelonDeviceConnector.js";
import { formatTime } from "./utils/Utils.js";

const bike = new Bike();
const bikeSession = new BikeSession(bike);
let deviceConnector = null;
let wakeLock = null;

const connectButton = document.getElementById("connectButton");
const connectorSelectNode = document.getElementById("connectorSelect");

const durationStat = document.getElementById("durationStat");
const distanceStat = document.getElementById("distanceStat");
const caloriesStat = document.getElementById("caloriesStat");

const speedStat = document.getElementById("speedStat");
const powerStat = document.getElementById("powerStat");
const cadenceStat = document.getElementById("cadenceStat");
const resistanceStat = document.getElementById("resistanceStat");

connectButton.addEventListener("click", async function (event) {
  if (deviceConnector?.active()) {
    try {
      await deviceConnector.stopListening();

      if (bikeSession.started()) {
        connectButton.textContent = "Continue Session";
      } else {
        connectButton.textContent = "Start Session";
      }

      connectButton.classList.remove("stop");

      bikeSession.stop();
    } catch (error) {
      console.error(error);
    }

    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    }

    return;
  }

  connectorSelect();

  try {
    if (!wakeLock) {
      wakeLock = await setWakeLock();
    }

    await deviceConnector.startListening();
    bikeSession.start(sessionLoop);
    connectButton.textContent = "Stop Session";
    connectButton.classList.add("stop");
  } catch (error) {
    console.error(error);
  }
});

const setWakeLock = async () => {
  const wakeLock = await navigator.wakeLock.request("screen");

  wakeLock.addEventListener("release", () => {
    console.log("Screen Wake Lock released:", wakeLock.released);
  });

  return wakeLock;
};

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
  speedStat.setAttribute("now", bike.currentSpeedInKmPerH().toFixed(2));
  speedStat.setAttribute("max", bikeSession.maxSpeedInKmPerH.toFixed(2));

  powerStat.setAttribute("now", bike.currentPowerInWatts().toFixed(2));
  powerStat.setAttribute("max", bikeSession.maxPowerInWatts.toFixed(2));

  cadenceStat.setAttribute("now", bike.cadence);
  cadenceStat.setAttribute("max", bikeSession.maxCadence);

  resistanceStat.setAttribute("now", bike.resistance);
  resistanceStat.setAttribute("max", bikeSession.maxResistance);

  durationStat.setAttribute("value", formatTime(bikeSession.durationInSeconds));
  caloriesStat.setAttribute("value", bikeSession.totalKCal.toFixed(2));
  distanceStat.setAttribute("value", bikeSession.totalDistanceInKm.toFixed(2));
};
