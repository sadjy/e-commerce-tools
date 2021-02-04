import { Request, Response } from 'express';
import { createIdentity } from '../did/create';
import { employee, getData } from '../did/identities';
import { signIdentity } from '../did/sign';
import verifyVC from '../did/verify';

export const getIdentity = (req: Request, res: Response): void => {
  console.log('Get user', getData());
  res.send(getData());
};

export const createIdentityy = async (req: Request, res: Response) => {
  // TODO dynamic data and schema!
  const identity = await Promise.resolve(createIdentity());
  res.send(identity);
};

export const signIdentityy = async (req: Request, res: Response) => {
  const body = req.body;

  // TODO refactor
  if (body == null || Object.keys(body).length === 0 || body.schema == '' || Object.keys(body.credentialData).length === 0) {
    console.error('NO VALID BODY!');
    res.sendStatus(400);
    return;
  } else {
    console.log('BODY:', body);
  }

  // TODO dynamic data and schema!
  const verifiableCredential = Promise.resolve(signIdentity(body.credentialData, body.schema));
  console.log('verifiable credential ', verifiableCredential);

  res.send(verifiableCredential);
};

export const verifyIdentityy = (req: Request, res: Response): void => {
  console.log('Delete user', verifyVC);
  const result = verifyVC(JSON.stringify(employee));
  result.then((s) => console.log('s', s));
  res.send('sign identitity!');
};

export const verifiablePresentation = (req: Request, res: Response): void => {
  console.log('Delete user', verifyVC);
  // const result = createVerifiablePresentation(IDENTITY);
  // result.then((s) => console.log('s', s));
  res.send('TODO create verifiable presentation!');
};
