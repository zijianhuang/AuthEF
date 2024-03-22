import Axios from 'axios';
import { AxiosResponse } from 'axios';
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

export namespace Core3WebApi_Controllers_Client {
	export class Statistics {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * GET api/Statistics/distribution
		 */
		getDistribution(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.get(this.baseUri + 'api/Statistics/distribution', { headers: headersHandler ? headersHandler() : undefined });
		}
	}

}

export namespace DemoCoreWeb_Controllers_Client {
	export class SpecialTypes {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * Anonymous Dynamic of C#
		 * GET api/SpecialTypes/AnonymousDynamic
		 * @return {any} dyanmic things
		 */
		getAnonymousDynamic(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.get(this.baseUri + 'api/SpecialTypes/AnonymousDynamic', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SpecialTypes/AnonymousDynamic2
		 */
		getAnonymousDynamic2(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.get(this.baseUri + 'api/SpecialTypes/AnonymousDynamic2', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SpecialTypes/AnonymousObject
		 */
		getAnonymousObject(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.get(this.baseUri + 'api/SpecialTypes/AnonymousObject', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/SpecialTypes/AnonymousObject2
		 */
		getAnonymousObject2(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.get(this.baseUri + 'api/SpecialTypes/AnonymousObject2', { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * POST api/SpecialTypes/AnonymousObject
		 */
		postAnonymousObject(obj: any, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.post(this.baseUri + 'api/SpecialTypes/AnonymousObject', JSON.stringify(obj), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' });
		}

		/**
		 * POST api/SpecialTypes/AnonymousObject2
		 */
		postAnonymousObject2(obj: any, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.post(this.baseUri + 'api/SpecialTypes/AnonymousObject2', JSON.stringify(obj), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' });
		}
	}

}

export namespace DemoWebApi_Controllers_Client {
	export class DateTypes {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * GET api/DateTypes/GetDateOnly
		 * @return {Date} Type: DateOnly
		 */
		getDateOnly(headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/GetDateOnly', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/DateTypes/NullableDatetime/{hasValue}
		 */
		getDateTime(hasValue: boolean | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/NullableDatetime/' + hasValue, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * return DateTimeOffset.Now
		 * GET api/DateTypes/GetDateTimeOffset
		 */
		getDateTimeOffset(headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/GetDateTimeOffset', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/DateTypes/NextHour/{dt}
		 */
		getNextHour(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/NextHour/' + dt?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * If Dt is not defined, add a hour from now
		 * GET api/DateTypes/NextHourNullable?n={n}&dt={dt}
		 */
		getNextHourNullable(n: number | null, dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/NextHourNullable?n=' + n + (dt ? '&dt=' + dt?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/DateTypes/NextYear/{dt}
		 */
		getNextYear(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/NextYear/' + dt?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * If Dt is not defined, add a year from now
		 * GET api/DateTypes/NextYearNullable?n={n}&dt={dt}
		 */
		getNextYearNullable(n: number | null, dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/NextYearNullable?n=' + n + (dt ? '&dt=' + dt?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Client should send DateTime.Date
		 * POST api/DateTypes/IsDateTimeDate
		 */
		isDateTimeDate(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: Date, item2: Date}> {
			return Axios.post<{item1: Date, item2: Date}>(this.baseUri + 'api/DateTypes/IsDateTimeDate', JSON.stringify(dt), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/DateTypes/IsDateTimeOffsetDate
		 */
		isDateTimeOffsetDate(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: Date, item2: Date}> {
			return Axios.post<{item1: Date, item2: Date}>(this.baseUri + 'api/DateTypes/IsDateTimeOffsetDate', JSON.stringify(dt), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/DateTypes/ForDateOnly
		 * @return {Date} Type: DateOnly
		 */
		postDateOnly(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.post<Date>(this.baseUri + 'api/DateTypes/ForDateOnly', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/DateTypes/DateOnlyNullable
		 */
		postDateOnlyNullable(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.post<Date>(this.baseUri + 'api/DateTypes/DateOnlyNullable', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/DateTypes/ForDateTime
		 */
		postDateTime(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.post<Date>(this.baseUri + 'api/DateTypes/ForDateTime', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * return d;
		 * POST api/DateTypes/ForDateTimeOffset
		 */
		postDateTimeOffset(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.post<Date>(this.baseUri + 'api/DateTypes/ForDateTimeOffset', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * return d.ToString("O")
		 * POST api/DateTypes/ForDateTimeOffsetForO
		 */
		postDateTimeOffsetForO(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/DateTypes/ForDateTimeOffsetForO', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/DateTypes/ForDateTimeOffsetForOffset
		 */
		postDateTimeOffsetForOffset(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.post(this.baseUri + 'api/DateTypes/ForDateTimeOffsetForOffset', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' });
		}

		/**
		 * Returned is DateTimeOffset?
		 * POST api/DateTypes/DateTimeOffsetNullable
		 */
		postDateTimeOffsetNullable(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.post<Date>(this.baseUri + 'api/DateTypes/DateTimeOffsetNullable', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/DateTypes/ForDateTimeOffsetStringForOffset
		 */
		postDateTimeOffsetStringForOffset(s: string | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.post(this.baseUri + 'api/DateTypes/ForDateTimeOffsetStringForOffset', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' });
		}

		/**
		 * POST api/DateTypes/NextYear
		 */
		postNextYear(dt: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.post<Date>(this.baseUri + 'api/DateTypes/NextYear', JSON.stringify(dt), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * GET api/DateTypes/DateOnlyStringQuery?d={d}
		 * @return {Date} Type: DateOnly
		 */
		queryDateOnlyAsString(d: string | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/DateOnlyStringQuery?d=' + (!d ? '' : encodeURIComponent(d)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/DateTypes/RouteDateTimeOffset/{d}
		 */
		routeDateTimeOffset(d: Date | null, headersHandler?: () => {[header: string]: string}): Promise<Date> {
			return Axios.get<Date>(this.baseUri + 'api/DateTypes/RouteDateTimeOffset/' + d?.toISOString(), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Return Tuple DateTime?, DateTime?
		 * GET api/DateTypes/SearchDateRange?startDate={startDate}&endDate={endDate}
		 * @param {Date} startDate DateTime? startDate = null
		 * @param {Date} endDate DateTime? endDate = null
		 */
		searchDateRange(startDate: Date | null, endDate: Date | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: Date, item2: Date}> {
			return Axios.get<{item1: Date, item2: Date}>(this.baseUri + 'api/DateTypes/SearchDateRange?' + (startDate ? 'startDate=' + startDate?.toISOString() : '') + (endDate ? '&endDate=' + endDate?.toISOString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}
	}

	export class Entities {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * POST api/Entities/createCompany
		 */
		createCompany(p: DemoWebApi_DemoData_Client.Company | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Company> {
			return Axios.post<DemoWebApi_DemoData_Client.Company>(this.baseUri + 'api/Entities/createCompany', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Entities/createPerson
		 * @return {string} Type: long, -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
		 */
		createPerson(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post<string>(this.baseUri + 'api/Entities/createPerson', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Entities/createPerson2
		 */
		createPerson2(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/createPerson2', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Entities/createPerson3
		 */
		createPerson3(p: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/createPerson3', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * DELETE api/Entities/{id}
		 */
		delete(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.delete(this.baseUri + 'api/Entities/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Entities/Company/{id}
		 */
		getCompany(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Company> {
			return Axios.get<DemoWebApi_DemoData_Client.Company>(this.baseUri + 'api/Entities/Company/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * POST api/Entities/Mims
		 */
		getMims(p: DemoWebApi_DemoData_Client.MimsPackage | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.MimsResult<string>> {
			return Axios.post<DemoWebApi_DemoData_Client.MimsResult<string>>(this.baseUri + 'api/Entities/Mims', JSON.stringify(p), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Entities/MyGeneric
		 */
		getMyGeneric(s: DemoWebApi_DemoData_Client.MyGeneric<string, number, number> | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.MyGeneric<string, number, number>> {
			return Axios.post<DemoWebApi_DemoData_Client.MyGeneric<string, number, number>>(this.baseUri + 'api/Entities/MyGeneric', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Entities/MyGenericPerson
		 */
		getMyGenericPerson(s: DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person>> {
			return Axios.post<DemoWebApi_DemoData_Client.MyGeneric<string, number, DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/Entities/MyGenericPerson', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * Get a person
		 * so to know the person
		 * GET api/Entities/getPerson/{id}
		 * @param {string} id unique id of that guy
		 * @return {DemoWebApi_DemoData_Client.Person} person in db
		 */
		getPerson(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.get<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/getPerson/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Entities/getPerson2/{id}
		 */
		getPerson2(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.get<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Entities/getPerson2/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * PUT api/Entities/link?id={id}&relationship={relationship}
		 */
		linkPerson(id: string | null, relationship: string | null, person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return Axios.put<boolean>(this.baseUri + 'api/Entities/link?id=' + id + '&relationship=' + (!relationship ? '' : encodeURIComponent(relationship)), JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * PATCH api/Entities/patchPerson
		 */
		patchPerson(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.patch(this.baseUri + 'api/Entities/patchPerson', JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Entities/IdMap
		 */
		postIdMap(idMap: DemoWebApi_DemoData_Client.IdMap | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.IdMap> {
			return Axios.post<DemoWebApi_DemoData_Client.IdMap>(this.baseUri + 'api/Entities/IdMap', JSON.stringify(idMap), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * PUT api/Entities/updatePerson
		 */
		updatePerson(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.put(this.baseUri + 'api/Entities/updatePerson', JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}
	}

	export class Heroes {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * DELETE api/Heroes/{id}
		 */
		delete(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.delete(this.baseUri + 'api/Heroes/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * GET api/Heroes/asyncHeroes
		 */
		getAsyncHeroes(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_Controllers_Client.Hero>> {
			return Axios.get<Array<DemoWebApi_Controllers_Client.Hero>>(this.baseUri + 'api/Heroes/asyncHeroes', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Get a hero.
		 * GET api/Heroes/{id}
		 */
		getHero(id: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return Axios.get<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes/' + id, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Get all heroes.
		 * GET api/Heroes
		 */
		getHeros(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_Controllers_Client.Hero>> {
			return Axios.get<Array<DemoWebApi_Controllers_Client.Hero>>(this.baseUri + 'api/Heroes', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * POST api/Heroes
		 */
		post(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return Axios.post<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes', JSON.stringify(name), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * Add a hero
		 * POST api/Heroes/q?name={name}
		 */
		postWithQuery(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return Axios.post<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes/q?name=' + (!name ? '' : encodeURIComponent(name)), null, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Update hero.
		 * PUT api/Heroes
		 */
		put(hero: DemoWebApi_Controllers_Client.Hero | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_Controllers_Client.Hero> {
			return Axios.put<DemoWebApi_Controllers_Client.Hero>(this.baseUri + 'api/Heroes', JSON.stringify(hero), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * Search heroes
		 * GET api/Heroes/search/{name}
		 * @param {string} name keyword contained in hero name.
		 * @return {Array<DemoWebApi_Controllers_Client.Hero>} Hero array matching the keyword.
		 */
		search(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_Controllers_Client.Hero>> {
			return Axios.get<Array<DemoWebApi_Controllers_Client.Hero>>(this.baseUri + 'api/Heroes/search/' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}
	}

	export class Home {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * GET api/Home
		 */
		index(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<Blob>> {
			return Axios.get(this.baseUri + 'api/Home', { headers: headersHandler ? headersHandler() : undefined, responseType: 'blob' }).then(d => d.data);
		}
	}

	export class SuperDemo {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * GET api/SuperDemo/AthletheSearch?take={take}&skip={skip}&order={order}&sort={sort}&search={search}
		 */
		athletheSearch(take: number | null, skip: number | null, order: string | null, sort: string | null, search: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/SuperDemo/AthletheSearch?' + (take ? 'take=' + take.toString() : '') + '&skip=' + skip + '&order=' + (!order ? '' : encodeURIComponent(order)) + '&sort=' + (!sort ? '' : encodeURIComponent(sort)) + '&search=' + (!search ? '' : encodeURIComponent(search)), { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/SuperDemo/ActionResult
		 */
		getActionResult(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<string>> {
			return Axios.get(this.baseUri + 'api/SuperDemo/ActionResult', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/ActionResult2
		 */
		getActionResult2(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<string>> {
			return Axios.get(this.baseUri + 'api/SuperDemo/ActionResult2', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * GET api/SuperDemo/ActionStringResult
		 */
		getActionStringResult(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/SuperDemo/ActionStringResult', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/SuperDemo/bool
		 */
		getBool(headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return Axios.get<boolean>(this.baseUri + 'api/SuperDemo/bool', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/byte
		 * @return {number} Type: byte, 0 to 255
		 */
		getbyte(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/byte', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/ByteArray
		 */
		getByteArray(headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return Axios.get<Array<number>>(this.baseUri + 'api/SuperDemo/ByteArray', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/char
		 * @return {string} Type: char
		 */
		getChar(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get<string>(this.baseUri + 'api/SuperDemo/char', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/Collection
		 */
		getCollection(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/Collection', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/enumGet?d={d}
		 */
		getDay(d: DemoWebApi_DemoData_Client.Days | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Days> {
			return Axios.get<DemoWebApi_DemoData_Client.Days>(this.baseUri + 'api/SuperDemo/enumGet?d=' + d, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/decimal
		 * @return {number} Type: decimal
		 */
		getDecimal(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/decimal', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/decimalArrayQ?a={a}
		 */
		getDecimalArrayQ(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return Axios.get<Array<number>>(this.baseUri + 'api/SuperDemo/decimalArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/decimal/{d}
		 * @return {number} Type: decimal
		 */
		getDecimalSquare(d: number | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/decimal/' + d, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/DecimalZero
		 * @return {number} Type: decimal
		 */
		getDecimalZero(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/DecimalZero', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/StringStringDic
		 */
		getDictionary(headersHandler?: () => {[header: string]: string}): Promise<{[id: string]: string }> {
			return Axios.get<{[id: string]: string }>(this.baseUri + 'api/SuperDemo/StringStringDic', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/StringPersonDic
		 */
		getDictionaryOfPeople(headersHandler?: () => {[header: string]: string}): Promise<{[id: string]: DemoWebApi_DemoData_Client.Person }> {
			return Axios.get<{[id: string]: DemoWebApi_DemoData_Client.Person }>(this.baseUri + 'api/SuperDemo/StringPersonDic', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/doulbe
		 * @return {number} Type: double
		 */
		getdouble(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/doulbe', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Result of 0.1d + 0.2d - 0.3d
		 * GET api/SuperDemo/DoubleZero
		 * @return {number} Type: double
		 */
		getDoubleZero(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/DoubleZero', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/EmptyString
		 */
		getEmptyString(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/SuperDemo/EmptyString', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/SuperDemo/enumArrayDays?a={a}
		 */
		getEnumArrayDays(a: Array<DemoWebApi_DemoData_Client.Days> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Days>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Days>>(this.baseUri + 'api/SuperDemo/enumArrayDays?'+a?.map(z => `a=${z}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/enumArrayQ2?a={a}
		 */
		getEnumArrayQ2(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return Axios.get<Array<number>>(this.baseUri + 'api/SuperDemo/enumArrayQ2?'+a?.map(z => `a=${z}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/FloatZero
		 * @return {number} Type: float
		 */
		getFloatZero(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/FloatZero', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/ICollection
		 */
		getICollection(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/ICollection', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/IList
		 */
		getIList(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/IList', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/int2d
		 */
		getInt2D(headersHandler?: () => {[header: string]: string}): Promise<number[][]> {
			return Axios.get<number[][]>(this.baseUri + 'api/SuperDemo/int2d', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/int2dJagged
		 */
		getInt2DJagged(headersHandler?: () => {[header: string]: string}): Promise<Array<Array<number>>> {
			return Axios.get<Array<Array<number>>>(this.baseUri + 'api/SuperDemo/int2dJagged', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/intArray
		 */
		getIntArray(headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return Axios.get<Array<number>>(this.baseUri + 'api/SuperDemo/intArray', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/intArrayQ?a={a}
		 */
		getIntArrayQ(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<number>> {
			return Axios.get<Array<number>>(this.baseUri + 'api/SuperDemo/intArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/intArrayQ2?a={a}
		 */
		getIntArrayQ2(a: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return Axios.get<Array<string>>(this.baseUri + 'api/SuperDemo/intArrayQ2?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/int/{d}
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		getIntSquare(d: number | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/int/' + d, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/IReadOnlyCollection
		 */
		getIReadOnlyCollection(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/IReadOnlyCollection', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/IReadOnlyList
		 */
		getIReadOnlyList(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/IReadOnlyList', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/KeyValuePair
		 */
		getKeyhValuePair(headersHandler?: () => {[header: string]: string}): Promise<{key: string, value: DemoWebApi_DemoData_Client.Person }> {
			return Axios.get<{key: string, value: DemoWebApi_DemoData_Client.Person }>(this.baseUri + 'api/SuperDemo/KeyValuePair', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/List
		 */
		getList(headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Person>> {
			return Axios.get<Array<DemoWebApi_DemoData_Client.Person>>(this.baseUri + 'api/SuperDemo/List', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/NullableDecimal/{hasValue}
		 */
		getNullableDecimal(hasValue: boolean | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/NullableDecimal/' + hasValue, { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/NullObject
		 */
		getNullPerson(headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.get<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/SuperDemo/NullObject', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/NullString
		 */
		getNullString(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/SuperDemo/NullString', { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/SuperDemo/DoubleNullable?location={location}&dd={dd}&de={de}
		 */
		getPrimitiveNullable(location: string | null, dd: number | null, de: number | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: number, item3: number}> {
			return Axios.get<{item1: string, item2: number, item3: number}>(this.baseUri + 'api/SuperDemo/DoubleNullable?location=' + (!location ? '' : encodeURIComponent(location)) + (dd ? '&dd=' + dd.toString() : '') + (de ? '&de=' + de.toString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/DoubleNullable2?dd={dd}&de={de}
		 */
		getPrimitiveNullable2(dd: number | null, de: number | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: number, item2: number}> {
			return Axios.get<{item1: number, item2: number}>(this.baseUri + 'api/SuperDemo/DoubleNullable2?' + (dd ? 'dd=' + dd.toString() : '') + (de ? '&de=' + de.toString() : ''), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/sbyte
		 * @return {number} Type: sbyte, -128 to 127
		 */
		getsbyte(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/sbyte', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/short
		 * @return {number} Type: short, -32,768 to 32,767
		 */
		getShort(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/short', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/stringArrayQ?a={a}
		 */
		getStringArrayQ(a: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return Axios.get<Array<string>>(this.baseUri + 'api/SuperDemo/stringArrayQ?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/stringArrayQ2?a={a}
		 */
		getStringArrayQ2(a: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return Axios.get<Array<string>>(this.baseUri + 'api/SuperDemo/stringArrayQ2?'+a?.map(z => `a=${encodeURIComponent(z)}`).join('&'), { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/TextStream
		 */
		getTextStream(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<Blob>> {
			return Axios.get(this.baseUri + 'api/SuperDemo/TextStream', { headers: headersHandler ? headersHandler() : undefined, responseType: 'blob' }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/uint
		 * @return {number} Type: uint, 0 to 4,294,967,295
		 */
		getUint(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/uint', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/ulong
		 * @return {string} Type: ulong, 0 to 18,446,744,073,709,551,615
		 */
		getulong(headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get<string>(this.baseUri + 'api/SuperDemo/ulong', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/SuperDemo/ushort
		 * @return {number} Type: ushort, 0 to 65,535
		 */
		getUShort(headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.get<number>(this.baseUri + 'api/SuperDemo/ushort', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/ActionResult
		 */
		postActionResult(headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<string>> {
			return Axios.post(this.baseUri + 'api/SuperDemo/ActionResult', null, { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' });
		}

		/**
		 * POST api/SuperDemo/PostActionResult2
		 */
		postActionResult2(s: string | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<Blob>> {
			return Axios.post(this.baseUri + 'api/SuperDemo/PostActionResult2', JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'blob' }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/PostActionResult3
		 */
		postActionResult3(person: DemoWebApi_DemoData_Client.Person | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse<string>> {
			return Axios.post(this.baseUri + 'api/SuperDemo/PostActionResult3', JSON.stringify(person), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' }, responseType: 'text' });
		}

		/**
		 * POST api/SuperDemo/Collection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postCollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/Collection', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/enumPost?d={d}
		 */
		postDay(d: DemoWebApi_DemoData_Client.Days | null, d2: DemoWebApi_DemoData_Client.Days | null, headersHandler?: () => {[header: string]: string}): Promise<Array<DemoWebApi_DemoData_Client.Days>> {
			return Axios.post<Array<DemoWebApi_DemoData_Client.Days>>(this.baseUri + 'api/SuperDemo/enumPost?d=' + d, JSON.stringify(d2), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/StringPersonDic
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postDictionary(dic: {[id: string]: DemoWebApi_DemoData_Client.Person } | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/StringPersonDic', JSON.stringify(dic), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/Guids
		 */
		postGuids(guids: Array<string> | null, headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return Axios.post<Array<string>>(this.baseUri + 'api/SuperDemo/Guids', JSON.stringify(guids), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/ICollection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postICollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/ICollection', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/IList
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/IList', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/int2d
		 */
		postInt2D(a: number[][] | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return Axios.post<boolean>(this.baseUri + 'api/SuperDemo/int2d', JSON.stringify(a), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/int2djagged
		 */
		postInt2DJagged(a: Array<Array<number>> | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return Axios.post<boolean>(this.baseUri + 'api/SuperDemo/int2djagged', JSON.stringify(a), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/intArray
		 */
		postIntArray(a: Array<number> | null, headersHandler?: () => {[header: string]: string}): Promise<boolean> {
			return Axios.post<boolean>(this.baseUri + 'api/SuperDemo/intArray', JSON.stringify(a), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/IReadOnlyCollection
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIReadOnlyCollection(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/IReadOnlyCollection', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/IReadOnlyList
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postIReadOnlyList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/IReadOnlyList', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/List
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postList(list: Array<DemoWebApi_DemoData_Client.Person> | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/SuperDemo/List', JSON.stringify(list), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/SuperDemo/PostEmpty/{i}
		 */
		postWithQueryButEmptyBody(s: string | null, i: number | null, headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: number}> {
			return Axios.post<{item1: string, item2: number}>(this.baseUri + 'api/SuperDemo/PostEmpty/' + i, JSON.stringify(s), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}
	}

	export class Tuple {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * POST api/Tuple/ChangeName
		 */
		changeName(d: {item1: string, item2: DemoWebApi_DemoData_Client.Person} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/ChangeName', JSON.stringify(d), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/PeopleCompany4
		 */
		getPeopleCompany4(headersHandler?: () => {[header: string]: string}): Promise<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company}> {
			return Axios.get<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company}>(this.baseUri + 'api/Tuple/PeopleCompany4', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/PeopleCompany5
		 */
		getPeopleCompany5(headersHandler?: () => {[header: string]: string}): Promise<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company}> {
			return Axios.get<{item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company}>(this.baseUri + 'api/Tuple/PeopleCompany5', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple1
		 */
		getTuple1(headersHandler?: () => {[header: string]: string}): Promise<{item1: number}> {
			return Axios.get<{item1: number}>(this.baseUri + 'api/Tuple/Tuple1', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple2
		 */
		getTuple2(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: number}> {
			return Axios.get<{item1: string, item2: number}>(this.baseUri + 'api/Tuple/Tuple2', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple3
		 */
		getTuple3(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: number}> {
			return Axios.get<{item1: string, item2: string, item3: number}>(this.baseUri + 'api/Tuple/Tuple3', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple4
		 */
		getTuple4(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: number}> {
			return Axios.get<{item1: string, item2: string, item3: string, item4: number}>(this.baseUri + 'api/Tuple/Tuple4', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple5
		 */
		getTuple5(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: number}> {
			return Axios.get<{item1: string, item2: string, item3: string, item4: string, item5: number}>(this.baseUri + 'api/Tuple/Tuple5', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple6
		 */
		getTuple6(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: number}> {
			return Axios.get<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: number}>(this.baseUri + 'api/Tuple/Tuple6', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple7
		 */
		getTuple7(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number}> {
			return Axios.get<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number}>(this.baseUri + 'api/Tuple/Tuple7', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * GET api/Tuple/Tuple8
		 */
		getTuple8(headersHandler?: () => {[header: string]: string}): Promise<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number, rest: {item1: string, item2: string, item3: string}}> {
			return Axios.get<{item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number, rest: {item1: string, item2: string, item3: string}}>(this.baseUri + 'api/Tuple/Tuple8', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany2
		 */
		linkPeopleCompany2(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany2', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany3
		 */
		linkPeopleCompany3(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany3', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany4
		 */
		linkPeopleCompany4(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany4', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany5
		 */
		linkPeopleCompany5(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany5', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany6
		 */
		linkPeopleCompany6(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany6', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany7
		 */
		linkPeopleCompany7(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Person, item7: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany7', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PeopleCompany8
		 */
		linkPeopleCompany8(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Person, item3: DemoWebApi_DemoData_Client.Person, item4: DemoWebApi_DemoData_Client.Person, item5: DemoWebApi_DemoData_Client.Person, item6: DemoWebApi_DemoData_Client.Person, item7: DemoWebApi_DemoData_Client.Person, rest: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PeopleCompany8', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/PersonCompany1
		 */
		linkPersonCompany1(peopleAndCompany: {item1: DemoWebApi_DemoData_Client.Person, item2: DemoWebApi_DemoData_Client.Company} | null, headersHandler?: () => {[header: string]: string}): Promise<DemoWebApi_DemoData_Client.Person> {
			return Axios.post<DemoWebApi_DemoData_Client.Person>(this.baseUri + 'api/Tuple/PersonCompany1', JSON.stringify(peopleAndCompany), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/Tuple1
		 * @return {number} Type: int, -2,147,483,648 to 2,147,483,647
		 */
		postTuple1(tuple: {item1: number} | null, headersHandler?: () => {[header: string]: string}): Promise<number> {
			return Axios.post<number>(this.baseUri + 'api/Tuple/Tuple1', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' } }).then(d => d.data);
		}

		/**
		 * POST api/Tuple/Tuple2
		 */
		postTuple2(tuple: {item1: string, item2: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple2', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Tuple/Tuple3
		 */
		postTuple3(tuple: {item1: string, item2: string, item3: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple3', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Tuple/Tuple4
		 */
		postTuple4(tuple: {item1: string, item2: string, item3: string, item4: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple4', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Tuple/Tuple5
		 */
		postTuple5(tuple: {item1: string, item2: string, item3: string, item4: string, item5: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple5', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Tuple/Tuple6
		 */
		postTuple6(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple6', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Tuple/Tuple7
		 */
		postTuple7(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: number} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple7', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * POST api/Tuple/Tuple8
		 */
		postTuple8(tuple: {item1: string, item2: string, item3: string, item4: string, item5: string, item6: string, item7: string, rest: {item1: string, item2: string, item3: string}} | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Tuple/Tuple8', JSON.stringify(tuple), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}
	}

	export class Values {
		constructor(private baseUri: string = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/') {
		}

		/**
		 * DELETE api/Values/{id}
		 */
		delete(id: number | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.delete(this.baseUri + 'api/Values/' + id, { headers: headersHandler ? headersHandler() : undefined });
		}

		/**
		 * Get a list of value
		 * GET api/Values
		 */
		get(headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return Axios.get<Array<string>>(this.baseUri + 'api/Values', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * Get by both Id and name
		 * GET api/Values/{id}?name={name}
		 */
		getByIdOfnumberAndNameOfstring(id: number | null, name: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/Values/' + id + '?name=' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/Values?name={name}
		 */
		getByNameOfstring(name: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/Values?name=' + (!name ? '' : encodeURIComponent(name)), { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/Values/{id}
		 */
		getByIdOfnumber(id: number | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.get(this.baseUri + 'api/Values/' + id, { headers: headersHandler ? headersHandler() : undefined, responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * GET api/Values/Get2
		 */
		get2(headersHandler?: () => {[header: string]: string}): Promise<Array<string>> {
			return Axios.get<Array<string>>(this.baseUri + 'api/Values/Get2', { headers: headersHandler ? headersHandler() : undefined }).then(d => d.data);
		}

		/**
		 * POST api/Values
		 */
		post(value: string | null, headersHandler?: () => {[header: string]: string}): Promise<string> {
			return Axios.post(this.baseUri + 'api/Values', JSON.stringify(value), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' }).then(d => d.status == 204 ? null : d.data);
		}

		/**
		 * Update with valjue
		 * PUT api/Values/{id}
		 */
		put(id: number | null, value: string | null, headersHandler?: () => {[header: string]: string}): Promise<AxiosResponse> {
			return Axios.put(this.baseUri + 'api/Values/' + id, JSON.stringify(value), { headers: headersHandler ? Object.assign(headersHandler(), { 'Content-Type': 'application/json;charset=UTF-8' }): { 'Content-Type': 'application/json;charset=UTF-8' },  responseType: 'text' });
		}
	}

}

