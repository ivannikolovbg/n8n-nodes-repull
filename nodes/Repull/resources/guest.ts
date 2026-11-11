import type { INodeProperties } from 'n8n-workflow';
import { listPagination, unwrapData } from '../shared/pagination';

const show = { resource: ['guest'] };

export const guestDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a guest',
				description: 'Get one guest with contacts and stays',
				routing: { request: { method: 'GET', url: '=/v1/guests/{{$parameter.guestId}}' } },
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many guests',
				description: 'List or search guests by name, email or phone',
				routing: { request: { method: 'GET', url: '/v1/guests' }, ...unwrapData },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Guest ID',
		name: 'guestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['get'] } },
	},
	...listPagination('guest', 'getAll'),
	{
		displayName: 'Search',
		name: 'q',
		type: 'string',
		default: '',
		description: 'Name, email or phone',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'query', property: 'q' } },
	},
];
