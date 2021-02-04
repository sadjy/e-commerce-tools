import { IOTA_NODE_URL, DEVNET } from './config';
import * as IotaIdentity from 'iota-identity-wasm-test/node';

const verifyVC = (data: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    console.log('VERIFY VC', data);

    IotaIdentity.checkCredential(data, { network: DEVNET ? 'dev' : 'main', node: IOTA_NODE_URL })
      .then((validityResult: any) => {
        console.log('validity result', validityResult);

        console.log('Issuer: ', validityResult.issuer.document.id);
        console.log('VC Data: ', validityResult.credential.credentialSubject);
        console.log('Verified Credential verified to be', validityResult.verified);
        resolve(validityResult);
      })
      .catch((err: Error) => reject(err));
  });
};

//const result = verifyVC(JSON.stringify(employee));
//console.log('result: ', result);
export default verifyVC;
