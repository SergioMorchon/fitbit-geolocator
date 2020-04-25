import { gettext } from 'i18n';
import {
	SETTINGS_KEY_ADD_LOCATION_DETAILS,
	SETTINGS_KEY_ADD_LOCATION_LATITUDE,
	SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
	SETTINGS_KEY_ADD_LOCATION_NAME,
	SET_LOCATION,
} from '../companion/settings-keys';

import type { Location } from '../app/state';

const getLocation = (settingsStorage: LiveStorage): Location | null => {
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
		return null;
	}

	const details =
		settingsStorage.getItem(SETTINGS_KEY_ADD_LOCATION_DETAILS) || '';

	return {
		name,
		details,
		coordinates: {
			latitude: Number(latitudeSettingValue),
			longitude: Number(longitudeSettingValue),
		},
		timestamp: Date.now(),
	};
};

registerSettingsPage(({ settingsStorage }) => {
	const location = getLocation(settingsStorage);
	return (
		<Page>
			<Section title={gettext('add-location')}>
				<TextInput
					label={gettext('name')}
					placeholder={gettext('name')}
					type="text"
					settingsKey={SETTINGS_KEY_ADD_LOCATION_NAME}
					useSimpleValue
				/>
				<TextInput
					label={gettext('latitude')}
					placeholder={gettext('latitude')}
					type="number"
					settingsKey={SETTINGS_KEY_ADD_LOCATION_LATITUDE}
					useSimpleValue
				/>
				<TextInput
					label={gettext('longitude')}
					placeholder={gettext('longitude')}
					type="number"
					settingsKey={SETTINGS_KEY_ADD_LOCATION_LONGITUDE}
					useSimpleValue
				/>
				<TextInput
					label={gettext('details')}
					placeholder={gettext('details')}
					type="text"
					settingsKey={SETTINGS_KEY_ADD_LOCATION_DETAILS}
					useSimpleValue
				/>
				{!!location && (
					<Button
						label={gettext('send-to-watch')}
						onClick={() =>
							settingsStorage.setItem(SET_LOCATION, JSON.stringify(location))
						}
					/>
				)}
			</Section>
		</Page>
	);
});
