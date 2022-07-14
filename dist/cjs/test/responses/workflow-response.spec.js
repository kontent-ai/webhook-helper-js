"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const workflowWebhookJson = require("./workflow-response.json");
describe('# Workflow response', () => {
    const response = workflowWebhookJson;
    it('Message should be mapped properly', () => {
        (0, chai_1.expect)(workflowWebhookJson.message).to.equal(response.message);
    });
    it('Data should be mapped properly', () => {
        (0, chai_1.expect)(workflowWebhookJson.data.items).to.equal(response.data.items);
    });
});
//# sourceMappingURL=workflow-response.spec.js.map