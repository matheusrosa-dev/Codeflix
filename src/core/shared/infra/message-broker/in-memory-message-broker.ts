import { IMessageBroker } from "../../app/message-broker.interface";
import { IDomainEvent } from "../../domain/events/domain-event.interface";

export class InMemoryMessaging implements IMessageBroker {
	private handlers: { [key: string]: (event: IDomainEvent) => Promise<void> } =
		{};

	async publishEvent(event: IDomainEvent) {
		const handler = this.handlers[event.constructor.name];
		if (handler) {
			await handler(event);
		}
	}
}
