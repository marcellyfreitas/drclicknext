/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '..';

const basePath = '/private/exames';

export class PrivateExamService implements BaseService {
	httpClient;

	constructor(httpClient: any) {
		this.httpClient = httpClient;
	}

	getAll(params?: object): Promise<any> {
		try {
			return this.httpClient.get(`${basePath}`, { params });
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	getById(id: string | number): Promise<any> {
		try {
			return this.httpClient.get(`${basePath}/${id}`);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	create(data: object): Promise<any> {
		try {
			return this.httpClient.post(`${basePath}`, data);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	update(id: string | number, data: object): Promise<any> {
		try {
			return this.httpClient.put(`${basePath}/${id}`, data);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	delete(id: string | number): Promise<any> {
		try {
			return this.httpClient.delete(`${basePath}/${id}`);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
}