import BaseConnector from "./BaseConnector.js";

// The Echelon Services
// from https://github.com/snowzach/echbt/blob/892d98153adfd2decb86df833c2e897ec56715a7/device.h

// The UUID of the device
const DEVICE_UUID = "0bf669f0-45f2-11e7-9598-0800200c9a66";
// The UUID of the sensor service
const CONNECT_UUID = "0bf669f1-45f2-11e7-9598-0800200c9a66";
// The UUID of the writer characteristic
const WRITE_UUID = "0bf669f2-45f2-11e7-9598-0800200c9a66";
// The UUID of the sensor characteristic
const SENSOR_UUID = "0bf669f4-45f2-11e7-9598-0800200c9a66";
// The message to send to the writer to allow sensor notifications
const SENSOR_ENABLE_NOTIFICATIONS_MESSAGE = new Uint8Array([
  0xf0, 0xb0, 0x01, 0x01, 0xa2,
]);
// The hexadecimal value for cadence change event
const CADENCE_EVENT = 0xd1;
// The hexadecimal value for resistance change event
const RESISTANCE_EVENT = 0xd2;

class EchelonDeviceConnector extends BaseConnector {
  constructor(cadenceCallback, resistanceCallback) {
    super(cadenceCallback, resistanceCallback);

    this.device = null;
    this.sensorCharacteristicListener = null;
  }

  active = () => {
    return this.device?.gatt.connected;
  };

  startListening = async () => {
    if (!this.device) {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [DEVICE_UUID],
          },
        ],
        optionalServices: [CONNECT_UUID],
      });
    }

    const server = await this.device.gatt.connect();
    const service = await server.getPrimaryService(CONNECT_UUID);
    const writeCharacteristic = await service.getCharacteristic(WRITE_UUID);

    await writeCharacteristic.writeValue(SENSOR_ENABLE_NOTIFICATIONS_MESSAGE);

    const sensorCharacteristic = await service.getCharacteristic(SENSOR_UUID);

    await sensorCharacteristic.startNotifications();

    this.sensorCharacteristicListener = sensorCharacteristic.addEventListener(
      "characteristicvaluechanged",
      this.#handleCharacteristicValueChanged
    );
  };

  stopListening = async () => {
    if (!this.device || !this.active()) {
      return;
    }

    await this.device.gatt.disconnect();
    removeEventListener(
      "characteristicvaluechanged",
      this.sensorCharacteristicListener
    );
  };

  #handleCharacteristicValueChanged = (event) => {
    let data = event.target.value;

    if (!data.buffer) {
      data = new DataView(data);
    }

    const eventType = data.getUint8(1);

    if (eventType === CADENCE_EVENT) {
      // Cadence is stored in bytes 9 and 10, so we can get both this way
      const cadence = data.getUint16(9);
      this.cadenceCallback(cadence);
    }

    if (eventType === RESISTANCE_EVENT) {
      this.resistanceCallback(data.getUint8(3));
    }
  };
}

export default EchelonDeviceConnector;
