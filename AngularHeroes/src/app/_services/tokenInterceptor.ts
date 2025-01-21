import {
	HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient, HttpErrorResponse, HttpHeaders,
	HttpContextToken,
	HttpContext,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { Fonlow_Auth_Models_Client } from 'src/clientapi/AuthModels';

const BYPASS_LOG = new HttpContextToken(() => false); //https://stackoverflow.com/questions/60424072/disable-angular-httpinterceptor-for-some-call
/**
 * Intercept HTTP calls and add bearer token if the request is within BACKEND_URLS.
 * In general, the bearer token is initialized in UI login process which should return a refresh token.
 * Once a call gets 401 or 403 error, the interceptor will retrieve a new bearer token through the refresh token.
 * And the failed call will be resent. The UI should see no error.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(@Inject('BACKEND_URLS') private backendUrls: string[], private loginService: LoginService) {
		console.debug('TokenInterceptor created.');
	}

	intercept(request: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
		//console.debug('toUseAccessToken: ' + AUTH_STATUSES.accessTokenResponse.access_token);
		var requestNeedsInterceptor = this.backendUrls.find(d => request.url.indexOf(d) >= 0);
		if (!requestNeedsInterceptor) {
			return httpHandler.handle(request);
		}

		if (request.context.get(BYPASS_LOG) === true) {
			return httpHandler.handle(request);
		}

		if (AUTH_STATUSES.accessTokenResponse && AUTH_STATUSES.accessTokenResponse.refresh_token) {
			if (Date.now() > AUTH_STATUSES.jwtTokenExpiresHalfTime) {
				console.debug('Half time to expiry. Refresh Token...');
				this.loginService.refreshToken(AUTH_STATUSES.accessTokenResponse.refresh_token, AUTH_STATUSES.accessTokenResponse.scope!).subscribe();
			}
		}

		let refinedRequest: HttpRequest<any>;
		if (AUTH_STATUSES.accessTokenResponse.access_token) {
			//The Request/Response objects need to be immutable. Therefore, we need to clone the original request before we return it.
			refinedRequest = request.clone({
				setHeaders: {
					Authorization: `Bearer ${AUTH_STATUSES.accessTokenResponse.access_token}`,
					Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
				}
			});
		} else {
			refinedRequest = request.clone({
				setHeaders: {
					Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
				}
			});
		}

		return httpHandler.handle(refinedRequest).pipe(catchError(err => {
			return Promise.reject(err);
		}));
	}

}

/**
 * Common functions for auth
 */
export class AuthFunctions {
	static saveJwtToken(data: Fonlow_Auth_Models_Client.AccessTokenResponse) {
		AUTH_STATUSES.accessTokenResponse = Object.assign({}, data);
		AUTH_STATUSES.jwtTokenExpires = data.expires_in ? Date.now() + data.expires_in * 1000 : 8640000000000000;
		AUTH_STATUSES.jwtTokenExpiresHalfTime = data.expires_in ? Date.now() + data.expires_in * 1000 / 2 : 8640000000000000;
		console.debug('jwtTokenExpires: ' + AUTH_STATUSES.jwtTokenExpires);
		//AUTH_STATUSES.username = data.username;
		//AUTH_STATUSES.connectionId = data.connection_id;
		//AUTH_STATUSES.apiKey = data.api_key!;

		console.debug('new token acquired.');
	}
}

/**
 * Hold common auth data, just for current tab, similar to sessionStorage.
 */
export class AUTH_STATUSES {
	static accessTokenResponse: Fonlow_Auth_Models_Client.AccessTokenResponse = {};
	// static access_token?: string | null;
	// static expires_in?: string;
	// static token_type: string;
	// static expires: string;
	static jwtTokenExpires: number;
	static jwtTokenExpiresHalfTime: number;
	//static refreshToken?: string | null;
	static apiKey: ApiKey;
	static username?: string;
	static connectionId?: string | null;

	static clear() { //this has to be the last
		for (const key in AUTH_STATUSES) {
			const k = key as keyof typeof AUTH_STATUSES;
			let v = AUTH_STATUSES[k];
			if (Array.isArray(v)) {
				v = [];
				continue;
			}

			if (typeof v === 'function') {
				continue;
			}

			if (typeof v === 'number') {
				v = 0;
				continue;
			}

			if (typeof v === 'object' && v !== undefined) {
				v = {};
				continue;
			}

			if (v === null) {
				continue;
			}

			const descriptor = Object.getOwnPropertyDescriptor(AUTH_STATUSES, k);
			if (descriptor && descriptor.get && !descriptor.set) {
				console.debug(key + 'is not writable.');
				continue;
			}

			// @ts-ignore
			AUTH_STATUSES[k] = undefined; //ng compiler is not smart enough. getter is actually not included.
			//console.debug(key + ' becomes undefined.');

		}

	}
}

export interface ApiKey {

	/**
	 * Tell the client about expiration
	 */
	expiryTime?: Date;
	key?: string;
}

@Injectable()
export class LoginService {
	username?: string;

	constructor(@Inject('auth.tokenUrl') private authUri: string, private http: HttpClient) {
	}

	/**
	 * Login and save tokens to sessionStorage then return an observable.
	 * @param username
	 * @param password
	 */
	login(username: string, password: string, scope?: string, headers?: any) {
		const contentTypeHeader = { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'ngsw-bypass': 'true' };
		const mergedHeaders = headers ? { ...contentTypeHeader, ...headers } : contentTypeHeader;
		const options = { headers: mergedHeaders, context: new HttpContext().set(BYPASS_LOG, true) };
		const params = new URLSearchParams({
			'grant_type': 'password',
			'username': username,
			'password': password
		});

		if (scope) {
			params.append('scope', scope);
		}

		return this.http.post<Fonlow_Auth_Models_Client.AccessTokenResponse>(this.authUri, params, options)
			.pipe(map(
				response => {
					//this.username = response.username;
					return response;
				}

			));
	}

	refreshToken(refresh_token: string, scope?: string, headers?: any) {
		const contentTypeHeader = { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
			'ngsw-bypass': 'true',
			Authorization: `Bearer ${AUTH_STATUSES.accessTokenResponse.access_token}`,
			Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
		 };
		const mergedHeaders = headers ? { ...contentTypeHeader, ...headers } : contentTypeHeader;
		const options = {
			headers: mergedHeaders,
			context: new HttpContext().set(BYPASS_LOG, true),
		};
		const params = new URLSearchParams({
			'grant_type': 'refresh_token',
			'refresh_token': refresh_token
		});

		if (scope) {
			params.append('scope', scope);
		}

		console.debug('Requesting refreshToken...');
		return this.http.post<Fonlow_Auth_Models_Client.AccessTokenResponse>(this.authUri, params, options)
			.pipe(map(
				response => {
					console.debug('RefreshToken responded');
					return response;
				}

			));
	}

}

