import Bike from "./Bike.js";

class BikeSession {
  static UPDATE_THRESHOLD_IN_SECONDS = 2.0;

  static serialize = (bikeSession) => {
    return JSON.stringify({
      bike: Bike.serialize(bikeSession.bike),
      durationInSeconds: bikeSession.durationInSeconds,
      totalDistanceInKm: bikeSession.totalDistanceInKm,
      totalKCal: bikeSession.totalKCal,
      statistics: bikeSession.statistics,
    });
  };

  static deserialize = (string) => {
    const obj = JSON.parse(string);
    const bike = Bike.deserialize(obj.bike);

    const newSession = new BikeSession(bike);

    newSession.durationInSeconds = obj.durationInSeconds;
    newSession.totalDistanceInKm = obj.totalDistanceInKm;
    newSession.totalKCal = obj.totalKCal;
    newSession.statistics = obj.statistics;

    return newSession;
  };

  constructor(bike) {
    this.bike = bike;
    this.durationInSeconds = 0;
    this.durationInterval = null;
    this.lastTimeChecked = null;

    this.totalDistanceInKm = 0;
    this.totalKCal = 0;

    this.updateCounter = 0;

    this.statistics = {};
  }

  start = (callback) => {
    this.durationInterval = setInterval(() => {
      this.durationInSeconds += 1;

      this.updateSessionStats();

      if (typeof callback === "function") {
        callback();
      }
    }, 1000);
  };

  started = () => {
    return !!this.durationInterval;
  };

  stop = () => {
    clearInterval(this.durationInterval);
    this.durationInterval = null;
  };

  cadenceCallback = (cadence) => {
    this.bike.updateCadence(cadence);
  };

  resistanceCallback = (resistance) => {
    this.bike.updateResistance(resistance);
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

    this.updateCounter += 1;

    const currentPowerInWatts = this.bike.currentPowerInWatts();
    const currentSpeedInKmPerH = this.bike.currentSpeedInKmPerH();

    this.calculateStatisticsForValue("cadence", this.bike.cadence);
    this.calculateStatisticsForValue("resistance", this.bike.resistance);
    this.calculateStatisticsForValue("power", currentPowerInWatts);
    this.calculateStatisticsForValue("speed", currentSpeedInKmPerH);

    const timeElapsedInHours = timeElapsedInSeconds / 3600.0;

    this.totalDistanceInKm += currentSpeedInKmPerH * timeElapsedInHours;
    this.totalKCal += currentPowerInWatts * timeElapsedInHours * 3.6;

    this.lastTimeChecked = currentTimeInSeconds;
  };

  calculateStatisticsForValue = (key, newValue) => {
    if (!this.statistics[key]) {
      this.statistics[key] = {
        total: 0,
        max: 0,
        avg: 0,
        current: 0,
      };
    }

    this.statistics[key]["current"] = newValue;
    this.statistics[key]["total"] += newValue;

    if (newValue > this.statistics[key]["max"]) {
      this.statistics[key]["max"] = newValue;
    }

    this.statistics[key]["avg"] =
      this.statistics[key]["total"] / (this.updateCounter || 1);
  };

  getStatisticForValue = (key, statistic) => {
    if (!this.statistics[key]) {
      this.statistics[key] = {
        total: 0,
        max: 0,
        avg: 0,
        current: 0,
      };
    }

    return this.statistics[key][statistic];
  };

  getFormattedStatisticForValue = (key, statistic, toFixed = 2) => {
    return this.getStatisticForValue(key, statistic).toFixed(toFixed);
  };
}

export default BikeSession;
