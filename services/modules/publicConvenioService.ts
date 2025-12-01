/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '..';

const basePath = '/public/convenios';

export class PublicConvenioService implements BaseService {
	httpClient: any;

	constructor(httpClient: any) {
		this.httpClient = httpClient;
		console.log('API Base URL:', this.httpClient.defaults.baseURL);
	}

	getAll(params?: object): Promise<any> {
		try {
			return this.httpClient.get(`${basePath}`, { params });
		} catch (error) {
			console.error(error);
			throw new Error('Erro ao buscar convênios');
		}
	}

	getById(id: string | number): Promise<any> {
		try {
			return this.httpClient.get(`${basePath}/${id}`);
		} catch (error) {
			console.error(error);
			throw new Error('Erro ao buscar convênio');
		}
	}

	create(): Promise<any> {
		throw new Error('Operação não permitida');
	}

	update(): Promise<any> {
		throw new Error('Operação não permitida');
	}

	delete(): Promise<any> {
		throw new Error('Operação não permitida');
	}
}
