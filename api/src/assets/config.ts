import { Identity } from '../did/identity';

// TODO this will be generated before first startup via command line and then loaded via env var
export var serverIdentity: Identity = {
  didDoc:
    '{"@context":"https://www.w3.org/ns/did/v1","id":"did:iota:3TFJMYDF4FCQyMB8E992bGrTeisyioBx4ek54BVUJAeY","created":"2021-02-03T16:18:09Z","updated":"2021-02-03T16:18:09Z","publicKey":[{"id":"did:iota:3TFJMYDF4FCQyMB8E992bGrTeisyioBx4ek54BVUJAeY#authentication","controller":"did:iota:3TFJMYDF4FCQyMB8E992bGrTeisyioBx4ek54BVUJAeY","type":"Ed25519VerificationKey2018","publicKeyBase58":"7ftz2XmuzQ2VJE2oXU9aemirrhnHVrFBNgusS4vKSNvC"}],"authentication":["did:iota:3TFJMYDF4FCQyMB8E992bGrTeisyioBx4ek54BVUJAeY#authentication"],"proof":{"type":"JcsEd25519Signature2020","verificationMethod":"did:iota:3TFJMYDF4FCQyMB8E992bGrTeisyioBx4ek54BVUJAeY#authentication","created":"2021-02-03T16:18:09Z","signatureValue":"26ZZCL9Zxgb56cjCPxL1AXcPJi8sAmKDDd1BKnhcM1xpAMxGKxVdCQa1vxntWTMe5WzyRMCSEYP4VFNopSWfVXFtKELuQJYAVW1T4By2f25ZTMpXzdjq6wC9A1TE14r1iBtx"}}',
  publicAuthKey: '7ftz2XmuzQ2VJE2oXU9aemirrhnHVrFBNgusS4vKSNvC',
  privateAuthKey: '532ksyjkgzPP6tSY43XkDykh19xwhfz6buPryjgXFAGS'
};

export interface IConfig {
  network: 'dev' | 'main';
  iotaNodeUrl: string;
  identity: Identity;
}

export function getConfig(): IConfig {
  const devnet: boolean = JSON.parse(process.env.DEVNET);

  const network = devnet ? 'dev' : 'main';
  const iotaNodeUrl = devnet ? process.env.IOTA_NODE_URL_DEVNET : process.env.IOTA_NODE_URL_MAINNET;
  return {
    iotaNodeUrl,
    network,
    identity: serverIdentity
  };
}
