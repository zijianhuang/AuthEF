import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DemoWebApi_DemoData_Client, DemoWebApi_Controllers_Client } from './WebApiCoreNg2ClientAuto';
import { TokenInterceptor,  AUTH_STATUSES, AuthFunctions, LoginService } from '../app/_services/tokenInterceptor';
import { BrowserModule } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

//const apiBaseUri = 'http://fonlow.org/'; // for DemoCoreWeb hosted in server of different timezone.
const apiBaseUri = 'http://localhost:5000/'; // for DemoCoreWeb

AUTH_STATUSES.username = 'admin';
const password = 'Pppppp*8';

export function valuesClientFactory(http: HttpClient) {
	return new DemoWebApi_Controllers_Client.Values(apiBaseUri, http);
}

export function heroesClientFactory(http: HttpClient) {
	return new DemoWebApi_Controllers_Client.Heroes(apiBaseUri, http);
}

export function entitiesClientFactory(http: HttpClient) {
	return new DemoWebApi_Controllers_Client.Entities(apiBaseUri, http);
}

export function superDemoClientFactory(http: HttpClient) {
	return new DemoWebApi_Controllers_Client.SuperDemo(apiBaseUri, http);
}
export function dateTypesClientFactory(http: HttpClient) {
	return new DemoWebApi_Controllers_Client.DateTypes(apiBaseUri, http);
}

export function tupleClientFactory(http: HttpClient) {
	return new DemoWebApi_Controllers_Client.Tuple(apiBaseUri, http);
}

export function errorResponseToString(error: HttpErrorResponse | any,): string {
	let errMsg: string;
	if (error instanceof HttpErrorResponse) {
		if (error.status === 0) {
			errMsg = 'No response from backend. Connection is unavailable.';
		} else {
			if (error.message) {
				errMsg = `${error.status} - ${error.statusText}: ${error.message}`;
			} else {
				errMsg = `${error.status} - ${error.statusText}`;
			}
		}

		errMsg += error.error ? (' ' + JSON.stringify(error.error)) : '';
		return errMsg;
	} else {
		errMsg = error.message ? error.message : error.toString();
		return errMsg;
	}
}

export function errorResponseBodyToString(error: HttpErrorResponse | any,): string {
	let errMsg: string;
	if (error instanceof HttpErrorResponse) {
		if (error.status === 0) {
			errMsg = 'No response from backend. Connection is unavailable.';
		} else {
			errMsg = JSON.stringify(error.error);
		}

		return errMsg;
	} else {
		errMsg = error.message ? error.message : error.toString();
		return errMsg;
	}
}

describe('Heroes API', () => {
	let service: DemoWebApi_Controllers_Client.Heroes;
	let loginService: LoginService;
	beforeAll(async () => {
		console.debug('TestBed.configureTestingModule');
		TestBed.configureTestingModule({
			imports: [BrowserModule],
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: TokenInterceptor,
					multi: true
				},

				{
					provide: 'BACKEND_URLS',
					useValue: [apiBaseUri]
				},

				provideHttpClient(
					withInterceptorsFromDi()
				),

				{
					provide: DemoWebApi_Controllers_Client.Heroes,
					useFactory: heroesClientFactory,
					deps: [HttpClient],

				},
				{
					provide: 'auth.tokenUrl',
					useValue: apiBaseUri + 'token'
				},

				{
					provide: LoginService,
					useClass: LoginService,
				}
			],
			teardown: {destroyAfterEach: false}
		});

		loginService = TestBed.inject(LoginService);
		try {
			const data = await firstValueFrom(loginService.login(AUTH_STATUSES.username!, password));
			AuthFunctions.saveJwtToken(data);
			console.info('Login done.');
		} catch (error) {
			const errMsg = errorResponseToString(error);
			console.error('login error: ' + errMsg);
			fail(errMsg);
		};

		try {
			const data = await firstValueFrom(loginService.refreshToken(AUTH_STATUSES.accessTokenResponse.refresh_token!, AUTH_STATUSES.accessTokenResponse.scope!));
			AuthFunctions.saveJwtToken(data);
			console.info('Refresh token test done.');
		} catch (error) {
			const errMsg = errorResponseToString(error);
			console.error('refresh token error: ' + errMsg);
			fail(errMsg);
		};
		
		service = TestBed.inject(DemoWebApi_Controllers_Client.Heroes);
	});

	it('getAll', (done) => {
		service.getHeros().subscribe(
			data => {
				console.debug(data!.length);
				expect(data!.length).toBeGreaterThan(0);
				done();
			},
			error => {
				fail(errorResponseToString(error));
				done();
			}
		);

	}
	);

	it('getHero', (done) => {
		service.getHero('9999').subscribe(
			data => {
				expect(data).toBeNull();
				done();
			},
			error => {
				fail(errorResponseToString(error));
				done();
			}
		);

	}
	);

	it('Add', (done) => {
		service.post('somebody').subscribe(
			data => {
				expect(data!.name).toBe('somebody');
				done();
			},
			error => {
				fail(errorResponseToString(error));
				done();
			}
		);

	}
	);

	/**
	 * The service always returns an object and the return is decorated with NotNullAttribute.
	 */
	it('PostWithQuery', (done) => {
		service.postWithQuery('somebodyqqq').subscribe(
			data => {
				expect(data.name).toBe('somebodyqqq');
				done();
			},
			error => {
				fail(errorResponseToString(error));
				done();
			}
		);

	}
	);

	it('search', (done) => {
		service.search('Torna').subscribe(
			data => {
				console.debug(data!.length);
				expect(data!.length).toBe(1);
				expect(data![0].name).toBe('Tornado');
				done();
			},
			error => {
				fail(errorResponseToString(error));
				done();
			}
		);

	}
	);


	it('AddAfterDelayForRefreshToken', async () => {
		console.debug('Sleep for 5 seconds...');
		await new Promise(r => setTimeout(r, 5000)); // for debug build of the service, 5 second expiry and 2 seconds clock skew, thus 4.5 seconds to refresh
		const data = await firstValueFrom(service.post('somebodyDelay'));
		expect(data!.name).toBe('somebodyDelay'); 
		console.info('Debug log shows RefreshToken responded');
		//await new Promise(r => setTimeout(r, 1000)); 
	}
	);
});
