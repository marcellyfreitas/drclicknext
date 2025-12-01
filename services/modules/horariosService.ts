
import { BaseService } from '..';

export class HorariosService implements BaseService {
	httpClient;
	basePath;

	constructor(httpClient: any, basePath: string = '/private/horarios') {
		this.httpClient = httpClient;
		this.basePath = basePath;
	}

	getAll(params?: object): Promise<any> {
		try {
			return this.httpClient.get(`${this.basePath}/filtrados`, { params });
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	getById(id: string | number): Promise<any> {
		try {
			return this.httpClient.get(`${this.basePath}/${id}`);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	create(data: object): Promise<any> {
		try {
			return this.httpClient.post(`${this.basePath}`, data);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	update(id: string | number, data: object): Promise<any> {
		try {
			return this.httpClient.put(`${this.basePath}/${id}`, data);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
	delete(id: string | number): Promise<any> {
		try {
			return this.httpClient.delete(`${this.basePath}/${id}`);
		} catch (error) {
			console.error(error);
			throw new Error('Method not implemented.');
		}
	}
}