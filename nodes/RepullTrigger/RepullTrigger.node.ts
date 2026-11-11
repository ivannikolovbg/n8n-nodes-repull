import { createHmac, timingSafeEqual } from 'crypto';
import {
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IHookFunctions,
	type IHttpRequestMethods,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

const API = 'https://api.repull.dev';

/** Deliveries older than this are rejected, so a captured request can't be replayed later. */
const MAX_SIGNATURE_AGE_SECONDS = 300;

async function repullRequest(
	this: IHookFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
): Promise<IDataObject> {
	return (await this.helpers.httpRequestWithAuthentication.call(this, 'repullApi', {
		method,
		url: `${API}${path}`,
		body,
		json: true,
	})) as IDataObject;
}

/**
 * `X-Repull-Signature: t=<unix>,v1=<hex>` where
 * `v1 = HMAC-SHA256(secret, "<t>.<raw body>")` (repull.dev/docs/verify-webhook-signatures).
 */
export function isValidSignature(header: string, rawBody: string, secret: string, nowSeconds: number): boolean {
	const parts = Object.fromEntries(
		header.split(',').map((kv) => {
			const i = kv.indexOf('=');
			return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
		}),
	);
	const t = Number(parts.t);
	if (!parts.v1 || !Number.isFinite(t) || Math.abs(nowSeconds - t) > MAX_SIGNATURE_AGE_SECONDS) return false;
	const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
	const a = Buffer.from(expected, 'hex');
	const b = Buffer.from(parts.v1, 'hex');
	return a.length === b.length && timingSafeEqual(a, b);
}

export class RepullTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Repull Trigger',
		name: 'repullTrigger',
		icon: { light: 'file:../../icons/repull.svg', dark: 'file:../../icons/repull.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when something happens in your Airbnb, Booking.com or Vrbo accounts',
		defaults: { name: 'Repull Trigger' },
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'repullApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: ['reservation.created'],
				options: [
					{ name: 'Account Disconnected', value: 'account.disconnected' },
					{ name: 'Calendar Updated', value: 'calendar.updated' },
					{ name: 'Channel Degraded', value: 'channel.degraded' },
					{ name: 'Channel Sync Failed', value: 'channel.sync.failed' },
					{ name: 'Inquiry Created', value: 'inquiry.created' },
					{ name: 'Message Received', value: 'reservation.message.received' },
					{ name: 'Payout Completed', value: 'payout.completed' },
					{ name: 'Reservation Alteration Requested', value: 'reservation.alteration.created' },
					{ name: 'Reservation Cancelled', value: 'reservation.cancelled' },
					{ name: 'Reservation Created', value: 'reservation.created' },
					{ name: 'Reservation Request Created', value: 'reservation.request.created' },
					{ name: 'Reservation Updated', value: 'reservation.updated' },
					{ name: 'Review Created', value: 'review.created' },
					{ name: 'Review Responded', value: 'review.responded' },
				],
				description: 'The events to listen for. Full catalog: repull.dev/docs/webhook-event-types.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const data = this.getWorkflowStaticData('node');
				if (!data.webhookId) return false;
				try {
					const sub = await repullRequest.call(this, 'GET', `/v1/webhooks/${data.webhookId as string}`);
					return sub.url === this.getNodeWebhookUrl('default') && sub.status !== 'disabled';
				} catch {
					delete data.webhookId;
					delete data.secret;
					return false;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const sub = await repullRequest.call(this, 'POST', '/v1/webhooks', {
					url: this.getNodeWebhookUrl('default'),
					events: this.getNodeParameter('events') as string[],
					description: `n8n: ${this.getWorkflow().name ?? this.getWorkflow().id}`,
				});
				if (!sub.id || !sub.secret) {
					throw new NodeOperationError(this.getNode(), 'Repull did not return a webhook id and signing secret');
				}
				const data = this.getWorkflowStaticData('node');
				data.webhookId = sub.id;
				data.secret = sub.secret;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const data = this.getWorkflowStaticData('node');
				if (data.webhookId) {
					try {
						await repullRequest.call(this, 'DELETE', `/v1/webhooks/${data.webhookId as string}`);
					} catch (error) {
						this.logger.warn(`Repull: could not delete webhook ${data.webhookId as string}`, { error });
						return false;
					}
				}
				delete data.webhookId;
				delete data.secret;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const secret = this.getWorkflowStaticData('node').secret as string | undefined;
		const header = this.getHeaderData()['x-repull-signature'] as string | undefined;
		const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody?.toString('utf8');

		if (!secret || !header || rawBody === undefined || !isValidSignature(header, rawBody, secret, Date.now() / 1000)) {
			this.getResponseObject().status(401).json({ error: 'invalid signature' });
			return { noWebhookResponse: true };
		}

		return { workflowData: [this.helpers.returnJsonArray(this.getBodyData())] };
	}
}
