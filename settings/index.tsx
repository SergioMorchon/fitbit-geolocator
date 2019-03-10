import { SET_LOCATION } from '../common/constants/action-types/messaging';
import {
	SETTINGS_KEY_ADD_LOCATION_LATITUDE,
	SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
	SETTINGS_KEY_ADD_LOCATION_NAME,
} from '../common/constants/settings-keys';
import { toNum } from '../common/utils/number';

const tryParseSettingsWTFValue = (valueJson: string) => {
	try {
		return JSON.parse(valueJson).name;
	} catch {
		return valueJson;
	}
};

const sendToWatch = (settingsStorage: LiveStorage) => {
	const nameSettingValue = settingsStorage.getItem(
		SETTINGS_KEY_ADD_LOCATION_NAME,
	);
	const latitudeSettingValue = settingsStorage.getItem(
		SETTINGS_KEY_ADD_LOCATION_LATITUDE,
	);
	const longitudeSettingValue = settingsStorage.getItem(
		SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
	);
	if (!nameSettingValue || !latitudeSettingValue || !longitudeSettingValue) {
		return;
	}

	settingsStorage.setItem(
		SET_LOCATION,
		JSON.stringify({
			latitude: toNum(tryParseSettingsWTFValue(latitudeSettingValue)),
			longitude: toNum(tryParseSettingsWTFValue(longitudeSettingValue)),
			name: tryParseSettingsWTFValue(nameSettingValue),
		}),
	);
};

registerSettingsPage(({ settingsStorage }) => (
	<Page>
		<Section title="Add location">
			<TextInput
				title="Name"
				type="text"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_NAME}
			/>
			<TextInput
				title="Latitude"
				type="number"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_LATITUDE}
			/>
			<TextInput
				title="Longitude"
				type="number"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_LONGITUDE}
			/>
			<Button
				label="Send to watch"
				onClick={() => sendToWatch(settingsStorage)}
			/>
		</Section>
	</Page>
));