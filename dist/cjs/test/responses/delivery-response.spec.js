"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const deliveryWebhookJson = require("./delivery-response.json");
describe('# Delivery response', () => {
    const response = deliveryWebhookJson;
    it('Message should be mapped properly', () => {
        (0, chai_1.expect)(deliveryWebhookJson.message).to.equal(response.message);
    });
    it('Data should be mapped properly', () => {
        (0, chai_1.expect)(deliveryWebhookJson.data.items).to.equal(response.data.items);
        (0, chai_1.expect)(deliveryWebhookJson.data.taxonomies).to.equal(response.data.taxonomies);
    });
});
//# sourceMappingURL=delivery-response.spec.js.map