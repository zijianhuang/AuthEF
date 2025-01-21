export namespace Fonlow_Auth_Models_Client {
	export interface AccessTokenResponse extends Fonlow_Auth_Models_Client.TokenResponseBase {
		access_token?: string | null;
		expires_in?: number | null;
		refresh_token?: string | null;
		scope?: string | null;
	}

	export interface RefreshAccessTokenRequest extends Fonlow_Auth_Models_Client.RequestBase {
		refresh_token?: string | null;
		scope?: string | null;
	}

	export interface RequestBase {
		grant_type?: string | null;
	}

	export interface ROPCRequst extends Fonlow_Auth_Models_Client.RequestBase {
		password?: string | null;
		scope?: string | null;
		username?: string | null;
	}

	export interface TokenResponseBase {
		token_type?: string | null;
	}

}

