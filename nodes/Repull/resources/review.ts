import type { INodeProperties } from 'n8n-workflow';
import { listPagination, platformOptions, unwrapData } from '../shared/pagination';

const show = { resource: ['review'] };

export const reviewDescription: INodeProperties[] = [
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
				action: 'Get many reviews',
				description: 'List reviews across Airbnb, Booking.com and Vrbo',
				routing: { request: { method: 'GET', url: '/v1/reviews' }, ...unwrapData },
			},
			{
				name: 'Reply',
				value: 'reply',
				action: 'Reply to a review',
				description:
					'Post the public host response. Airbnb needs a full-access connection; Booking.com and Vrbo replies are in testing.',
				routing: { request: { method: 'POST', url: '=/v1/reviews/{{$parameter.reviewId}}/reply' } },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Review ID',
		name: 'reviewId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['reply'] } },
	},
	{
		displayName: 'Reply',
		name: 'replyText',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['reply'] } },
		routing: { send: { type: 'body', property: 'message' } },
	},
	...listPagination('review', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Listing ID',
				name: 'listingId',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'listingId' } },
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: platformOptions,
				default: 'airbnb',
				routing: { send: { type: 'query', property: 'platform' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Responded', value: 'responded' },
					{ name: 'Unanswered', value: 'unanswered' },
				],
				default: 'unanswered',
				routing: { send: { type: 'query', property: 'status' } },
			},
		],
	},
];
