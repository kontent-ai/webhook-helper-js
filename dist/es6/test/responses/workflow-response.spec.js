import { expect } from 'chai';
import * as workflowWebhookJson from './workflow-response.json';
describe('# Workflow response', () => {
    const response = workflowWebhookJson;
    it('Message should be mapped properly', () => {
        expect(workflowWebhookJson.message).to.equal(response.message);
    });
    it('Data should be mapped properly', () => {
        expect(workflowWebhookJson.data.items).to.equal(response.data.items);
    });
});
//# sourceMappingURL=workflow-response.spec.js.map