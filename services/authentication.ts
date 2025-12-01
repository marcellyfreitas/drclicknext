
export class AuthenticationService {
	private readonly httpClient: any;

	constructor(httpClient: any) {
		this.httpClient = httpClient;
	}

	adminLogin(username: string, password: string): Promise<any> {
		return this.httpClient.post('/auth/admin/login', { email: username, password });
	}

	userLogin(username: string, password: string): Promise<any> {
		return this.httpClient.post('/auth/user/login', { email: username, password });
	}

	getAdminProfile(): Promise<any> {
		return this.httpClient.get('/auth/admin');
	}

	getUserProfile(): Promise<any> {
		return this.httpClient.get('/auth/user');
	}

	userRegister(data = {}) {
		return this.httpClient.post('/auth/user/register', data);
	}

}