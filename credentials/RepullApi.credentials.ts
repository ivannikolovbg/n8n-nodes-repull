import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RepullApi implements ICredentialType {
	name = 'repullApi';

	displayName = 'Repull API';

	icon: Icon = { light: 'file:../icons/repull.svg', dark: 'file:../icons/repull.dark.svg' };

	documentationUrl = 'https://repull.dev/docs/api-keys';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Repull API key (starts with sk_live_). Create one at repull.dev/dashboard.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.repull.dev',
			url: '/v1/connect',
			method: 'GET',
		},
	};
}
