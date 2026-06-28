export type ExpectationType = 'Action' | 'Event' | 'Speak' | 'Snapshot' | 'State';

export interface VerificationExpectation {
  type: ExpectationType;
  payload?: any;
  optional?: boolean;
}