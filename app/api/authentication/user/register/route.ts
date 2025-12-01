import { NextResponse } from 'next/server';
import { AuthenticationService } from '@/services/authentication';
import { httpClient } from '@/services';

export async function POST(req: Request) {
	const { name, email, cpf, password } = await req.json();

	const service = new AuthenticationService(httpClient);

	const payload = { name, email, cpf, password };

	try {
		const response = await service.userRegister(payload);
		const responseData = response.data;

		if (response.status === 200 && responseData?.data?.token) {
			const token = responseData.data.token;

			return NextResponse.json(
				{ success: true, message: responseData.message },
				{
					status: 200,
					headers: {
						'Set-Cookie': `user-token=${token}; Path=/; SameSite=Strict`,
					},
				}
			);
		}

		return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
	} catch (error: any) {
		console.error(error);

		const status = error?.response?.status ?? 500;
		const message =
			error?.response?.data?.message ||
			error?.message ||
			'Erro inesperado';

		return NextResponse.json(
			{
				error: 'Dados inválidos',
				message,
				status,
			},
			{ status }
		);
	}
}
