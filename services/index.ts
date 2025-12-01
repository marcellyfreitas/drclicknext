
import axios from 'axios';
import Cookies from 'js-cookie';

const httpClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
	const adminToken = Cookies.get('admin-token');
	const userToken = Cookies.get('user-token');

	if ((config.url?.includes('/private') || config.url?.includes('/auth/admin')) && adminToken) {
		config.headers.Authorization = `Bearer ${adminToken}`;
	} else if ((config.url?.includes('/auth/user') || config.url?.includes('/public')) && userToken) {
		config.headers.Authorization = `Bearer ${userToken}`;
	}
	return config;
});

export interface BaseService {
	getAll: (params?: object) => Promise<any>;
	getFiltrados?: (params?: object) => Promise<any>;
	getById: (id: string | number) => Promise<any>;
	create: (data: object) => Promise<any>;
	update: (id: string | number, data: object) => Promise<any>;
	delete: (id: string | number) => Promise<any>;
}

export { httpClient };
