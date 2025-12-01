import { NextResponse } from 'next/server';

export async function POST() {
	return NextResponse.json(
		{ success: true },
		{
			status: 200,
			headers: {
				'Set-Cookie': 'user-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
			},
		}
	);
}
