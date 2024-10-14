import Bike from "./Bike.js";

class BikeSession {
  static UPDATE_THRESHOLD_IN_SECONDS = 2.0;

  static serialize = (bikeSession) => {
    return JSON.stringify({
      bike: Bike.serialize(bikeSession.bike),
      durationInSeconds: bikeSession.durationInSeconds,
      totalDistanceInKm: bikeSession.totalDistanceInKm,
      totalKCal: bikeSession.totalKCal,
      maxCadence: bikeSession.maxCadence,
      maxResistance: bikeSession.maxResistance,
      maxSpeedInKmPerH: bikeSession.maxSpeedInKmPerH,
      maxPowerInWatts: bikeSession.maxPowerInWatts,
    });
  };

  static deserialize = (string) => {
    const obj = JSON.parse(string);
    const bike = Bike.deserialize(obj.bike);

    const newSession = new BikeSession(bike);

    newSession.durationInSeconds = obj.durationInSeconds;
    newSession.totalDistanceInKm = obj.totalDistanceInKm;
    newSession.totalKCal = obj.totalKCal;
    newSession.maxCadence = obj.maxCadence;
    newSession.maxResistance = obj.maxResistance;
    newSession.maxSpeedInKmPerH = obj.maxSpeedInKmPerH;
    newSession.maxPowerInWatts = obj.maxPowerInWatts;

    return newSession;
  };

  constructor(bike) {
    this.bike = bike;
    this.durationInSeconds = 0;
    this.durationInterval = null;
    this.lastTimeChecked = null;

    this.totalDistanceInKm = 0;
    this.totalKCal = 0

    this.maxCadence = 0;
    this.maxResistance = 0;
    this.maxSpeedInKmPerH = 0;
    this.maxPowerInWatts = 0;
  }

  start = (callback) => {
    this.durationInterval = setInterval(() => {
      this.durationInSeconds += 1;

      if (typeof callback === "function") {
        callback();
      }
    }, 1000);
  }

  started = () => {
    return !!this.durationInterval;
  }

  stop = () => {
    clearInterval(this.durationInterval);
    this.durationInterval = null;
  }

  cadenceCallback = (cadence) => {
    this.bike.updateCadence(cadence);
    this.updateSessionStats();
  };

  resistanceCallback = (resistance) => {
    this.bike.updateResistance(resistance);
    this.updateSessionStats();
  };

  updateSessionStats = () => {
    if (this.lastTimeChecked === null) {
      this.lastTimeChecked = Date.now() / 1000;
      return;
    }

    const currentTimeInSeconds = Date.now() / 1000;
    const timeElapsedInSeconds = currentTimeInSeconds - this.lastTimeChecked;

    if (timeElapsedInSeconds < this.UPDATE_THRESHOLD_IN_SECONDS) {
      return;
    }

    if (this.maxCadence < this.bike.cadence) {
      this.maxCadence = this.bike.cadence;
    }

    if (this.maxResistance < this.bike.resistance) {
      this.maxResistance = this.bike.resistance;
    }

    const currentPowerInWatts = this.bike.currentPowerInWatts();

    if (this.maxPowerInWatts < currentPowerInWatts) {
      this.maxPowerInWatts = currentPowerInWatts;
    }

    const currentSpeedInKmPerH = this.bike.currentSpeedInKmPerH();

    if (this.maxSpeedInKmPerH < currentSpeedInKmPerH) {
      this.maxSpeedInKmPerH = currentSpeedInKmPerH;
    }

    const timeElapsedInHours = timeElapsedInSeconds / 3600.0;;

    this.totalDistanceInKm += currentSpeedInKmPerH * timeElapsedInHours;
    this.totalKCal += currentPowerInWatts * timeElapsedInHours * 3.6;

    this.lastTimeChecked = currentTimeInSeconds;
  };
}

export default BikeSession;
