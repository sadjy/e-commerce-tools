import { Request, Response } from 'express';
import { getConfig } from '../assets/config';
import { createIdentity } from '../did/create';
import { getData } from '../did/identities';
import { createVerifiablePresentation, verifyVerifiablePresentation } from '../did/identity';
import { signIdentity } from '../did/issuer';
import { verifyVC } from '../did/verify';

export const getIdentity = (req: Request, res: Response): void => {
  console.log('Get user', getData());
  res.send(getData());
};

export const createIdentityy = async (req: Request, res: Response) => {
  try {
    const identity = await Promise.resolve(createIdentity());
    res.send(identity);
  } catch (e) {
    res.send(e);
  }
};

export const signIdentityy = async (req: Request, res: Response) => {
  const body = req.body;

  // TODO refactor
  if (body == null || Object.keys(body).length === 0 || body.schema == '' || Object.keys(body.credentialData).length === 0) {
    console.error('NO VALID BODY!');
    res.sendStatus(400);
    return;
  }

  try {
    const verifiableCredential = await Promise.resolve(signIdentity(body.credentialData, body.schema));
    console.log('verifiable credential ', verifiableCredential);
    res.send(verifiableCredential);
  } catch (e) {
    res.send(e);
  }
};

export const verifyIdentityy = async (req: Request, res: Response) => {
  const body = req.body;

  // TODO refactor
  if (body == null || Object.keys(body).length === 0) {
    console.error('NO VALID BODY!');
    res.sendStatus(400);
    return;
  }
  try {
    const result = await Promise.resolve(verifyVC(JSON.stringify(body)));
    res.send(result);
  } catch (e) {
    res.send(e);
  }
};

export const createVerifiablePresentationn = async (req: Request, res: Response) => {
  const body = req.body;

  // TODO refactor
  if (body == null || Object.keys(body).length === 0) {
    console.error('NO VALID BODY!');
    res.sendStatus(400);
    return;
  }
  try {
    const result = await Promise.resolve(createVerifiablePresentation(getConfig().identity, [body], '4758235723'));
    res.send(result);
  } catch (e) {
    res.send(e);
  }
};

export const verifyVerifiablePresentationn = async (req: Request, res: Response) => {
  const body = req.body;

  // TODO refactor
  if (body == null || Object.keys(body).length === 0) {
    console.error('NO VALID BODY!');
    res.sendStatus(400);
    return;
  }
  try {
    const result = await Promise.resolve(verifyVerifiablePresentation(body, '4758235723'));
    res.send(result);
  } catch (e) {
    res.send(e);
  }
};
