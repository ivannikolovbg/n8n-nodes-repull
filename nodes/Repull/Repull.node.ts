import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { calendarDescription } from './resources/calendar';
import { conversationDescription } from './resources/conversation';
import { guestDescription } from './resources/guest';
import { payoutDescription } from './resources/payout';
import { propertyDescription } from './resources/property';
import { reservationDescription } from './resources/reservation';
import { reviewDescription } from './resources/review';

export class Repull implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Repull',
		name: 'repull',
		icon: { light: 'file:../../icons/repull.svg', dark: 'file:../../icons/repull.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Work with your Airbnb, Booking.com and Vrbo accounts through Repull: reservations, booking summaries, guest messages, reviews, payouts and calendars',
		defaults: { name: 'Repull' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'repullApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.repull.dev',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Calendar', value: 'calendar' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Guest', value: 'guest' },
					{ name: 'Payout', value: 'payout' },
					{ name: 'Property', value: 'property' },
					{ name: 'Reservation', value: 'reservation' },
					{ name: 'Review', value: 'review' },
				],
				default: 'reservation',
			},
			...calendarDescription,
			...conversationDescription,
			...guestDescription,
			...payoutDescription,
			...propertyDescription,
			...reservationDescription,
			...reviewDescription,
		],
	};
}
