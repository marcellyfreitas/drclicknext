'use client';

import React from 'react';
import { Container } from '@/components/dashboard/container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUserAuthentication } from '@/contexts/user-authentication-context';

const MinhaContaIndex = () => {
	const { user } = useUserAuthentication();

	return (
		<Container>
			<h1 className="text-2xl font-semibold">Minha conta</h1>

			<Card>
				<CardHeader>
					<h2 className="font-semibold"> Meus dados</h2>
				</CardHeader>

				<CardContent>
					<ul>
						<li><b>Nome: </b> {user.name}</li>
						<li><b>Email: </b> {user.email}</li>
					</ul>
				</CardContent>
			</Card>
		</Container>
	);
};

export default MinhaContaIndex;