
import { NextResponse } from 'next/server';
import { AuthenticationService } from '@/services/authentication';
import { httpClient } from '@/services';

export async function POST(req: Request) {
	const { email, password } = await req.json();
	const service = new AuthenticationService(httpClient);

	try {
		const response = await service.adminLogin(email, password);

		const responseData = response.data;

		if (response.status === 200 && responseData?.data?.token) {
			const token = responseData.data.token;

			return NextResponse.json(
				{ success: true, message: responseData.message },
				{
					status: 200,
					headers: {
						'Set-Cookie': `admin-token=${token}; Path=/; SameSite=Strict`,
					},
				}
			);
		}

		return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
	} catch (error: any) {
		console.error(error);

		if (error?.response?.status === 401) {
			return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
		}

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}

}
