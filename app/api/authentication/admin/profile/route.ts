
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
	try {
		const cookieStore = await cookies();
		const userToken = cookieStore.get('admin-token')?.value;

		if (!userToken) {
			return NextResponse.json({ error: 'No token provided' }, { status: 401 });
		}

		const { data: { data }, status } = await axios.request({
			method: 'GET',
			url: `${process.env.NEXT_PUBLIC_API_URL}/auth/admin`,
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});

		if (status === 200 && data) {
			const userProfile = data;

			return NextResponse.json(
				{ success: true, data: userProfile, message: data.message },
				{
					status: 200,
					headers: {
						'Set-Cookie': `admin-profile=${JSON.stringify(userProfile)}; Path=/; SameSite=Strict`,
					},
				}
			);
		}

		return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
	} catch (error: any) {
		console.error('Erro na rota profile:', error.response.headers);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
