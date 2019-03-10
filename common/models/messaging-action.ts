import { MessagingActionType } from '../constants/action-types/messaging';
import { ILocationSlot } from './location-slot';

type SetLocationAction = [MessagingActionType, ILocationSlot];

export type MessageAction = SetLocationAction;
