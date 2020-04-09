import { gettext } from 'i18n';
import {
	SETTINGS_KEY_ADD_LOCATION_DETAILS,
	SETTINGS_KEY_ADD_LOCATION_LATITUDE,
	SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
	SETTINGS_KEY_ADD_LOCATION_NAME,
	SET_LOCATION,
} from '../companion/settings-keys';

const sendToWatch = (settingsStorage: LiveStorage) => {
	const name = settingsStorage.getItem(SETTINGS_KEY_ADD_LOCATION_NAME);
	const latitudeSettingValue = settingsStorage.getItem(
		SETTINGS_KEY_ADD_LOCATION_LATITUDE,
	);
	const longitudeSettingValue = settingsStorage.getItem(
		SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
	);
	if (
		!name ||
		latitudeSettingValue === null ||
		longitudeSettingValue === null
	) {
		return;
	}

	const details =
		settingsStorage.getItem(SETTINGS_KEY_ADD_LOCATION_DETAILS) || '';

	settingsStorage.setItem(
		SET_LOCATION,
		JSON.stringify({
			details,
			latitude: Number(latitudeSettingValue),
			longitude: Number(longitudeSettingValue),
			name,
		}),
	);
};

registerSettingsPage(({ settingsStorage }) => (
	<Page>
		<Section title={gettext('add-location')}>
			<TextInput
				title={gettext('name')}
				type="text"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_NAME}
				useSimpleValue
			/>
			<TextInput
				title={gettext('latitude')}
				type="number"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_LATITUDE}
				useSimpleValue
			/>
			<TextInput
				title={gettext('longitude')}
				type="number"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_LONGITUDE}
				useSimpleValue
			/>
			<TextInput
				title={gettext('details')}
				type="text"
				settingsKey={SETTINGS_KEY_ADD_LOCATION_DETAILS}
				useSimpleValue
			/>
			<Button
				label={gettext('send-to-watch')}
				onClick={() => sendToWatch(settingsStorage)}
			/>
		</Section>
	</Page>
));
