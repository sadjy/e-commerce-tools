import * as IotaIdentity from 'iota-identity-wasm-test/node';
import { getConfig } from '../assets/config';
import { Identity } from './identity';

export const createIdentity = (): Promise<Identity> => {
  return new Promise<Identity>(async (resolve, reject) => {
    try {
      //Create Identity
      const { key, doc } = IotaIdentity.Doc.generateEd25519();
      doc.sign(key);

      console.log('getConfig().iotaNodeUrl', getConfig().iotaNodeUrl);
      console.log('getConfig().network', getConfig().network);

      //Publish Identity
      await IotaIdentity.publish(doc.toJSON(), { node: getConfig().iotaNodeUrl, network: getConfig().network });
      resolve({ didDoc: JSON.stringify(doc.toJSON()), publicAuthKey: key.public, privateAuthKey: key.private });
    } catch (err) {
      reject('Error during Identity Creation: ' + err);
    }
  });
};
