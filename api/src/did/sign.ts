import { SchemaNames } from './schemas';
import * as IotaIdentity from 'iota-identity-wasm-test/node';

import type { Identity } from './identity';
import { getConfig } from '../assets/config';

const createVerifiableCredential = (issuer: Identity, schemaName: SchemaNames, data: any): Promise<IotaIdentity.VerifiableCredential> => {
  return new Promise<IotaIdentity.VerifiableCredential>((resolve, reject) => {
    const IssuerDidDoc = IotaIdentity.Doc.fromJSON(JSON.parse(issuer.didDoc));

    const credentialData = {
      id: IssuerDidDoc.id,
      ...data
    };

    //Takes IssuerDoc, IssuerKey, CredentialSchemaURL, CredentialSchemaName, Data
    const vc = new IotaIdentity.VerifiableCredential(
      IssuerDidDoc,
      IotaIdentity.Key.fromBase58(issuer.publicAuthKey, issuer.privateAuthKey),
      credentialData,
      schemaName
    );
    resolve(vc.toJSON());
  });
};

export const signIdentity = (data: any, schema: SchemaNames) => {
  const identity = getConfig().identity;

  console.info('using identity', identity);
  return createVerifiableCredential(identity, schema, data);
};
