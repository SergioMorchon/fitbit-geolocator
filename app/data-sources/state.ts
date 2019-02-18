import { readFileSync, writeFileSync } from 'fs';
import reducers from '../reducers';
import { configureStore } from '../utils/store';

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

store.subscribe(action => {
	console.log(`Dispatch ${action.type}`);
	writeFileSync(SETTINGS_FILE_NAME, store.state, ENCODING);
});

export default store;
