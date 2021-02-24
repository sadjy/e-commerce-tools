export interface UserDto {
  userId: string; // public-key
  username: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  subscribedChannels: string[];
  registrationDate: string;
  verification?: VerificationDto;
  classification: UserClassification;
  description?: string;
}

export const enum UserClassification {
  'human' = 'human',
  'device' = 'device',
  'api' = 'api'
}

export interface VerificationDto {
  verified: boolean;
  verificationIssuer?: string; // public-key
  verificationDate?: string;
}

export interface User {
  userId: string; // public-key
  username: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  subscribedChannels: string[];
  verification?: Verification;
  registrationDate?: Date;
  classification: UserClassification;
  description?: string;
}

export interface Verification {
  verified: boolean;
  verificationIssuer?: string; // public-key
  verificationDate?: Date;
}