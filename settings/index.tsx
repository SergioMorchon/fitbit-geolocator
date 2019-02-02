function settingsComponent() {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            App Settings
          </Text>
        }
      >
        Settings
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
