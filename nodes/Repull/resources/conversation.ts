import type { INodeProperties } from 'n8n-workflow';
import { listPagination, unwrapData } from '../shared/pagination';

const show = { resource: ['conversation'] };

export const conversationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many conversations',
				description: 'List guest conversations across every channel',
				routing: { request: { method: 'GET', url: '/v1/conversations' }, ...unwrapData },
			},
			{
				name: 'Get Messages',
				value: 'getMessages',
				action: 'Get messages in a conversation',
				description: 'List the messages in one conversation, oldest first',
				routing: {
					request: { method: 'GET', url: '=/v1/conversations/{{$parameter.conversationId}}/messages' },
					...unwrapData,
				},
			},
			{
				name: 'Send Message',
				value: 'sendMessage',
				action: 'Send a message to the guest',
				description: 'Reply to the guest on the channel the conversation is on',
				routing: {
					request: { method: 'POST', url: '=/v1/conversations/{{$parameter.conversationId}}/messages' },
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['getMessages', 'sendMessage'] } },
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		description: 'The text to send the guest (up to 4,000 characters)',
		displayOptions: { show: { ...show, operation: ['sendMessage'] } },
		routing: { send: { type: 'body', property: 'message' } },
	},
	...listPagination('conversation', 'getAll'),
	...listPagination('conversation', 'getMessages'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'Airbnb', value: 'airbnb' },
					{ name: 'Booking.com', value: 'booking' },
					{ name: 'Email', value: 'email' },
					{ name: 'Vrbo', value: 'vrbo' },
					{ name: 'Website', value: 'website' },
				],
				default: 'airbnb',
				routing: { send: { type: 'query', property: 'platform' } },
			},
		],
	},
];
