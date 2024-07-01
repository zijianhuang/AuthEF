import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
export namespace DemoWebApi_Controllers_Client {
	export interface Hero {
		id?: string | null;
		name?: string | null;
	}

}

export namespace DemoWebApi_DemoData_Client {
	export interface Entity {
		addresses?: Array<any>;
		id?: string | null;
		name: string;
		phoneNumbers?: Array<any>;
		web?: string | null;
	}

	export interface Person extends DemoWebApi_DemoData_Client.Entity {
		baptised?: Date | null;
		dob?: Date | null;
		givenName?: string | null;
		surname?: string | null;
	}

	export interface Company extends DemoWebApi_DemoData_Client.Entity {
		businessNumber?: string | null;
		businessNumberType?: string | null;
		foundDate?: Date | null;
		registerDate?: Date | null;
		textMatrix?: Array<Array<string>>;
		int2D?: number[][];
		int2DJagged?: Array<Array<number>>;
		lines?: Array<string>;
	}

	export enum Days { Sat = 1, Sun = 2, Mon = 3, Tue = 4, Wed = 5, Thu = 6, Fri = 7 }

	export interface MimsResult<T> {
		generatedAt?: Date | null;
		message?: string | null;
		result?: T;
		success?: boolean | null;
	}

	export interface MyGeneric<T, K, U> {
		myK?: K;
		myT?: T;
		myU?: U;
		status?: string | null;
	}

	export interface IdMap {
		id?: string | null;
		idNotEmitDefaultValue?: string | null;
		nullableId?: string | null;
		requiredName?: string | null;
		text?: string | null;
	}

	export interface MimsPackage {
		kk?: number | null;
		kK2?: number | null;
		optionalEnum?: number | null;
		optionalInt?: number | null;
		result?: DemoWebApi_DemoData_Client.MimsResult<number>;
		tag?: string | null;
	}

}

export namespace Core3WebApi_Controllers_Client {
	@Injectable()
	export class Statistics {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * GET api/Statistics/distribution
		 */
		getDistribution(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/Statistics/distribution', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}
	}

}

export namespace DemoCoreWeb_Controllers_Client {

	/**
	 * Authorize: Bearer
	 */
	@Injectable()
	export class SpecialTypes {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * Anonymous Dynamic of C#
		 * GET api/SpecialTypes/AnonymousDynamic
		 * @return {any} dyanmic things
		 */
		getAnonymousDynamic(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/SpecialTypes/AnonymousDynamic', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/SpecialTypes/AnonymousDynamic2
		 */
		getAnonymousDynamic2(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/SpecialTypes/AnonymousDynamic2', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/SpecialTypes/AnonymousObject
		 */
		getAnonymousObject(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/SpecialTypes/AnonymousObject', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/SpecialTypes/AnonymousObject2
		 */
		getAnonymousObject2(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/SpecialTypes/AnonymousObject2', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * POST api/SpecialTypes/AnonymousObject
		 */
		postAnonymousObject(obj: any, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/SpecialTypes/AnonymousObject', JSON.stringify(obj), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * POST api/SpecialTypes/AnonymousObject2
		 */
		postAnonymousObject2(obj: any, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/SpecialTypes/AnonymousObject2', JSON.stringify(obj), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}
	}

}

export namespace DemoWebApi_Controllers_Client {

	/**
	 * Manage user accounts stored in ASP.NET Core Identity database.
	 * Authorize: Bearer
	 */
	@Injectable()
	export class Account {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * POST api/Account/AddRole?userId={userId}&roleName={roleName}
		 * @param {string} userId Type: GUID
		 */
		addRole(userId: string | null, roleName: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/Account/AddRole?userId=' + userId + '&roleName=' + (!roleName ? '' : encodeURIComponent(roleName)), null, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * DELETE api/Account/AdminRemoveUserRefreshTokens/{username}
		 * Authorize: Roles: admin; 
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		adminRemoverRefreshTokensOfUsers(username: string | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.delete<number>(this.baseUri + 'api/Account/AdminRemoveUserRefreshTokens/' + (!username ? '' : encodeURIComponent(username)), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * PUT api/Account/ChangePassword
		 */
		changePassword(model: Fonlow_WebApp_Accounts_Client.ChangePasswordBindingModel | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.put(this.baseUri + 'api/Account/ChangePassword', JSON.stringify(model), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * Just a demo, but revealing some basic ForgotPassword features:
		 * 1. If user not found, return NoContent
		 * 2. Otherwise, send the reset token via Email or other means.
		 * POST api/Account/ForgotPassword
		 */
		forgotPassword(email: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/Account/ForgotPassword', JSON.stringify(email), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/Account/AllRoleNames
		 */
		getAllRoleNames(headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.get<Array<string>>(this.baseUri + 'api/Account/AllRoleNames', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Account/idByEmail?email={email}
		 * @return {string} Type: GUID
		 */
		getUserIdByEmail(email: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get<string>(this.baseUri + 'api/Account/idByEmail?email=' + (!email ? '' : encodeURIComponent(email)), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Account/idByFullName?cn={cn}
		 * @return {string} Type: GUID
		 */
		getUserIdByFullName(cn: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get<string>(this.baseUri + 'api/Account/idByFullName?cn=' + (!cn ? '' : encodeURIComponent(cn)), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Account/UserIdByUser?username={username}
		 * @return {string} Type: GUID
		 */
		getUserIdByUser(username: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get<string>(this.baseUri + 'api/Account/UserIdByUser?username=' + (!username ? '' : encodeURIComponent(username)), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Mapping between email address and user Id
		 * GET api/Account/UserIdMapByEmail
		 * @return {Array<{key: string, value: string }>} Key is email address, and value is user Id.
		 */
		getUserIdMapByEmail(headersHandler?: () => HttpHeaders): Observable<Array<{key: string, value: string }>> {
			return this.http.get<Array<{key: string, value: string }>>(this.baseUri + 'api/Account/UserIdMapByEmail', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Mapping between full user name and user Id
		 * GET api/Account/UserIdMapByFullName
		 * @return {Array<{key: string, value: string }>} Key is full name, and value is user Id.
		 */
		getUserIdMapByFullName(headersHandler?: () => HttpHeaders): Observable<Array<{key: string, value: string }>> {
			return this.http.get<Array<{key: string, value: string }>>(this.baseUri + 'api/Account/UserIdMapByFullName', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Get user info of current logged user
		 * GET api/Account/UserInfo
		 */
		getUserInfo(headersHandler?: () => HttpHeaders): Observable<Fonlow_WebApp_Accounts_Client.UserInfoViewModel> {
			return this.http.get<Fonlow_WebApp_Accounts_Client.UserInfoViewModel>(this.baseUri + 'api/Account/UserInfo', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * : InternalRoles
		 * GET api/Account/UserInfoById?id={id}
		 * Authorize: Roles: admin,manager; 
		 * @param {string} id Type: GUID
		 */
		getUserInfoByIdOfstring(id: string | null, headersHandler?: () => HttpHeaders): Observable<Fonlow_WebApp_Accounts_Client.UserInfoViewModel> {
			return this.http.get<Fonlow_WebApp_Accounts_Client.UserInfoViewModel>(this.baseUri + 'api/Account/UserInfoById?id=' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/Account/Logout/{connectionId}
		 * @param {string} connectionId Type: GUID
		 */
		logout(connectionId: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/Account/Logout/' + connectionId, null, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * Create user, but without role
		 * POST api/Account/Register
		 * Authorize: Roles: admin,manager; 
		 * @return {string} Type: GUID
		 */
		register(model: Fonlow_WebApp_Accounts_Client.RegisterBindingModel | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post<string>(this.baseUri + 'api/Account/Register', JSON.stringify(model), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * Admin or scheduler clean up old user tokens
		 * DELETE api/Account/RemoveOldUserTokens/{pastDateUtc}
		 * Authorize: Roles: admin; 
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		removeOldUserTokens(pastDateUtc: Date | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.delete<number>(this.baseUri + 'api/Account/RemoveOldUserTokens/' + pastDateUtc?.toISOString(), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * User to remove all refresh tokens of user
		 * DELETE api/Account/RemoveRefreshTokensOfUser
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		removeRefreshTokensOfUser(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.delete<number>(this.baseUri + 'api/Account/RemoveRefreshTokensOfUser', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * DELETE api/Account/RemoveRole?userId={userId}&roleName={roleName}
		 * @param {string} userId Type: GUID
		 */
		removeRole(userId: string | null, roleName: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.delete(this.baseUri + 'api/Account/RemoveRole?userId=' + userId + '&roleName=' + (!roleName ? '' : encodeURIComponent(roleName)), { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * Remove user and also remove from the entities table.
		 * DELETE api/Account/RemoveUser?userId={userId}
		 * @param {string} userId Type: GUID
		 */
		removeUser(userId: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.delete(this.baseUri + 'api/Account/RemoveUser?userId=' + userId, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * POST api/Account/ResetPassword
		 */
		resetPassword(model: Fonlow_WebApp_Accounts_Client.ResetPasswordViewModel | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/Account/ResetPassword', JSON.stringify(model), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * PUT api/Account/SetPassword
		 */
		setPassword(model: Fonlow_WebApp_Accounts_Client.SetPasswordBindingModel | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.put(this.baseUri + 'api/Account/SetPassword', JSON.stringify(model), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * : AdminOrManager
		 * PUT api/Account/SetUserPassword
		 * Authorize: Roles: admin,manager; 
		 */
		setUserPassword(model: Fonlow_WebApp_Accounts_Client.SetUserPasswordBindingModel | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.put(this.baseUri + 'api/Account/SetUserPassword', JSON.stringify(model), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}
	}


	/**
	 * For testing different commbinations of parameters and returns
	 * Authorize: Bearer
	 */
	@Injectable()
	export class DateTypes {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * GET api/DateTypes/GetDateOnly
		 * @return {Date} Type: DateOnly
		 */
		getDateOnly(headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/GetDateOnly', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/DateTypes/NullableDatetime/{hasValue}
		 */
		getDateTime(hasValue: boolean | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/NullableDatetime/' + hasValue, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * return DateTimeOffset.Now
		 * GET api/DateTypes/GetDateTimeOffset
		 */
		getDateTimeOffset(headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/GetDateTimeOffset', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/DateTypes/NextHour/{dt}
		 */
		getNextHour(dt: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/NextHour/' + dt?.toISOString(), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * If Dt is not defined, add a hour from now
		 * GET api/DateTypes/NextHourNullable?n={n}&dt={dt}
		 * @param {number} n Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getNextHourNullable(n: number | null, dt: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/NextHourNullable?n=' + n + (dt ? '&dt=' + dt?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/DateTypes/NextYear/{dt}
		 */
		getNextYear(dt: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/NextYear/' + dt?.toISOString(), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * If Dt is not defined, add a year from now
		 * GET api/DateTypes/NextYearNullable?n={n}&dt={dt}
		 * @param {number} n Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getNextYearNullable(n: number | null, dt: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/NextYearNullable?n=' + n + (dt ? '&dt=' + dt?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Client should send DateTime.Date
		 * POST api/DateTypes/IsDateTimeDate
		 */
		isDateTimeDate(dt: Date | null, headersHandler?: () => HttpHeaders): Observable<{item1: Date, item2: Date}> {
			return this.http.post<{item1: Date, item2: Date}>(this.baseUri + 'api/DateTypes/IsDateTimeDate', JSON.stringify(dt), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/DateTypes/IsDateTimeOffsetDate
		 */
		isDateTimeOffsetDate(dt: Date | null, headersHandler?: () => HttpHeaders): Observable<{item1: Date, item2: Date}> {
			return this.http.post<{item1: Date, item2: Date}>(this.baseUri + 'api/DateTypes/IsDateTimeOffsetDate', JSON.stringify(dt), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/DateTypes/ForDateOnly
		 * @param {Date} d Type: DateOnly
		 * @return {Date} Type: DateOnly
		 */
		postDateOnly(d: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.post<Date>(this.baseUri + 'api/DateTypes/ForDateOnly', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/DateTypes/DateOnlyNullable
		 */
		postDateOnlyNullable(d: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.post<Date>(this.baseUri + 'api/DateTypes/DateOnlyNullable', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/DateTypes/ForDateTime
		 */
		postDateTime(d: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.post<Date>(this.baseUri + 'api/DateTypes/ForDateTime', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * return d;
		 * POST api/DateTypes/ForDateTimeOffset
		 */
		postDateTimeOffset(d: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.post<Date>(this.baseUri + 'api/DateTypes/ForDateTimeOffset', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * return d.ToString("O")
		 * POST api/DateTypes/ForDateTimeOffsetForO
		 */
		postDateTimeOffsetForO(d: Date | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/DateTypes/ForDateTimeOffsetForO', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/DateTypes/ForDateTimeOffsetForOffset
		 */
		postDateTimeOffsetForOffset(d: Date | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/DateTypes/ForDateTimeOffsetForOffset', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * Returned is DateTimeOffset?
		 * POST api/DateTypes/DateTimeOffsetNullable
		 */
		postDateTimeOffsetNullable(d: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.post<Date>(this.baseUri + 'api/DateTypes/DateTimeOffsetNullable', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/DateTypes/ForDateTimeOffsetStringForOffset
		 */
		postDateTimeOffsetStringForOffset(s: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/DateTypes/ForDateTimeOffsetStringForOffset', JSON.stringify(s), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * POST api/DateTypes/NextYear
		 */
		postNextYear(dt: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.post<Date>(this.baseUri + 'api/DateTypes/NextYear', JSON.stringify(dt), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * GET api/DateTypes/DateOnlyStringQuery?d={d}
		 * @return {Date} Type: DateOnly
		 */
		queryDateOnlyAsString(d: string | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/DateOnlyStringQuery?d=' + (!d ? '' : encodeURIComponent(d)), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/DateTypes/RouteDateTimeOffset/{d}
		 */
		routeDateTimeOffset(d: Date | null, headersHandler?: () => HttpHeaders): Observable<Date> {
			return this.http.get<Date>(this.baseUri + 'api/DateTypes/RouteDateTimeOffset/' + d?.toISOString(), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Return Tuple DateTime?, DateTime?
		 * GET api/DateTypes/SearchDateRange?startDate={startDate}&endDate={endDate}
		 * @param {Date} startDate DateTime? startDate = null
		 * @param {Date} endDate DateTime? endDate = null
		 */
		searchDateRange(startDate: Date | null, endDate: Date | null, headersHandler?: () => HttpHeaders): Observable<{item1: Date, item2: Date}> {
			return this.http.get<{item1: Date, item2: Date}>(this.baseUri + 'api/DateTypes/SearchDateRange?' + (startDate ? 'startDate=' + startDate?.toISOString() : '') + (endDate ? '&endDate=' + endDate?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined });
		}
	}


	/**
	 * Authorize: Bearer
	 */
	@Injectable()
	export class Entities {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * POST api/Entities/createCompany
		 */
		createCompany(p: DemoWebApi_DemoData_Client.Company | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Company> {
			return this.http.post<DemoWebApi_DemoData_Client.Company>(this.baseUri + 'api/Entities/createCompany', JSON.stringify(p), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Entities/createPerson
		 * @return {string} Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		createPerson(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post<string>(this.baseUri + 'api/Entities/createPerson', JSON.stringify(p), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Entities/createPerson2
		 */
		createPerson2(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/createPerson2', JSON.stringify(p), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Entities/createPerson3
		 */
		createPerson3(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/createPerson3', JSON.stringify(p), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * DELETE api/Entities/{id}
		 * @param {string} id Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		delete(id: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.delete(this.baseUri + 'api/Entities/' + id, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/Entities/Company/{id}
		 * @param {string} id Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		getCompany(id: string | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Company> {
			return this.http.get<DemoWebApi_DemoData_Client.Company>(this.baseUri + 'api/Entities/Company/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/Entities/Mims
		 */
		getMims(p: DemoWebApi_DemoData_Client.MimsPackage | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.MimsResult<string>> {
			return this.http.post<DemoWebApi_DemoData_Client.MimsResult<string>>(this.baseUri + 'api/Entities/Mims', JSON.stringify(p), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Entities/MyGeneric
		 */
		getMyGeneric(s: DemoWebApi_DemoData_Client.MyGeneric<string, number, number> | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.MyGeneric<string, number, number>> {
			return this.http.post<DemoWebApi_DemoData_Client.MyGeneric<string, number, number>>(this.baseUri + 'api/Entities/MyGeneric', JSON.stringify(s), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Entities/MyGenericPerson
		 */
		getMyGenericPerson(s: DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person>> {
			return this.http.post<DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/Entities/MyGenericPerson', JSON.stringify(s), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * Get a person
		 * so to know the person
		 * GET api/Entities/getPerson/{id}
		 * @param {string} id unique id of that guy
		 * @return {DemoWebApi_DemoData_Client.Person} person in db
		 */
		getPerson(id: string | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.get<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/getPerson/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Entities/getPerson2/{id}
		 * @param {string} id Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		getPerson2(id: string | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.get<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/getPerson2/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * PUT api/Entities/link?id={id}&relationship={relationship}
		 * @param {string} id Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		linkPerson(id: string | null, relationship: string | null, person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<boolean> {
			return this.http.put<boolean>(this.baseUri + 'api/Entities/link?id=' + id + '&relationship=' + (!relationship ? '' : encodeURIComponent(relationship)), JSON.stringify(person), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * PATCH api/Entities/patchPerson
		 */
		patchPerson(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.patch(this.baseUri + 'api/Entities/patchPerson', JSON.stringify(person), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Entities/IdMap
		 */
		postIdMap(idMap: DemoWebApi_DemoData_Client.IdMap | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.IdMap> {
			return this.http.post<DemoWebApi_DemoData_Client.IdMap>(this.baseUri + 'api/Entities/IdMap', JSON.stringify(idMap), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * PUT api/Entities/updatePerson
		 */
		updatePerson(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.put(this.baseUri + 'api/Entities/updatePerson', JSON.stringify(person), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}
	}


	/**
	 * Heroes operations
	 * Authorize: Bearer
	 */
	@Injectable()
	export class Heroes {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * DELETE api/Heroes/{id}
		 * @param {string} id Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		delete(id: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.delete(this.baseUri + 'api/Heroes/' + id, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/Heroes/asyncHeroes
		 */
		getAsyncHeroes(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_Controllers_Client.Hero>> {
			return this.http.get<Array<DemoWebApi_Controllers_Client.Hero>>(this.baseUri + 'api/Heroes/asyncHeroes', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Get a hero.
		 * GET api/Heroes/{id}
		 * @param {string} id Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		getHero(id: string | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_Controllers_Client.Hero> {
			return this.http.get<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Get all heroes.
		 * GET api/Heroes
		 */
		getHeros(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_Controllers_Client.Hero>> {
			return this.http.get<Array<DemoWebApi_Controllers_Client.Hero>>(this.baseUri + 'api/Heroes', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/Heroes
		 */
		post(name: string | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_Controllers_Client.Hero> {
			return this.http.post<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes', JSON.stringify(name), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * Add a hero
		 * POST api/Heroes/q?name={name}
		 */
		postWithQuery(name: string | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_Controllers_Client.Hero> {
			return this.http.post<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes/q?name=' + (!name ? '' : encodeURIComponent(name)), null, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Update hero.
		 * PUT api/Heroes
		 */
		put(hero: DemoWebApi_Controllers_Client.Hero | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_Controllers_Client.Hero> {
			return this.http.put<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes', JSON.stringify(hero), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * Search heroes
		 * GET api/Heroes/search/{name}
		 * @param {string} name keyword contained in hero name.
		 * @return {Array<DemoWebApi_Controllers_Client.Hero>} Hero array matching the keyword.
		 */
		search(name: string | null, headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_Controllers_Client.Hero>> {
			return this.http.get<Array<DemoWebApi_Controllers_Client.Hero>>(this.baseUri + 'api/Heroes/search/' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined });
		}
	}

	@Injectable()
	export class Home {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * GET api/Home
		 */
		index(headersHandler?: () => HttpHeaders): Observable<HttpResponse<Blob>> {
			return this.http.get(this.baseUri + 'api/Home', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'blob' });
		}
	}

	@Injectable()
	export class Polymorphism {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * POST api/Polymorphism
		 */
		authenticate(model: Fonlow_AspNetCore_OAuth2_Client.RequestBase | null, headersHandler?: () => HttpHeaders): Observable<Fonlow_AspNetCore_OAuth2_Client.RequestBase> {
			return this.http.post<Fonlow_AspNetCore_OAuth2_Client.RequestBase>(this.baseUri + 'api/Polymorphism', JSON.stringify(model), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}
	}


	/**
	 * For testing different commbinations of parameters and returns
	 * Authorize: Bearer
	 */
	@Injectable()
	export class SuperDemo {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * GET api/SuperDemo/AthletheSearch?take={take}&skip={skip}&order={order}&sort={sort}&search={search}
		 * @param {number} skip Type: int, -2,147,483,648 to 2,147,483,647
		 */
		athletheSearch(take: number | null, skip: number | null, order: string | null, sort: string | null, search: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/SuperDemo/AthletheSearch?' + (take ? 'take=' + take.toString() : '') + '&skip=' + skip + '&order=' + (!order ? '' : encodeURIComponent(order)) + '&sort=' + (!sort ? '' : encodeURIComponent(sort)) + '&search=' + (!search ? '' : encodeURIComponent(search)), { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/ActionResult
		 */
		getActionResult(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/SuperDemo/ActionResult', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/ActionResult2
		 */
		getActionResult2(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.get(this.baseUri + 'api/SuperDemo/ActionResult2', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/ActionStringResult
		 * Status Codes: 200:OK : System.String
		 */
		getActionStringResult(headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/SuperDemo/ActionStringResult', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/bool
		 */
		getBool(headersHandler?: () => HttpHeaders): Observable<boolean> {
			return this.http.get<boolean>(this.baseUri + 'api/SuperDemo/bool', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/byte
		 * @return {number} Type: byte, 0 to 255
		 */
		getbyte(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/byte', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/ByteArray
		 */
		getByteArray(headersHandler?: () => HttpHeaders): Observable<Array<number>> {
			return this.http.get<Array<number>>(this.baseUri + 'api/SuperDemo/ByteArray', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/char
		 * @return {string} Type: char
		 */
		getChar(headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get<string>(this.baseUri + 'api/SuperDemo/char', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/Collection
		 */
		getCollection(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/Collection', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/enumGet?d={d}
		 */
		getDay(d: DemoWebApi_DemoData_Client.Days | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Days> {
			return this.http.get<DemoWebApi_DemoData_Client.Days>(this.baseUri + 'api/SuperDemo/enumGet?d=' + d, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/decimal
		 * @return {number} Type: decimal
		 */
		getDecimal(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/decimal', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/decimalArrayQ?a={a}
		 */
		getDecimalArrayQ(a: Array<number> | null, headersHandler?: () => HttpHeaders): Observable<Array<number>> {
			return this.http.get<Array<number>>(this.baseUri + 'api/SuperDemo/decimalArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/decimal/{d}
		 * @param {number} d Type: decimal
		 * @return {number} Type: decimal
		 */
		getDecimalSquare(d: number | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/decimal/' + d, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/DecimalZero
		 * @return {number} Type: decimal
		 */
		getDecimalZero(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/DecimalZero', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/StringStringDic
		 */
		getDictionary(headersHandler?: () => HttpHeaders): Observable<{[id: string]: string }> {
			return this.http.get<{[id: string]: string }>(this.baseUri + 'api/SuperDemo/StringStringDic', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/StringPersonDic
		 */
		getDictionaryOfPeople(headersHandler?: () => HttpHeaders): Observable<{[id: string]: DemoWebApi_DemoData_Client.Person }> {
			return this.http.get<{[id: string]: DemoWebApi_DemoData_Client.Person }>(this.baseUri + 'api/SuperDemo/StringPersonDic', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/doulbe
		 * @return {number} Type: double
		 */
		getdouble(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/doulbe', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Result of 0.1d + 0.2d - 0.3d
		 * GET api/SuperDemo/DoubleZero
		 * @return {number} Type: double
		 */
		getDoubleZero(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/DoubleZero', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/EmptyString
		 */
		getEmptyString(headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/SuperDemo/EmptyString', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/enumArrayDays?a={a}
		 */
		getEnumArrayDays(a: Array<DemoWebApi_DemoData_Client.Days> | null, headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Days>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Days>>(this.baseUri + 'api/SuperDemo/enumArrayDays?'+a?.map(z => `a=${z}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/enumArrayQ2?a={a}
		 */
		getEnumArrayQ2(a: Array<number> | null, headersHandler?: () => HttpHeaders): Observable<Array<number>> {
			return this.http.get<Array<number>>(this.baseUri + 'api/SuperDemo/enumArrayQ2?'+a?.map(z => `a=${z}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/FloatZero
		 * @return {number} Type: float
		 */
		getFloatZero(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/FloatZero', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/ICollection
		 */
		getICollection(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/ICollection', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/IList
		 */
		getIList(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/IList', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/int2d
		 */
		getInt2D(headersHandler?: () => HttpHeaders): Observable<number[][]> {
			return this.http.get<number[][]>(this.baseUri + 'api/SuperDemo/int2d', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/int2dJagged
		 */
		getInt2DJagged(headersHandler?: () => HttpHeaders): Observable<Array<Array<number>>> {
			return this.http.get<Array<Array<number>>>(this.baseUri + 'api/SuperDemo/int2dJagged', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/intArray
		 */
		getIntArray(headersHandler?: () => HttpHeaders): Observable<Array<number>> {
			return this.http.get<Array<number>>(this.baseUri + 'api/SuperDemo/intArray', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/intArrayQ?a={a}
		 */
		getIntArrayQ(a: Array<number> | null, headersHandler?: () => HttpHeaders): Observable<Array<number>> {
			return this.http.get<Array<number>>(this.baseUri + 'api/SuperDemo/intArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/intArrayQ2?a={a}
		 */
		getIntArrayQ2(a: Array<string> | null, headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.get<Array<string>>(this.baseUri + 'api/SuperDemo/intArrayQ2?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/int/{d}
		 * @param {number} d Type: int, -2,147,483,648 to 2,147,483,647
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getIntSquare(d: number | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/int/' + d, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/IReadOnlyCollection
		 */
		getIReadOnlyCollection(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/IReadOnlyCollection', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/IReadOnlyList
		 */
		getIReadOnlyList(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/IReadOnlyList', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/KeyValuePair
		 */
		getKeyhValuePair(headersHandler?: () => HttpHeaders): Observable<{key: string, value: DemoWebApi_DemoData_Client.Person }> {
			return this.http.get<{key: string, value: DemoWebApi_DemoData_Client.Person }>(this.baseUri + 'api/SuperDemo/KeyValuePair', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/List
		 */
		getList(headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/List', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/NullableDecimal/{hasValue}
		 */
		getNullableDecimal(hasValue: boolean | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/NullableDecimal/' + hasValue, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/NullObject
		 */
		getNullPerson(headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.get<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/SuperDemo/NullObject', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/NullString
		 */
		getNullString(headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/SuperDemo/NullString', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/DoubleNullable?location={location}&dd={dd}&de={de}
		 */
		getPrimitiveNullable(location: string | null, dd: number | null, de: number | null, headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: number, item3: number}> {
			return this.http.get<{item1: string, item2: number, item3: number}>(this.baseUri + 'api/SuperDemo/DoubleNullable?location=' + (!location ? '' : encodeURIComponent(location)) + (dd ? '&dd=' + dd.toString() : '') + (de ? '&de=' + de.toString() : ''), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/DoubleNullable2?dd={dd}&de={de}
		 */
		getPrimitiveNullable2(dd: number | null, de: number | null, headersHandler?: () => HttpHeaders): Observable<{item1: number, item2: number}> {
			return this.http.get<{item1: number, item2: number}>(this.baseUri + 'api/SuperDemo/DoubleNullable2?' + (dd ? 'dd=' + dd.toString() : '') + (de ? '&de=' + de.toString() : ''), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/sbyte
		 * @return {number} Type: sbyte, -128 to 127
		 */
		getsbyte(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/sbyte', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/short
		 * @return {number} Type: short, -32,768 to 32,767
		 */
		getShort(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/short', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/stringArrayQ?a={a}
		 */
		getStringArrayQ(a: Array<string> | null, headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.get<Array<string>>(this.baseUri + 'api/SuperDemo/stringArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/stringArrayQ2?a={a}
		 */
		getStringArrayQ2(a: Array<string> | null, headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.get<Array<string>>(this.baseUri + 'api/SuperDemo/stringArrayQ2?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/TextStream
		 */
		getTextStream(headersHandler?: () => HttpHeaders): Observable<HttpResponse<Blob>> {
			return this.http.get(this.baseUri + 'api/SuperDemo/TextStream', { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'blob' });
		}

		/**
		 * GET api/SuperDemo/uint
		 * @return {number} Type: uint, 0 to 4,294,967,295
		 */
		getUint(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/uint', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/ulong
		 * @return {string} Type: ulong, 0 to 18,446,744,073,709,551,615
		 */
		getulong(headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get<string>(this.baseUri + 'api/SuperDemo/ulong', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SuperDemo/ushort
		 * @return {number} Type: ushort, 0 to 65,535
		 */
		getUShort(headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.get<number>(this.baseUri + 'api/SuperDemo/ushort', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/SuperDemo/ActionResult
		 */
		postActionResult(headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/SuperDemo/ActionResult', null, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * POST api/SuperDemo/PostActionResult2
		 */
		postActionResult2(s: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<Blob>> {
			return this.http.post(this.baseUri + 'api/SuperDemo/PostActionResult2', JSON.stringify(s), { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'blob' });
		}

		/**
		 * POST api/SuperDemo/PostActionResult3
		 */
		postActionResult3(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.post(this.baseUri + 'api/SuperDemo/PostActionResult3', JSON.stringify(person), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}

		/**
		 * POST api/SuperDemo/Collection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postCollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/Collection', JSON.stringify(list), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/enumPost?d={d}
		 */
		postDay(d: DemoWebApi_DemoData_Client.Days | null, d2: DemoWebApi_DemoData_Client.Days | null, headersHandler?: () => HttpHeaders): Observable<Array<DemoWebApi_DemoData_Client.Days>> {
			return this.http.post<Array<DemoWebApi_DemoData_Client.Days>>(this.baseUri + 'api/SuperDemo/enumPost?d=' + d, JSON.stringify(d2), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/StringPersonDic
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postDictionary(dic: {[id: string]: DemoWebApi_DemoData_Client.Person } | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/StringPersonDic', JSON.stringify(dic), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/Guids
		 */
		postGuids(guids: Array<string> | null, headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.post<Array<string>>(this.baseUri + 'api/SuperDemo/Guids', JSON.stringify(guids), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/ICollection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postICollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/ICollection', JSON.stringify(list), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/IList
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/IList', JSON.stringify(list), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/int2d
		 */
		postInt2D(a: number[][] | null, headersHandler?: () => HttpHeaders): Observable<boolean> {
			return this.http.post<boolean>(this.baseUri + 'api/SuperDemo/int2d', JSON.stringify(a), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/int2djagged
		 */
		postInt2DJagged(a: Array<Array<number>> | null, headersHandler?: () => HttpHeaders): Observable<boolean> {
			return this.http.post<boolean>(this.baseUri + 'api/SuperDemo/int2djagged', JSON.stringify(a), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/intArray
		 */
		postIntArray(a: Array<number> | null, headersHandler?: () => HttpHeaders): Observable<boolean> {
			return this.http.post<boolean>(this.baseUri + 'api/SuperDemo/intArray', JSON.stringify(a), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/IReadOnlyCollection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIReadOnlyCollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/IReadOnlyCollection', JSON.stringify(list), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/IReadOnlyList
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIReadOnlyList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/IReadOnlyList', JSON.stringify(list), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/List
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/SuperDemo/List', JSON.stringify(list), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/SuperDemo/PostEmpty/{i}
		 * @param {number} i Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postWithQueryButEmptyBody(s: string | null, i: number | null, headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: number}> {
			return this.http.post<{item1: string, item2: number}>(this.baseUri + 'api/SuperDemo/PostEmpty/' + i, JSON.stringify(s), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}
	}


	/**
	 * https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3.3.3
	 * Authorize: Bearer
	 */
	@Injectable()
	export class Tuple {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * POST api/Tuple/ChangeName
		 */
		changeName(d: {item1: string, item2: DemoWebApi_DemoData_Client.Person} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/ChangeName', JSON.stringify(d), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * GET api/Tuple/PeopleCompany4
		 */
		getPeopleCompany4(headersHandler?: () => HttpHeaders): Observable<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company}> {
			return this.http.get<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company}>(this.baseUri + 'api/Tuple/PeopleCompany4', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/PeopleCompany5
		 */
		getPeopleCompany5(headersHandler?: () => HttpHeaders): Observable<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company}> {
			return this.http.get<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company}>(this.baseUri + 'api/Tuple/PeopleCompany5', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple1
		 */
		getTuple1(headersHandler?: () => HttpHeaders): Observable<{item1: number}> {
			return this.http.get<{item1: number}>(this.baseUri + 'api/Tuple/Tuple1', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple2
		 */
		getTuple2(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: number}> {
			return this.http.get<{item1: string, item2: number}>(this.baseUri + 'api/Tuple/Tuple2', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple3
		 */
		getTuple3(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: string, item3: number}> {
			return this.http.get<{item1: string, item2: string, item3: number}>(this.baseUri + 'api/Tuple/Tuple3', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple4
		 */
		getTuple4(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: string, item3: string, item4: number}> {
			return this.http.get<{item1: string, item2: string, item3: string, item4: number}>(this.baseUri + 'api/Tuple/Tuple4', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple5
		 */
		getTuple5(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: string, item3: string, item4: string, item5: number}> {
			return this.http.get<{item1: string, item2: string, item3: string, item4: string, item5: number}>(this.baseUri + 'api/Tuple/Tuple5', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple6
		 */
		getTuple6(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: number}> {
			return this.http.get<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: number}>(this.baseUri + 'api/Tuple/Tuple6', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple7
		 */
		getTuple7(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number}> {
			return this.http.get<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number}>(this.baseUri + 'api/Tuple/Tuple7', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Tuple/Tuple8
		 */
		getTuple8(headersHandler?: () => HttpHeaders): Observable<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number, rest: {item1: string, item2: string, item3: string}}> {
			return this.http.get<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number, rest: {item1: string, item2: string, item3: string}}>(this.baseUri + 'api/Tuple/Tuple8', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/Tuple/PeopleCompany2
		 */
		linkPeopleCompany2(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany2', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PeopleCompany3
		 */
		linkPeopleCompany3(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany3', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PeopleCompany4
		 */
		linkPeopleCompany4(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany4', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PeopleCompany5
		 */
		linkPeopleCompany5(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany5', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PeopleCompany6
		 */
		linkPeopleCompany6(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany6', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PeopleCompany7
		 */
		linkPeopleCompany7(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Person, item7: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany7', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PeopleCompany8
		 */
		linkPeopleCompany8(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Person, item7: DemoWebApi_DemoData_Client.Person, rest: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany8', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/PersonCompany1
		 */
		linkPersonCompany1(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => HttpHeaders): Observable<DemoWebApi_DemoData_Client.Person> {
			return this.http.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PersonCompany1', JSON.stringify(peopleAndCompany), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/Tuple1
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postTuple1(tuple: {item1: number} | null, headersHandler?: () => HttpHeaders): Observable<number> {
			return this.http.post<number>(this.baseUri + 'api/Tuple/Tuple1', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) });
		}

		/**
		 * POST api/Tuple/Tuple2
		 */
		postTuple2(tuple: {item1: string, item2: number} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple2', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Tuple/Tuple3
		 */
		postTuple3(tuple: {item1: string, item2: string, item3: number} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple3', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Tuple/Tuple4
		 */
		postTuple4(tuple: {item1: string, item2: string, item3: string, item4: number} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple4', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Tuple/Tuple5
		 */
		postTuple5(tuple: {item1: string, item2: string, item3: string, item4: string, item5: number} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple5', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Tuple/Tuple6
		 */
		postTuple6(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: number} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple6', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Tuple/Tuple7
		 */
		postTuple7(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple7', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * POST api/Tuple/Tuple8
		 */
		postTuple8(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: string, rest: {item1: string, item2: string, item3: string}} | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Tuple/Tuple8', JSON.stringify(tuple), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}
	}

	@Injectable()
	export class Values {
		constructor(@Inject('baseUri') private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/', private http: HttpClient) {
		}

		/**
		 * DELETE api/Values/{id}
		 * @param {number} id Type: int, -2,147,483,648 to 2,147,483,647
		 */
		delete(id: number | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.delete(this.baseUri + 'api/Values/' + id, { headers: headersHandler ? headersHandler() : undefined, observe: 'response', responseType: 'text' });
		}

		/**
		 * Get a list of value
		 * GET api/Values
		 */
		get(headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.get<Array<string>>(this.baseUri + 'api/Values', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Get by both Id and name
		 * GET api/Values/{id}?name={name}
		 * @param {number} id Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getByIdOfnumberAndNameOfstring(id: number | null, name: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/Values/' + id + '?name=' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/Values?name={name}
		 */
		getByNameOfstring(name: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/Values?name=' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/Values/{id}
		 * @param {number} id Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getByIdOfnumber(id: number | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.get(this.baseUri + 'api/Values/' + id, { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/Values/Get2
		 */
		get2(headersHandler?: () => HttpHeaders): Observable<Array<string>> {
			return this.http.get<Array<string>>(this.baseUri + 'api/Values/Get2', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/Values
		 */
		post(value: string | null, headersHandler?: () => HttpHeaders): Observable<string> {
			return this.http.post(this.baseUri + 'api/Values', JSON.stringify(value), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),  responseType: 'text' });
		}

		/**
		 * Update with valjue
		 * PUT api/Values/{id}
		 * @param {number} id Type: int, -2,147,483,648 to 2,147,483,647
		 */
		put(id: number | null, value: string | null, headersHandler?: () => HttpHeaders): Observable<HttpResponse<string>> {
			return this.http.put(this.baseUri + 'api/Values/' + id, JSON.stringify(value), { headers: headersHandler ? headersHandler().append('Content-Type', 'application/json;charset=UTF-8') : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }), observe: 'response', responseType: 'text' });
		}
	}

}

export namespace Fonlow_AspNetCore_OAuth2_Client {
	export interface RequestBase {
		grantType: string;
	}

}

export namespace Fonlow_WebApp_Accounts_Client {
	export interface UserInfoViewModel {
		createdUtc?: Date | null;
		email?: string | null;
		fullName?: string | null;
		hasRegistered?: boolean | null;
		id?: string | null;
		loginProvider?: string | null;
		roles?: Array<string>;
		userName?: string | null;
	}

	export interface ChangePasswordBindingModel {
		confirmPassword?: string | null;
		newPassword: string;
		oldPassword: string;
	}

	export interface RegisterBindingModel {
		confirmPassword?: string | null;
		email?: string | null;
		fullName?: string | null;
		password: string;
		userName: string;
	}

	export interface ResetPasswordViewModel {
		code?: string | null;
		confirmPassword?: string | null;
		email?: string | null;
		password?: string | null;
	}

	export interface SetPasswordBindingModel {
		confirmPassword?: string | null;
		newPassword: string;
	}

	export interface SetUserPasswordBindingModel extends Fonlow_WebApp_Accounts_Client.SetPasswordBindingModel {
		userId?: string | null;
	}

}

