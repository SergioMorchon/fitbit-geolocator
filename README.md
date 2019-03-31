# Geolocator

[![Build Status](https://travis-ci.com/SergioMorchon/fitbit-geolocator.svg?branch=master)](https://travis-ci.com/SergioMorchon/fitbit-geolocator)

**[![Icon](./resources/icon.png) Download it!](https://gam.fitbit.com/gallery/app/6aeb6da0-dfb9-40a5-9fcb-160a5b5e3be5)**

## Developers

You can open this app to add and navigate to a location:

```javascript
import { launchApp } from 'system';

const args = {
	name: 'Some name',
	coords: [48.13194, 11.54944],
};
const uuid = '6aeb6da0-dfb9-40a5-9fcb-160a5b5e3be5'; // from package.json
launchApp(uuid, args);
```

## Documentation

- [English](./doc/en.md).
- [French](./doc/fr.md).
- [Spanish](./doc/es.md).

## Screenshots

### Empty case

![Empty case](./doc/ionic/en/0-list-empty-case.png)

### New location

![New location](./doc/ionic/en/1-new-location.png)

### List

![List](./doc/ionic/en/2-list-filled.png)

### Details

![Details](./doc/ionic/en/3-details.png)

### Navigation

![Navigation](./doc/ionic/en/4-navigation.png)
