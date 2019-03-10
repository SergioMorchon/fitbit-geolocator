import { peerSocket } from 'messaging';
import { SET_LOCATION } from '../../common/constants/action-types/messaging';
import { MessageAction } from '../../common/models/messaging-action';
import store from '../data-sources/state';
import { setLocationSlot } from './location-slots';

peerSocket.addEventListener('message', ({ data }: { data: MessageAction }) => {
	const [action, payload] = data;
	switch (action) {
		case SET_LOCATION: {
			store.dispatch(setLocationSlot(payload));
		}
	}
});
