import { signatureHelper } from '../';
import { expect } from 'chai';

const secret: string = '4INSnqn9ZA9pOWHpRySS+rsEqL6qHF3CIAftipJeuDc=';
const signature: string = 'eOgrznqBtHRbFzp1NZsirKAqe7d8SiPf2Dns+Ib6Aso=';
const payload: string = `{
  "data": {
    "items": [
      {
        "id": "f0e9e9fa-91e8-40d5-9527-b7e0ae51fc54",
        "codename": "christian_bale",
        "language": "en",
        "type": "actor"
      }
    ],
    "taxonomies": []
  },
  "message": {
    "id": "790b5fea-febe-4421-b8e7-d333afc60136",
    "project_id": "b259760f-81c5-013a-05e7-69efb4b954e5",
    "type": "content_item_variant",
    "operation": "publish",
    "api_name": "delivery_production",
    "created_timestamp": "2020-03-13T08:05:07.4044893Z",
    "webhook_url": "https://enxkdw8lvglue.x.pipedream.net/"
  }
}`;

const generatedHesh = signatureHelper.getHashFromString(payload, secret);
const isValid = signatureHelper.isValidSignatureFromString(payload, secret, signature);

describe('# Base signature', () => {

    it('Signature should be valid', () => {
        expect(isValid).to.equal(true);
    });

    it('Generated hash should match signature', () => {
        expect(generatedHesh).to.equal('eOgrznqBtHRbFzp1NZsirKAqe7d8SiPf2Dns+Ib6Aso=');
    });
});
