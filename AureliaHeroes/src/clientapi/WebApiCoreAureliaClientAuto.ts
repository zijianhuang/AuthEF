import {HttpClient} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-framework';
export namespace DemoWebApi_Controllers_Client {

	/**
	 * Complex hero type
	 */
	export interface Hero {

		/** Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 */
		id?: string | null;
		name?: string | null;
	}

}

export namespace DemoWebApi_DemoData_Client {
	export interface Address {
		city?: string | null;
		country?: string | null;

		/** Type: GUID */
		id?: string | null;
		postalCode?: string | null;
		state?: string | null;
		street1?: string | null;
		street2?: string | null;
		type?: DemoWebApi_DemoData_Client.AddressType | null;

		/**
		 * It is a field
		 */
		location?: DemoWebApi_DemoData_Another_Client.MyPoint;
	}

	export enum AddressType { Postal, Residential }

	export interface Company extends DemoWebApi_DemoData_Client.Entity {

		/**
		 * BusinessNumber to be serialized as BusinessNum
		 */
		BusinessNum?: string | null;
		businessNumberType?: string | null;
		foundDate?: Date | null;

		/** Type: DateOnly */
		registerDate?: Date | null;
		textMatrix?: Array<Array<string>>;
		int2D?: number[][];
		int2DJagged?: Array<Array<number>>;
		lines?: Array<string>;
	}

	export enum Days {
		Sat = 1,
		Sun = 2,
		Mon = 3,
		Tue = 4,
		Wed = 5,

		/**
		 * Thursday
		 */
		Thu = 6,
		Fri = 7
	}


	/**
	 * Base class of company and person
	 */
	export interface Entity {

		/**
		 * Multiple addresses
		 */
		addresses?: Array<DemoWebApi_DemoData_Client.Address>;
		id?: string | null;

		/**
		 * Name of the entity.
		 */
		name: string;
		phoneNumbers?: Array<DemoWebApi_DemoData_Client.PhoneNumber>;

		/** Type: Uri */
		web?: string | null;
	}


	/**
	 * To test different serializations against Guid
	 */
	export interface IdMap {

		/** Type: GUID */
		id?: string | null;

		/** Type: GUID */
		idNotEmitDefaultValue?: string | null;
		nullableId?: string | null;
		requiredName: string;
		text?: string | null;
	}

	export enum MedicalContraindiationResponseTypeReason { M = "Mm", S = "Ss", P = "Pp", I = "I", A = "A" }

	export enum MedicalContraindiationResponseTypeTypeCode { P = "P", T = "Tt" }

	export interface MimsPackage {

		/** Type: int */
		kk?: number | null;

		/**
		 * Having an initialized value in the property is not like defining a DefaultValueAttribute. Such intialization happens at run time,
		 * and there's no reliable way for a codegen to know if the value is declared by the programmer, or is actually the natural default value like 0.
		 */
		kK2?: number | null;
		optionalEnum?: DemoWebApi_DemoData_Client.MyEnumType | null;
		optionalInt?: number | null;
		result?: DemoWebApi_DemoData_Client.MimsResult<number>;
		tag?: string | null;
	}

	export interface MimsResult<T> {
		generatedAt?: Date | null;
		message?: string | null;
		result?: T;
		success?: boolean | null;
	}

	export enum MyEnumType { First = 1, Two = 2 }

	export interface MyGeneric<T, K, U> {
		myK?: K;
		myT?: T;
		myU?: U;
		status?: string | null;
	}

	export interface MyPeopleDic {
		anotherDic?: {[id: string]: string };
		dic?: {[id: string]: DemoWebApi_DemoData_Client.Person };
		intDic?: {[id: number]: string };
	}

	export interface Person extends DemoWebApi_DemoData_Client.Entity {
		baptised?: Date | null;

		/**
		 * Date of Birth.
		 * This is optional.
		 */
		dob?: Date | null;
		givenName?: string | null;
		surname?: string | null;
	}

	export interface PhoneNumber {
		fullNumber?: string | null;
		phoneType?: DemoWebApi_DemoData_Client.PhoneType | null;
	}


	/**
	 * Phone type
	 * Tel, Mobile, Skyp and Fax
	 */
	export enum PhoneType {

		/**
		 * Land line
		 */
		Tel,

		/**
		 * Mobile phone
		 */
		Mobile,
		Skype,
		Fax
	}

}

export namespace DemoWebApi_DemoData_Another_Client {

	/**
	 * 2D position
	 * with X and Y
	 * for Demo
	 */
	export interface MyPoint {

		/**
		 * X
		 */
		x: number;

		/**
		 * Y
		 */
		y: number;
	}

}

export namespace DemoWebApi_Models_Client {
	export interface AddExternalLoginBindingModel {
		externalAccessToken?: string | null;
	}

	export interface ChangePasswordBindingModel {
		confirmPassword?: string | null;
		newPassword?: string | null;
		OldPwd: string;
	}

	export interface RegisterBindingModel {
		confirmPassword?: string | null;
		email?: string | null;
		password?: string | null;
	}

	export interface RegisterExternalBindingModel {
		email?: string | null;
	}

	export interface RemoveLoginBindingModel {
		loginProvider?: string | null;
		providerKey?: string | null;
	}

	export interface SetPasswordBindingModel {
		confirmPassword?: string | null;
		newPassword?: string | null;
	}

}

export namespace Fonlow_WebApp_Accounts_Client {
	export interface AddExternalLoginBindingModel {
		externalAccessToken?: string | null;
	}

	export interface ApiKey {
		expiryTime?: Date | null;
		key?: string | null;
	}

	export interface ChangePasswordBindingModel {
		confirmPassword?: string | null;
		newPassword?: string | null;
		oldPassword?: string | null;
	}

	export interface CustomToken {
		connectionId?: string | null;
		stamp?: Date | null;
		tokenValue?: string | null;
	}

	export interface ExternalLoginViewModel {
		name?: string | null;
		state?: string | null;
		url?: string | null;
	}

	export interface ManageInfoViewModel {
		email?: string | null;
		externalLoginProviders?: Array<Fonlow_WebApp_Accounts_Client.ExternalLoginViewModel>;
		localLoginProvider?: string | null;
		logins?: Array<Fonlow_WebApp_Accounts_Client.UserLoginInfoViewModel>;
	}

	export interface RegisterBindingModel {
		confirmPassword?: string | null;
		email?: string | null;
		fullName?: string | null;
		password?: string | null;
		userName?: string | null;
	}

	export interface RegisterExternalBindingModel {
		email?: string | null;
	}

	export interface RemoveLoginBindingModel {
		loginProvider?: string | null;
		providerKey?: string | null;
	}

	export interface ResetPasswordViewModel {
		code?: string | null;
		confirmPassword?: string | null;
		email?: string | null;
		password?: string | null;
	}

	export interface SetPasswordBindingModel {
		confirmPassword?: string | null;
		newPassword?: string | null;
	}

	export interface SetUserPasswordBindingModel extends Fonlow_WebApp_Accounts_Client.SetPasswordBindingModel {
		userId?: string | null;
	}

	export interface TokenResponseModel {
		access_token: string;
		api_key?: Fonlow_WebApp_Accounts_Client.ApiKey;
		connection_id?: string | null;
		expires: string;
		expires_in: number;
		refresh_token?: string | null;
		token_type: string;
		username: string;
	}

	export interface UserInfoViewModel {
		createdUtc?: Date | null;
		email?: string | null;
		fullName?: string | null;
		hasRegistered?: boolean | null;
		id: string;
		loginProvider?: string | null;
		roles?: Array<string>;
		userName: string;
	}

	export interface UserLoginInfoViewModel {
		loginProvider?: string | null;
		providerKey?: string | null;
	}

}

export namespace Core3WebApi_Controllers_Client {
	@autoinject()
	export class Statistics {
		constructor(private http: HttpClient) {
		}

		/**
		 * GET api/Statistics/distribution
		 */
		getDistribution(headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.get('api/Statistics/distribution', { headers: headersHandler ? headersHandler() : undefined });
		}
	}

}

export namespace DemoCoreWeb_Controllers_Client {
	@autoinject()
	export class SpecialTypes {
		constructor(private http: HttpClient) {
		}

		/**
		 * Anonymous Dynamic of C#
		 * GET api/SpecialTypes/AnonymousDynamic
		 * @return {any} dyanmic things
		 */
		getAnonymousDynamic(headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.get('api/SpecialTypes/AnonymousDynamic', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SpecialTypes/AnonymousDynamic2
		 */
		getAnonymousDynamic2(headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.get('api/SpecialTypes/AnonymousDynamic2', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SpecialTypes/AnonymousObject
		 */
		getAnonymousObject(headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.get('api/SpecialTypes/AnonymousObject', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SpecialTypes/AnonymousObject2
		 */
		getAnonymousObject2(headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.get('api/SpecialTypes/AnonymousObject2', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/SpecialTypes/AnonymousObject
		 */
		postAnonymousObject(obj: any, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.post('api/SpecialTypes/AnonymousObject', JSON.stringify(obj), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } });
		}

		/**
		 * POST api/SpecialTypes/AnonymousObject2
		 */
		postAnonymousObject2(obj: any, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.post('api/SpecialTypes/AnonymousObject2', JSON.stringify(obj), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } });
		}
	}

}

export namespace DemoWebApi_Controllers_Client {
	@autoinject()
	export class Account {
		constructor(private http: HttpClient) {
		}

		/**
		 * POST api/Account/AddRole?userId={userId}&roleName={roleName}
		 */
		addRole(userId: string | null, roleName: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Account/AddRole?userId=' + (!userId ? '' : encodeURIComponent(userId)) + '&roleName=' + (!roleName ? '' : encodeURIComponent(roleName)), null, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * DELETE api/Account/AdminRemoveUserRefreshTokens/{username}
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		adminRemoveUserRefreshTokens(username: string | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.delete('api/Account/AdminRemoveUserRefreshTokens/' + (!username ? '' : encodeURIComponent(username)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * PUT api/Account/ChangePassword
		 */
		changePassword(model: Fonlow_WebApp_Accounts_Client.ChangePasswordBindingModel | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.put('api/Account/ChangePassword', JSON.stringify(model), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Account/ForgotPassword
		 */
		forgotPassword(email: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Account/ForgotPassword', JSON.stringify(email), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * GET api/Account/AllRoleNames
		 */
		getAllRoleNames(headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/Account/AllRoleNames', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Get array of user name and full name.
		 * GET api/Account/AllUsers
		 * @return {Array<{item1: string, item2: string}>} userName, fullName
		 */
		getAllUsers(headersHandler?: () => {[header: string]: string}): Promise<Array<{item1: string, item2: string}>> {
			return this.http.get('api/Account/AllUsers', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/Roles?userId={userId}
		 */
		getRoles(userId: string | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/Account/Roles?userId=' + (!userId ? '' : encodeURIComponent(userId)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/idByEmail?email={email}
		 * @return {string} Type: GUID
		 */
		getUserIdByEmail(email: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/Account/idByEmail?email=' + (!email ? '' : encodeURIComponent(email)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/idByFullName?cn={cn}
		 * @return {string} Type: GUID
		 */
		getUserIdByFullName(cn: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/Account/idByFullName?cn=' + (!cn ? '' : encodeURIComponent(cn)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/UserIdByUser?username={username}
		 * @return {string} Type: GUID
		 */
		getUserIdByUser(username: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/Account/UserIdByUser?username=' + (!username ? '' : encodeURIComponent(username)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/UserIdFullNameDic
		 */
		getUserIdFullNameDic(headersHandler?: () => {[header: string]: string}): Promise<{[id: string]: string }> {
			return this.http.get('api/Account/UserIdFullNameDic', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Mapping between email address and user Id
		 * GET api/Account/UserIdMapByEmail
		 * @return {Array<{key: string, value: string }>} Key is email address, and value is user Id.
		 */
		getUserIdMapByEmail(headersHandler?: () => {[header: string]: string}): Promise<Array<{key: string, value: string }>> {
			return this.http.get('api/Account/UserIdMapByEmail', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Mapping between full user name and user Id
		 * GET api/Account/UserIdMapByFullName
		 * @return {Array<{key: string, value: string }>} Key is full name, and value is user Id.
		 */
		getUserIdMapByFullName(headersHandler?: () => {[header: string]: string}): Promise<Array<{key: string, value: string }>> {
			return this.http.get('api/Account/UserIdMapByFullName', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/UserIdNameDic
		 */
		getUserIdNameDic(headersHandler?: () => {[header: string]: string}): Promise<{[id: string]: string }> {
			return this.http.get('api/Account/UserIdNameDic', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/UserInfo
		 */
		getUserInfo(headersHandler?: () => {[header: string]: string}): Promise<Fonlow_WebApp_Accounts_Client.UserInfoViewModel> {
			return this.http.get('api/Account/UserInfo', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Account/UserInfoById?id={id}
		 */
		getUserInfoByIdOfstring(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<Fonlow_WebApp_Accounts_Client.UserInfoViewModel> {
			return this.http.get('api/Account/UserInfoById?id=' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Clear the existing external cookie to ensure a clean login process
		 * and a little house keeping to remove refresh token
		 * POST api/Account/Logout/{connectionId}
		 */
		logout(connectionId: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Account/Logout/' + connectionId, null, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/Account/Register
		 * @return {string} Type: GUID
		 */
		register(model: Fonlow_WebApp_Accounts_Client.RegisterBindingModel | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Account/Register', JSON.stringify(model), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * Admin or scheduler clean up old user tokens
		 * DELETE api/Account/RemoveOldUserTokens/{pastDateUtc}
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		removeOldUserTokens(pastDateUtc: Date | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.delete('api/Account/RemoveOldUserTokens/' + pastDateUtc?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * DELETE api/Account/RemoveRole?userId={userId}&roleName={roleName}
		 */
		removeRole(userId: string | null, roleName: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.delete('api/Account/RemoveRole?userId=' + (!userId ? '' : encodeURIComponent(userId)) + '&roleName=' + (!roleName ? '' : encodeURIComponent(roleName)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * DELETE api/Account/RemoveUser?userId={userId}
		 */
		removeUser(userId: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.delete('api/Account/RemoveUser?userId=' + userId, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * User to remove all user refresh tokens
		 * DELETE api/Account/RemoveUserRefreshTokens
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		removeUserRefreshTokens(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.delete('api/Account/RemoveUserRefreshTokens', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/Account/ResetPassword
		 */
		resetPassword(model: Fonlow_WebApp_Accounts_Client.ResetPasswordViewModel | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Account/ResetPassword', JSON.stringify(model), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * PUT api/Account/SetPassword
		 */
		setPassword(model: Fonlow_WebApp_Accounts_Client.SetPasswordBindingModel | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.put('api/Account/SetPassword', JSON.stringify(model), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * PUT api/Account/SetUserPassword
		 */
		setUserPassword(model: Fonlow_WebApp_Accounts_Client.SetUserPasswordBindingModel | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.put('api/Account/SetUserPassword', JSON.stringify(model), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}
	}

	@autoinject()
	export class DateTypes {
		constructor(private http: HttpClient) {
		}

		/**
		 * GET api/DateTypes/GetDateOnly
		 * @return {Date} Type: DateOnly
		 */
		getDateOnly(headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/GetDateOnly', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/DateTypes/NullableDatetime/{hasValue}
		 */
		getDateTime(hasValue: boolean | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/NullableDatetime/' + hasValue, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * return DateTimeOffset.Now
		 * GET api/DateTypes/GetDateTimeOffset
		 */
		getDateTimeOffset(headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/GetDateTimeOffset', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/DateTypes/NextHour/{dt}
		 */
		getNextHour(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/NextHour/' + dt?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * If Dt is not defined, add a hour from now
		 * GET api/DateTypes/NextHourNullable?n={n}&dt={dt}
		 */
		getNextHourNullable(n: number | null, dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/NextHourNullable?n=' + n + (dt ? '&dt=' + dt?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/DateTypes/NextYear/{dt}
		 */
		getNextYear(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/NextYear/' + dt?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * If Dt is not defined, add a year from now
		 * GET api/DateTypes/NextYearNullable?n={n}&dt={dt}
		 */
		getNextYearNullable(n: number | null, dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/NextYearNullable?n=' + n + (dt ? '&dt=' + dt?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Client should send DateTime.Date
		 * POST api/DateTypes/IsDateTimeDate
		 */
		isDateTimeDate(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: Date, item2: Date}> {
			return this.http.post('api/DateTypes/IsDateTimeDate', JSON.stringify(dt), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/DateTypes/IsDateTimeOffsetDate
		 */
		isDateTimeOffsetDate(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: Date, item2: Date}> {
			return this.http.post('api/DateTypes/IsDateTimeOffsetDate', JSON.stringify(dt), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/DateTypes/ForDateOnly
		 * @return {Date} Type: DateOnly
		 */
		postDateOnly(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.post('api/DateTypes/ForDateOnly', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/DateTypes/DateOnlyNullable
		 */
		postDateOnlyNullable(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.post('api/DateTypes/DateOnlyNullable', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/DateTypes/ForDateTime
		 */
		postDateTime(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.post('api/DateTypes/ForDateTime', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * return d;
		 * POST api/DateTypes/ForDateTimeOffset
		 */
		postDateTimeOffset(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.post('api/DateTypes/ForDateTimeOffset', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * return d.ToString("O")
		 * POST api/DateTypes/ForDateTimeOffsetForO
		 */
		postDateTimeOffsetForO(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/DateTypes/ForDateTimeOffsetForO', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/DateTypes/ForDateTimeOffsetForOffset
		 */
		postDateTimeOffsetForOffset(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.post('api/DateTypes/ForDateTimeOffsetForOffset', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } });
		}

		/**
		 * Returned is DateTimeOffset?
		 * POST api/DateTypes/DateTimeOffsetNullable
		 */
		postDateTimeOffsetNullable(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.post('api/DateTypes/DateTimeOffsetNullable', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/DateTypes/ForDateTimeOffsetStringForOffset
		 */
		postDateTimeOffsetStringForOffset(s: string | null, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.post('api/DateTypes/ForDateTimeOffsetStringForOffset', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } });
		}

		/**
		 * POST api/DateTypes/NextYear
		 */
		postNextYear(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.post('api/DateTypes/NextYear', JSON.stringify(dt), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * GET api/DateTypes/DateOnlyStringQuery?d={d}
		 * @return {Date} Type: DateOnly
		 */
		queryDateOnlyAsString(d: string | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/DateOnlyStringQuery?d=' + (!d ? '' : encodeURIComponent(d)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/DateTypes/RouteDateTimeOffset/{d}
		 */
		routeDateTimeOffset(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return this.http.get('api/DateTypes/RouteDateTimeOffset/' + d?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Return Tuple DateTime?, DateTime?
		 * GET api/DateTypes/SearchDateRange?startDate={startDate}&endDate={endDate}
		 * @param {Date} startDate DateTime? startDate = null
		 * @param {Date} endDate DateTime? endDate = null
		 */
		searchDateRange(startDate: Date | null, endDate: Date | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: Date, item2: Date}> {
			return this.http.get('api/DateTypes/SearchDateRange?' + (startDate ? 'startDate=' + startDate?.toISOString() : '') + (endDate ? '&endDate=' + endDate?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}
	}

	@autoinject()
	export class Entities {
		constructor(private http: HttpClient) {
		}

		/**
		 * POST api/Entities/createCompany
		 */
		createCompany(p: DemoWebApi_DemoData_Client.Company | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Company> {
			return this.http.post('api/Entities/createCompany', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Entities/createPerson
		 * @return {string} Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		createPerson(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Entities/createPerson', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Entities/createPerson2
		 */
		createPerson2(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Entities/createPerson2', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Entities/createPerson3
		 */
		createPerson3(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Entities/createPerson3', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * DELETE api/Entities/{id}
		 */
		delete(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.delete('api/Entities/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Entities/Company/{id}
		 */
		getCompany(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Company> {
			return this.http.get('api/Entities/Company/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/Entities/Mims
		 */
		getMims(p: DemoWebApi_DemoData_Client.MimsPackage | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.MimsResult<string>> {
			return this.http.post('api/Entities/Mims', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Entities/MyGeneric
		 */
		getMyGeneric(s: DemoWebApi_DemoData_Client.MyGeneric<string, number, number> | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.MyGeneric<string, number, number>> {
			return this.http.post('api/Entities/MyGeneric', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Entities/MyGenericPerson
		 */
		getMyGenericPerson(s: DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person>> {
			return this.http.post('api/Entities/MyGenericPerson', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * Get a person
		 * so to know the person
		 * GET api/Entities/getPerson/{id}
		 * @param {string} id unique id of that guy
		 * @return {DemoWebApi_DemoData_Client.Person} person in db
		 */
		getPerson(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.get('api/Entities/getPerson/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Entities/getPerson2/{id}
		 */
		getPerson2(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.get('api/Entities/getPerson2/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * PUT api/Entities/link?id={id}&relationship={relationship}
		 */
		linkPerson(id: string | null, relationship: string | null, person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return this.http.put('api/Entities/link?id=' + id + '&relationship=' + (!relationship ? '' : encodeURIComponent(relationship)), JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * PATCH api/Entities/patchPerson
		 */
		patchPerson(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.patch('api/Entities/patchPerson', JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Entities/IdMap
		 */
		postIdMap(idMap: DemoWebApi_DemoData_Client.IdMap | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.IdMap> {
			return this.http.post('api/Entities/IdMap', JSON.stringify(idMap), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * PUT api/Entities/updatePerson
		 */
		updatePerson(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.put('api/Entities/updatePerson', JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}
	}

	@autoinject()
	export class Heroes {
		constructor(private http: HttpClient) {
		}

		/**
		 * DELETE api/Heroes/{id}
		 */
		delete(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.delete('api/Heroes/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Heroes/asyncHeroes
		 */
		getAsyncHeroes(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_Controllers_Client.Hero>> {
			return this.http.get('api/Heroes/asyncHeroes', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Get a hero.
		 * GET api/Heroes/{id}
		 */
		getHero(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return this.http.get('api/Heroes/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Get all heroes.
		 * GET api/Heroes
		 */
		getHeros(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_Controllers_Client.Hero>> {
			return this.http.get('api/Heroes', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/Heroes
		 */
		post(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return this.http.post('api/Heroes', JSON.stringify(name), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * Add a hero
		 * POST api/Heroes/q?name={name}
		 */
		postWithQuery(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return this.http.post('api/Heroes/q?name=' + (!name ? '' : encodeURIComponent(name)), null, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Update hero.
		 * PUT api/Heroes
		 */
		put(hero: DemoWebApi_Controllers_Client.Hero | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return this.http.put('api/Heroes', JSON.stringify(hero), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * Search heroes
		 * GET api/Heroes/search/{name}
		 * @param {string} name keyword contained in hero name.
		 * @return {Array<DemoWebApi_Controllers_Client.Hero>} Hero array matching the keyword.
		 */
		search(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_Controllers_Client.Hero>> {
			return this.http.get('api/Heroes/search/' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}
	}

	@autoinject()
	export class Home {
		constructor(private http: HttpClient) {
		}

		/**
		 * GET api/Home
		 */
		index(headersHandler?: () => {[header: string]: string}): Promise<Blob> {
			return this.http.get('api/Home', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.blob());
		}
	}

	@autoinject()
	export class SuperDemo {
		constructor(private http: HttpClient) {
		}

		/**
		 * GET api/SuperDemo/AthletheSearch?take={take}&skip={skip}&order={order}&sort={sort}&search={search}
		 */
		athletheSearch(take: number | null, skip: number | null, order: string | null, sort: string | null, search: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/AthletheSearch?' + (take ? 'take=' + take.toString() : '') + '&skip=' + skip + '&order=' + (!order ? '' : encodeURIComponent(order)) + '&sort=' + (!sort ? '' : encodeURIComponent(sort)) + '&search=' + (!search ? '' : encodeURIComponent(search)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/SuperDemo/ActionResult
		 */
		getActionResult(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/ActionResult', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/ActionResult2
		 */
		getActionResult2(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/ActionResult2', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/ActionStringResult
		 */
		getActionStringResult(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/ActionStringResult', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/SuperDemo/bool
		 */
		getBool(headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return this.http.get('api/SuperDemo/bool', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/byte
		 * @return {number} Type: byte, 0 to 255
		 */
		getbyte(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/byte', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/ByteArray
		 */
		getByteArray(headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return this.http.get('api/SuperDemo/ByteArray', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/char
		 * @return {string} Type: char
		 */
		getChar(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/char', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/Collection
		 */
		getCollection(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get('api/SuperDemo/Collection', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/enumGet?d={d}
		 */
		getDay(d: DemoWebApi_DemoData_Client.Days | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Days> {
			return this.http.get('api/SuperDemo/enumGet?d=' + d, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/decimal
		 * @return {number} Type: decimal
		 */
		getDecimal(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/decimal', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/decimalArrayQ?a={a}
		 */
		getDecimalArrayQ(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return this.http.get('api/SuperDemo/decimalArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/decimal/{d}
		 * @return {number} Type: decimal
		 */
		getDecimalSquare(d: number | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/decimal/' + d, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/DecimalZero
		 * @return {number} Type: decimal
		 */
		getDecimalZero(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/DecimalZero', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/StringStringDic
		 */
		getDictionary(headersHandler?: () => {[header: string]: string}): Promise<{[id: string]: string }> {
			return this.http.get('api/SuperDemo/StringStringDic', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/StringPersonDic
		 */
		getDictionaryOfPeople(headersHandler?: () => {[header: string]: string}): Promise<{[id: string]: DemoWebApi_DemoData_Client.Person }> {
			return this.http.get('api/SuperDemo/StringPersonDic', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/doulbe
		 * @return {number} Type: double
		 */
		getdouble(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/doulbe', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Result of 0.1d + 0.2d - 0.3d
		 * GET api/SuperDemo/DoubleZero
		 * @return {number} Type: double
		 */
		getDoubleZero(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/DoubleZero', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/EmptyString
		 */
		getEmptyString(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/EmptyString', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/SuperDemo/enumArrayDays?a={a}
		 */
		getEnumArrayDays(a: Array<DemoWebApi_DemoData_Client.Days> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Days>> {
			return this.http.get('api/SuperDemo/enumArrayDays?'+a?.map(z => `a=${z}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/enumArrayQ2?a={a}
		 */
		getEnumArrayQ2(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return this.http.get('api/SuperDemo/enumArrayQ2?'+a?.map(z => `a=${z}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/FloatZero
		 * @return {number} Type: float
		 */
		getFloatZero(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/FloatZero', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/ICollection
		 */
		getICollection(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get('api/SuperDemo/ICollection', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/IList
		 */
		getIList(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get('api/SuperDemo/IList', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/int2d
		 */
		getInt2D(headersHandler?: () => {[header: string]: string}): Promise<number[][]> {
			return this.http.get('api/SuperDemo/int2d', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/int2dJagged
		 */
		getInt2DJagged(headersHandler?: () => {[header: string]: string}): Promise<Array<Array<number>>> {
			return this.http.get('api/SuperDemo/int2dJagged', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/intArray
		 */
		getIntArray(headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return this.http.get('api/SuperDemo/intArray', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/intArrayQ?a={a}
		 */
		getIntArrayQ(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return this.http.get('api/SuperDemo/intArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/intArrayQ2?a={a}
		 */
		getIntArrayQ2(a: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/SuperDemo/intArrayQ2?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/int/{d}
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getIntSquare(d: number | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/int/' + d, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/IReadOnlyCollection
		 */
		getIReadOnlyCollection(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get('api/SuperDemo/IReadOnlyCollection', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/IReadOnlyList
		 */
		getIReadOnlyList(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get('api/SuperDemo/IReadOnlyList', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/KeyValuePair
		 */
		getKeyhValuePair(headersHandler?: () => {[header: string]: string}): Promise<{key: string, value: DemoWebApi_DemoData_Client.Person }> {
			return this.http.get('api/SuperDemo/KeyValuePair', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/List
		 */
		getList(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return this.http.get('api/SuperDemo/List', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/NullableDecimal/{hasValue}
		 */
		getNullableDecimal(hasValue: boolean | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/NullableDecimal/' + hasValue, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/NullObject
		 */
		getNullPerson(headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.get('api/SuperDemo/NullObject', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/NullString
		 */
		getNullString(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/NullString', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/SuperDemo/DoubleNullable?location={location}&dd={dd}&de={de}
		 */
		getPrimitiveNullable(location: string | null, dd: number | null, de: number | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: number, item3: number}> {
			return this.http.get('api/SuperDemo/DoubleNullable?location=' + (!location ? '' : encodeURIComponent(location)) + (dd ? '&dd=' + dd.toString() : '') + (de ? '&de=' + de.toString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/DoubleNullable2?dd={dd}&de={de}
		 */
		getPrimitiveNullable2(dd: number | null, de: number | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: number, item2: number}> {
			return this.http.get('api/SuperDemo/DoubleNullable2?' + (dd ? 'dd=' + dd.toString() : '') + (de ? '&de=' + de.toString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/sbyte
		 * @return {number} Type: sbyte, -128 to 127
		 */
		getsbyte(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/sbyte', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/short
		 * @return {number} Type: short, -32,768 to 32,767
		 */
		getShort(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/short', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/stringArrayQ?a={a}
		 */
		getStringArrayQ(a: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/SuperDemo/stringArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/stringArrayQ2?a={a}
		 */
		getStringArrayQ2(a: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/SuperDemo/stringArrayQ2?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/TextStream
		 */
		getTextStream(headersHandler?: () => {[header: string]: string}): Promise<Blob> {
			return this.http.get('api/SuperDemo/TextStream', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.blob());
		}

		/**
		 * GET api/SuperDemo/uint
		 * @return {number} Type: uint, 0 to 4,294,967,295
		 */
		getUint(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/uint', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/ulong
		 * @return {string} Type: ulong, 0 to 18,446,744,073,709,551,615
		 */
		getulong(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/SuperDemo/ulong', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/SuperDemo/ushort
		 * @return {number} Type: ushort, 0 to 65,535
		 */
		getUShort(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.get('api/SuperDemo/ushort', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/ActionResult
		 */
		postActionResult(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/SuperDemo/ActionResult', null, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/PostActionResult2
		 */
		postActionResult2(s: string | null, headersHandler?: () => {[header: string]: string}): Promise<Blob> {
			return this.http.post('api/SuperDemo/PostActionResult2', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.blob());
		}

		/**
		 * POST api/SuperDemo/PostActionResult3
		 */
		postActionResult3(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/SuperDemo/PostActionResult3', JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/Collection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postCollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/Collection', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/enumPost?d={d}
		 */
		postDay(d: DemoWebApi_DemoData_Client.Days | null, d2: DemoWebApi_DemoData_Client.Days | null, headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Days>> {
			return this.http.post('api/SuperDemo/enumPost?d=' + d, JSON.stringify(d2), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/StringPersonDic
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postDictionary(dic: {[id: string]: DemoWebApi_DemoData_Client.Person } | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/StringPersonDic', JSON.stringify(dic), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/Guids
		 */
		postGuids(guids: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.post('api/SuperDemo/Guids', JSON.stringify(guids), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/ICollection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postICollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/ICollection', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/IList
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/IList', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/int2d
		 */
		postInt2D(a: number[][] | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return this.http.post('api/SuperDemo/int2d', JSON.stringify(a), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/int2djagged
		 */
		postInt2DJagged(a: Array<Array<number>> | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return this.http.post('api/SuperDemo/int2djagged', JSON.stringify(a), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/intArray
		 */
		postIntArray(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return this.http.post('api/SuperDemo/intArray', JSON.stringify(a), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/IReadOnlyCollection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIReadOnlyCollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/IReadOnlyCollection', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/IReadOnlyList
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIReadOnlyList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/IReadOnlyList', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/List
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/SuperDemo/List', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/SuperDemo/PostEmpty/{i}
		 */
		postWithQueryButEmptyBody(s: string | null, i: number | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: number}> {
			return this.http.post('api/SuperDemo/PostEmpty/' + i, JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}
	}

	@autoinject()
	export class Tuple {
		constructor(private http: HttpClient) {
		}

		/**
		 * POST api/Tuple/ChangeName
		 */
		changeName(d: {item1: string, item2: DemoWebApi_DemoData_Client.Person} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/ChangeName', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/PeopleCompany4
		 */
		getPeopleCompany4(headersHandler?: () => {[header: string]: string}): Promise<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company}> {
			return this.http.get('api/Tuple/PeopleCompany4', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/PeopleCompany5
		 */
		getPeopleCompany5(headersHandler?: () => {[header: string]: string}): Promise<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company}> {
			return this.http.get('api/Tuple/PeopleCompany5', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple1
		 */
		getTuple1(headersHandler?: () => {[header: string]: string}): Promise<{item1: number}> {
			return this.http.get('api/Tuple/Tuple1', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple2
		 */
		getTuple2(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: number}> {
			return this.http.get('api/Tuple/Tuple2', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple3
		 */
		getTuple3(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: number}> {
			return this.http.get('api/Tuple/Tuple3', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple4
		 */
		getTuple4(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: number}> {
			return this.http.get('api/Tuple/Tuple4', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple5
		 */
		getTuple5(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: number}> {
			return this.http.get('api/Tuple/Tuple5', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple6
		 */
		getTuple6(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: number}> {
			return this.http.get('api/Tuple/Tuple6', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple7
		 */
		getTuple7(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number}> {
			return this.http.get('api/Tuple/Tuple7', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * GET api/Tuple/Tuple8
		 */
		getTuple8(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number, rest: {item1: string, item2: string, item3: string}}> {
			return this.http.get('api/Tuple/Tuple8', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany2
		 */
		linkPeopleCompany2(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany2', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany3
		 */
		linkPeopleCompany3(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany3', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany4
		 */
		linkPeopleCompany4(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany4', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany5
		 */
		linkPeopleCompany5(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany5', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany6
		 */
		linkPeopleCompany6(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany6', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany7
		 */
		linkPeopleCompany7(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Person, item7: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany7', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PeopleCompany8
		 */
		linkPeopleCompany8(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Person, item7: DemoWebApi_DemoData_Client.Person, rest: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PeopleCompany8', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/PersonCompany1
		 */
		linkPersonCompany1(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return this.http.post('api/Tuple/PersonCompany1', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/Tuple1
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postTuple1(tuple: {item1: number} | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return this.http.post('api/Tuple/Tuple1', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.json());
		}

		/**
		 * POST api/Tuple/Tuple2
		 */
		postTuple2(tuple: {item1: string, item2: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple2', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Tuple/Tuple3
		 */
		postTuple3(tuple: {item1: string, item2: string, item3: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple3', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Tuple/Tuple4
		 */
		postTuple4(tuple: {item1: string, item2: string, item3: string, item4: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple4', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Tuple/Tuple5
		 */
		postTuple5(tuple: {item1: string, item2: string, item3: string, item4: string, item5: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple5', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Tuple/Tuple6
		 */
		postTuple6(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple6', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Tuple/Tuple7
		 */
		postTuple7(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple7', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * POST api/Tuple/Tuple8
		 */
		postTuple8(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: string, rest: {item1: string, item2: string, item3: string}} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Tuple/Tuple8', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}
	}

	@autoinject()
	export class Values {
		constructor(private http: HttpClient) {
		}

		/**
		 * DELETE api/Values/{id}
		 */
		delete(id: number | null, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.delete('api/Values/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Get a list of value
		 * GET api/Values
		 */
		get(headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/Values', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * Get by both Id and name
		 * GET api/Values/{id}?name={name}
		 */
		getByIdOfnumberAndNameOfstring(id: number | null, name: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/Values/' + id + '?name=' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/Values?name={name}
		 */
		getByNameOfstring(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/Values?name=' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/Values/{id}
		 */
		getByIdOfnumber(id: number | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.get('api/Values/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * GET api/Values/Get2
		 */
		get2(headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return this.http.get('api/Values/Get2', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.json());
		}

		/**
		 * POST api/Values
		 */
		post(value: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return this.http.post('api/Values', JSON.stringify(value), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.status == 204 ? null : d.text());
		}

		/**
		 * Update with valjue
		 * PUT api/Values/{id}
		 */
		put(id: number | null, value: string | null, headersHandler?: () => {[header: string]: string}): Promise<Response> {
			return this.http.put('api/Values/' + id, JSON.stringify(value), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } });
		}
	}

}

