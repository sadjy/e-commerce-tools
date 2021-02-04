import { getConfig } from '../assets/config';
import { SchemaNames } from './schemas';
import { createVerifiableCredential } from './verifiable-credential';

export const signIdentity = (data: any, schema: SchemaNames) => {
  const identity = getConfig().identity;

  console.info('using identity', identity);
  return createVerifiableCredential(identity, schema, data);
};
