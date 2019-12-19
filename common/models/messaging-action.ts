import { MessagingActionType } from '../constants/action-types/messaging';
import { LocationSlot } from './location-slot';

type SetLocationAction = [MessagingActionType, LocationSlot];

export type MessageAction = SetLocationAction;
