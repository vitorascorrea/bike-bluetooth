class BikeSession {
  static UPDATE_THRESHOLD_IN_SECONDS = 2.0;

  constructor(bike) {
    this.bike = bike;
    this.lastTimeChecked = null;
    this.totalDistanceInKm = 0;

    this.maxCadence = 0;
    this.maxResistance = 0;
    this.maxSpeedInKmPerH = 0;
    this.maxPowerInWatts = 0;
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

    this.totalDistanceInKm +=
      currentSpeedInKmPerH * (timeElapsedInSeconds / 3600.0);
    this.lastTimeChecked = currentTimeInSeconds;
  };
}

export default BikeSession;
