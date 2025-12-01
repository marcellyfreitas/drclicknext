'use client';

import React from 'react';
import { useUserAuthentication } from '@/contexts/user-authentication-context';

const WelcomeUser = () => {
	const { user } = useUserAuthentication();
	return (
		<h1 className="text-2xl font-semibold">
			Bem vindo, {String(user.name).split(' ').at(0)}!
		</h1>
	);
};

export default WelcomeUser;