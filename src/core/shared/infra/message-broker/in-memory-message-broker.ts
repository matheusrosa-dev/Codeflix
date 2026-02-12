import { IMessageBroker } from "../../app/message-broker.interface";
import { IIntegrationEvent } from "../../domain/events/domain-event.interface";

export class InMemoryMessaging implements IMessageBroker {
	private handlers: {
		[key: string]: (event: IIntegrationEvent) => Promise<void>;
	} = {};

	async publishEvent(event: IIntegrationEvent) {
		const handler = this.handlers[event.constructor.name];
		if (handler) {
			await handler(event);
		}
	}
}
