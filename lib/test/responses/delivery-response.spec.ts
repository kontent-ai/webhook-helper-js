import { expect } from 'chai';
import * as deliveryWebhookJson from './delivery-response.json';
import { IWebhookDeliveryResponse } from '../../responses';

describe('# Delivery response', () => {

    const response = deliveryWebhookJson as IWebhookDeliveryResponse;

    it('Message should be mapped properly', () => {
        expect(deliveryWebhookJson.message).to.equal(response.message);
    });

    it('Data should be mapped properly', () => {

        expect(deliveryWebhookJson.data.items).to.equal(response.data.items);
        expect(deliveryWebhookJson.data.taxonomies).to.equal(response.data.taxonomies);
    });
});
