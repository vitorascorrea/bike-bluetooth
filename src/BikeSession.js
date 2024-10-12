class BikeSession {
  // Power approximation formula => Power = a * (b1 ^ cadence) * (b2 ^ resistance)
  static POWER_CADENCE_COEFFICIENT = 1.015343;
  static POWER_RESISTANCE_COEFFICIENT = 1.090112;
  static POWER_CONSTANT = 7.228958;

  constructor(bike) {
    this.bike = bike;
    this.lastTimeChecked = -1;
    this.currentSpeedInKmPerH = 0;
    this.totalDistanceInKm = 0;
    this.currentPowerInWatts = 0;
  }

  cadenceCallback = (cadence) => {
    this.bike.updateCadence(cadence);
    this.updateSessionStats();
  }

  resistanceCallback = (resistance) => {
    this.bike.updateResistance(resistance);
    this.updateSessionStats();
  }

  updateSessionStats = () => {
    if (this.lastTimeChecked === -1) {
      this.lastTimeChecked = Date.now() / 1000; // Convert to seconds
      return;
    }

    const currentTime = Date.now() / 1000; // Convert to seconds
    const timeElapsedInSeconds = currentTime - this.lastTimeChecked;

    if (timeElapsedInSeconds < 2.0) {
      return;
    }

    // Cadence is in RPM
    this.currentSpeedInKmPerH =
      (this.bike.cadence * this.bike.wheelCircumference * 60.0) / 1000.0;

    this.totalDistanceInKm +=
      this.currentSpeedInKmPerH * (timeElapsedInSeconds / 3600.0);

    if (this.bike.cadence > 0 && this.bike.resistance > 0) {
      this.currentPowerInWatts =
        Math.pow(BikeSession.POWER_CADENCE_COEFFICIENT, this.bike.cadence) *
        Math.pow(
          BikeSession.POWER_RESISTANCE_COEFFICIENT,
          this.bike.resistance
        ) *
        BikeSession.POWER_CONSTANT;
    } else {
      this.currentPowerInWatts = 0;
    }

    console.log(
      `Speed: ${this.currentSpeedInKmPerH.toFixed(
        2
      )} km/h, Total km: ${this.totalDistanceInKm.toFixed(
        2
      )}, Power watts: ${this.currentPowerInWatts.toFixed(2)}`
    );

    this.lastTimeChecked = currentTime;
  }
}

export default BikeSession