# Bike Bluetooth

## About
Fun project where my goal is to create a functional app that will _help me increase my time on my home exercise bike_. I'm learning about:

- Bluetooth LE devices and their protocols
- [Experimental bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [No build javascript & css](https://world.hey.com/dhh/you-can-t-get-faster-than-no-build-7a44131c)
- CI through Github Actions

Future plans include storing workout sessions client-side, gamifying the experience and adding support for other stationary bikes.

## Running the project
To install the project:

```bash
git clone https://github.com/vitorascorrea/bike-bluetooth.git
cd bike-bluetooth
npm install
```

To run the project:
```bash
npm start
```

To run tests:
```bash
npm test
```

## Supported bikes

Currently there are two implemented connectors: 
- Echelon Bike Connector, that currently works for the Echelon Connect Sport bike (may work for other models)
- Debug connector, where you can change the cadence and resistance by using the up/down and left/right arrow keys, respectively


## License
This project is for learning purposes and is licensed under the MIT License. You can view the full text of the license [here](https://opensource.org/license/MIT).
