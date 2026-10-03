import type { INodeProperties } from 'n8n-workflow';
import { listPagination, unwrapData } from '../shared/pagination';

const show = { resource: ['property'] };

export const propertyDescription: INodeProperties[] = [
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
				action: 'Get many properties',
				description: 'List the properties in your connected accounts',
				routing: { request: { method: 'GET', url: '/v1/properties' }, ...unwrapData },
			},
		],
		default: 'getAll',
	},
	...listPagination('property', 'getAll'),
];
