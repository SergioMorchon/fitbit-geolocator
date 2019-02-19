import { readFileSync, writeFileSync } from 'fs';
import { configureStore } from 'reduced-state';
import reducers from '../reducers';

const SETTINGS_FILE_NAME = 'storage';
const ENCODING = 'cbor';

const tryRestore = (): any => {
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING);
	} catch (e) {
		return undefined;
	}
};

const store = configureStore({
	initialState: tryRestore(),
	reducer: reducers,
});

store.subscribe(() => {
	writeFileSync(SETTINGS_FILE_NAME, store.state, ENCODING);
});

export default store;
