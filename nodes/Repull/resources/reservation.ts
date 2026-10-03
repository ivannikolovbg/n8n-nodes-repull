import type { INodeProperties } from 'n8n-workflow';
import { listPagination, platformOptions, unwrapData } from '../shared/pagination';

const show = { resource: ['reservation'] };

export const reservationDescription: INodeProperties[] = [
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
				action: 'Get a reservation',
				description: 'Get one reservation with guest, dates and pricing',
				routing: { request: { method: 'GET', url: '=/v1/reservations/{{$parameter.reservationId}}' } },
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many reservations',
				description: 'List reservations across Airbnb, Booking.com, Vrbo and connected PMSs',
				routing: { request: { method: 'GET', url: '/v1/reservations' }, ...unwrapData },
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Reservation ID',
		name: 'reservationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['get'] } },
	},
	...listPagination('reservation', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Check-In After',
				name: 'checkInAfter',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'check_in_after', value: '={{$value.slice(0, 10)}}' } },
			},
			{
				displayName: 'Check-In Before',
				name: 'checkInBefore',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'check_in_before', value: '={{$value.slice(0, 10)}}' } },
			},
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
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Confirmed', value: 'confirmed' },
					{ name: 'Pending', value: 'pending' },
				],
				default: 'confirmed',
				routing: { send: { type: 'query', property: 'status' } },
			},
			{
				displayName: 'Updated Since',
				name: 'updatedSince',
				type: 'dateTime',
				default: '',
				description: 'Only reservations changed at or after this time',
				routing: { send: { type: 'query', property: 'updated_since' } },
			},
		],
	},
];
