export const organization = {
  SubjectDID: 'did:iota:32p7oBo2cjTYBpwm6A4JpcYuSQTyHaew5An8NPL9BKXP',
  Name: 'Charles Gonzales',
  Type: 'PowerChek MERS-CoV',
  Location: 'UCLH',
  Date: '03-01-2021',
  Result: 'Negative'
};

export const employee = {
  SubjectDID: 'did:iota:32p7oBo2cjTYBpwm6A4JpcYuSQTyHaew5An8NPL9BKXP',
  Name: 'Charles Gonzales',
  Type: 'PowerChek MERS-CoV',
  Location: 'UCLH',
  Date: '03-01-2021',
  Result: 'Negative'
};

export var IDENTITY: any = null;
export var VERIFIABLE_CREDENTIAL: any = null;
export var VERIFIABLE_PRESENTATION: any = null;

export function setIdentity(identity: any): void {
  IDENTITY = identity;
}

export function setVerifiableCredential(credential: any): void {
  VERIFIABLE_CREDENTIAL = credential;
}

export function setVerifiablePresentation(presentation: any): void {
  VERIFIABLE_PRESENTATION = presentation;
}

export function getData() {
  return {
    identity: IDENTITY,
    verifiable_credentiaL: VERIFIABLE_CREDENTIAL,
    verifiable_presentation: VERIFIABLE_PRESENTATION
  };
}
