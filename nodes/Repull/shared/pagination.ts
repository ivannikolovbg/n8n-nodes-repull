import type { INodeProperties } from 'n8n-workflow';

/**
 * "Return All" + "Limit" for a Repull list endpoint.
 *
 * Every Repull list returns `{ data: [...], pagination: { nextCursor, hasMore } }`.
 * Items are unwrapped from `data`; "Return All" follows `nextCursor` until
 * `hasMore` is false.
 */
export function listPagination(resource: string, operation: string): INodeProperties[] {
	const show = { resource: [resource], operation: [operation] };
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: {
					paginate: '={{ $value }}',
					type: 'query',
					property: 'limit',
					value: '100',
				},
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							continue: '={{ !!$response.body?.pagination?.hasMore }}',
							request: {
								qs: {
									cursor: '={{ $response.body?.pagination?.nextCursor }}',
								},
							},
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: { show: { ...show, returnAll: [false] } },
			typeOptions: { minValue: 1, maxValue: 100 },
			default: 50,
			description: 'Max number of results to return',
			routing: {
				send: { type: 'query', property: 'limit' },
				output: { maxResults: '={{$value}}' },
			},
		},
	];
}

/** Unwrap `{ data: [...] }` into one n8n item per element. */
export const unwrapData = {
	output: {
		postReceive: [
			{
				type: 'rootProperty' as const,
				properties: { property: 'data' },
			},
		],
	},
};

export const platformOptions = [
	{ name: 'Airbnb', value: 'airbnb' },
	{ name: 'Booking.com', value: 'booking' },
	{ name: 'Vrbo', value: 'vrbo' },
];
