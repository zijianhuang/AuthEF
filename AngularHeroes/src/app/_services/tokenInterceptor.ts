import {
	HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient, HttpErrorResponse, HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, lastValueFrom, map } from 'rxjs';

/**
 * Intercept HTTP calls and add bearer token if the request is within BACKEND_URLS.
 * In general, the bearer token is initialized in UI login process which should return a refresh token.
 * Once a call gets 401 or 403 error, the interceptor will retrieve a new bearer token through the refresh token.
 * And the failed call will be resent. The UI should see no error.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(@Inject('BACKEND_URLS') private backendUrls: string[], @Inject('IAuthService') private authService: IAuthService) {
		console.debug('TokenInterceptor created.');
	}

	intercept(request: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
		var requestNeedsInterceptor = this.backendUrls.find(d => request.url.indexOf(d) >= 0);
		if (!requestNeedsInterceptor) {
			return httpHandler.handle(request);
		}

		let refinedRequest: HttpRequest<any>;
		if (AUTH_STATUSES.access_token) {
			//The Request/Response objects need to be immutable. Therefore, we need to clone the original request before we return it.
			refinedRequest = request.clone({
				setHeaders: {
					Authorization: `Bearer ${AUTH_STATUSES.access_token}`,
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
			if ([401, 403].includes(err.status)) {
				console.debug('401 403');
				if (AUTH_STATUSES.refreshToken) {
					return AuthFunctions.getNewAuthToken(this.authService, refinedRequest, httpHandler);
				}
			}

			return Promise.reject(err);
		}));
	}

}

/**
 * Common functions for auth
 */
export class AuthFunctions {
	static saveJwtToken(data: TokenResponseModel) {
		AUTH_STATUSES.access_token = data.access_token;
		AUTH_STATUSES.expires_in = data.expires_in.toString();
		AUTH_STATUSES.token_type = data.token_type;
		AUTH_STATUSES.expires = data.expires; // often up to 2 weeks by default in Asp.net identity 2.
		AUTH_STATUSES.jwtTokenExpires = new Date(Date.now() + data.expires_in * 1000);
		console.debug('jwtTokenExpires: ' + AUTH_STATUSES.jwtTokenExpires);
		AUTH_STATUSES.username = data.username;
		AUTH_STATUSES.connectionId = data.connection_id;
		AUTH_STATUSES.apiKey = data.api_key!;
		if (data.refresh_token) {
			AUTH_STATUSES.refreshToken = data.refresh_token;
		}

		console.debug('new token acquired.');
	}

	static async getNewAuthToken(authService: IAuthService, request: HttpRequest<any>, httpHandler: HttpHandler): Promise<HttpEvent<any>> {
		return new Promise((resolve, reject) => {
			if (AUTH_STATUSES.refreshToken) {
				authService.getTokenWithRefreshToken(AUTH_STATUSES.refreshToken, AUTH_STATUSES.username!, AUTH_STATUSES.connectionId!).subscribe({
					next: data => {
						AuthFunctions.saveJwtToken(data);
						console.debug('Redo: ' + request.urlWithParams);
						let refinedRequest = request.clone({
							setHeaders: {
								Authorization: `Bearer ${AUTH_STATUSES.access_token}`,
								Accept: 'application/json,text/html;q=0.9,*/*;q=0.8',
							}
						});

						resolve(lastValueFrom(httpHandler.handle(refinedRequest)));
					},
					error: error => {
						if (error instanceof HttpErrorResponse) {
							if (error.status == 410 || error.status == 406) {
								console.error('token removed at the backend already.');
								reject(error);
							} else if ([504, 503, 0].includes(error.status)) {
								console.debug('504 so continue.');
								resolve(lastValueFrom(httpHandler.handle(request)));
							}
						} else {
							console.debug('any other error');
							reject(error);
						}
					}
				})

			} else {
				reject('No refreshToken');
			}
		});
	}
}

/**
 * Hold common auth data, just for current tab, similar to sessionStorage.
 */
export class AUTH_STATUSES {
	static access_token: string;
	static expires_in: string;
	static token_type: string;
	static expires: string;
	static jwtTokenExpires: Date;
	static refreshToken?: string | null;
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

/**
* https://www.ietf.org/rfc/rfc6749.txt
*/
export interface TokenResponseModel {
	access_token: string;
	api_key?: ApiKey | null;
	expires: string;
	expires_in: number;
	refresh_token?: string | null;
	token_type: string;
	username: string;
	connection_id?: string | null;
}

export interface ApiKey {

	/**
	 * Tell the client about expiration
	 */
	expiryTime?: Date;
	key?: string;
}

export interface IAuthService {
	getTokenWithRefreshToken(refreshToken: string, username: string, connectionId: string): Observable<TokenResponseModel>;
	getTokenWithApiKey(apiKey: string, clientId: string, connectionId: string): Observable<TokenResponseModel>;
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
	login(username: string, password: string, headers?: any) {
		const body = 'username=' + username + '&password=' + password + '&grant_type=password';
		const contentTypeHeader = { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'ngsw-bypass': 'true' };
		const mergedHeaders = headers ? { ...contentTypeHeader, ...headers } : contentTypeHeader;
		const options = { headers: mergedHeaders };
		return this.http.post<TokenResponseModel>(this.authUri, body, options)
			.pipe(map(
				response => {
					this.username = response.username;
					return response;
				}

			));
	}

}

@Injectable()
export class AuthService implements IAuthService {
	constructor(@Inject('baseUri') private baseUri: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/', private http: HttpClient) {
	}

	getTokenWithApiKey(apiKey: string, clientId: string, connectionId: string) {
		const headers = new HttpHeaders({ 'apiKey': apiKey, 'clientId': clientId, 'connectionId': connectionId });
		return this.http.get<TokenResponseModel>(`${this.baseUri}token/apiaccesstoken`, { headers: headers });
	}

	getTokenWithRefreshToken(refreshToken: string, username: string, connectionId: string) {
		const headers = new HttpHeaders({ 'refreshToken': refreshToken, 'username': username, 'connectionId': connectionId });
		return this.http.get<TokenResponseModel>(`${this.baseUri}token/tokenByRefreshToken`, { headers: headers });
	}

}
