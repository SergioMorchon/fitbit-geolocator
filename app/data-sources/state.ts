import { me } from 'appbit';
import { readFileSync, writeFileSync } from 'fs';
import { configureStore } from 'reduced-state';
import { memory } from 'system';
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

me.addEventListener('unload', () => {
	writeFileSync(SETTINGS_FILE_NAME, store.state, ENCODING);
});

const originalDispatch = store.dispatch;
store.dispatch = (action: any) => {
	// tslint:disable-next-line: no-console
	console.log(`Action: ${action.type}`);
	const {
		js: { used, total },
	} = memory;
	// tslint:disable-next-line: no-console
	console.log(
		`Memory usage: ${Number((used * 100) / total).toFixed(
			2,
		)}% (${used}/${total})`,
	);
	originalDispatch(action);
};

export default store;
