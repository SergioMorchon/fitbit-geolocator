import {
  LATITUDE_SETTING_NAME,
  LONGITUDE_SETTING_NAME,
  CURRENT_LATITUDE_SETTING_NAME,
  CURRENT_LONGITUDE_SETTING_NAME
} from "../common/constants";

type WeirdSettingValue = {
  /**
   * This is the value, not a name.
   */
  name: string;
};

registerSettingsPage(({ settings, settingsStorage }) => (
  <Page>
    <Section
      title={
        <Text bold align="center">
          Target
        </Text>
      }
    >
      <Button
        label="Set to current position"
        onClick={() => {
          const latitude = settings[CURRENT_LATITUDE_SETTING_NAME];
          const longitude = settings[CURRENT_LONGITUDE_SETTING_NAME];
          if (!latitude || !longitude) {
            return;
          }

          settingsStorage.setItem(LATITUDE_SETTING_NAME, latitude);
          settingsStorage.setItem(LONGITUDE_SETTING_NAME, longitude);
        }}
      />
      <TextInput
        type="number"
        label="Latitude"
        value={settings[LATITUDE_SETTING_NAME] || ""}
        placeholder="latitude"
        // @ts-ignore
        onChange={({ name: value }: WeirdSettingValue) => {
          settingsStorage.setItem(LATITUDE_SETTING_NAME, value);
        }}
      />
      <TextInput
        type="number"
        label="Longitude"
        value={settings[LONGITUDE_SETTING_NAME] || ""}
        placeholder="longitude"
        // @ts-ignore
        onChange={({ name: value }: WeirdSettingValue) => {
          settingsStorage.setItem(LONGITUDE_SETTING_NAME, value);
        }}
      />
    </Section>
  </Page>
));
