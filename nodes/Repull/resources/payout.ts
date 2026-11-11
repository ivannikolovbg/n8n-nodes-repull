import type { INodeProperties } from 'n8n-workflow';
import { listPagination, platformOptions, unwrapData } from '../shared/pagination';

const show = { resource: ['payout'] };

export const payoutDescription: INodeProperties[] = [
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
				action: 'Get many payouts',
				description: 'List payouts and other transactions from your channels',
				routing: { request: { method: 'GET', url: '/v1/transactions' }, ...unwrapData },
			},
		],
		default: 'getAll',
	},
	...listPagination('payout', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Payouts Only',
				name: 'isPayout',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'query', property: 'is_payout' } },
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: platformOptions,
				default: 'airbnb',
				routing: { send: { type: 'query', property: 'platform' } },
			},
		],
	},
];
