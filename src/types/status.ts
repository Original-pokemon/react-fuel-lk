import { Status } from '#root/const';

export type StatusType = (typeof Status)[keyof typeof Status];
