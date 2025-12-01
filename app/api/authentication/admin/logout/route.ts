import { NextResponse } from 'next/server';

export async function POST() {
	// remove o cookie token
	return NextResponse.json(
		{ success: true },
		{
			status: 200,
			headers: {
				'Set-Cookie': 'admin-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
			},
		}
	);
}
