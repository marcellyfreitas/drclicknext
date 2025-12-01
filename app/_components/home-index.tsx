'use client';

// import { useEffect } from 'react';
import HomeBeneficios from './home-beneficios';
import HomeFooter from './home-footer';
import HomeHero from './home-hero';
import HomeMobileapp from './home-mobileapp';
import HomeNavbar from './home-navbar';
import HomeSobre from './home-sobre';
// import axios from 'axios';

export default function HomeIndex() {
	// useEffect(() => {
	// 	const handleLogin = async () => {
	// 		try {
	// 			const response = await axios.post('https://drclick-api-a3bmbagyhebydzeb.canadacentral-01.azurewebsites.net/api/v1/auth/admin/login', {
	// 				email: 'admin@email.com',
	// 				password: 'senha',
	// 			});

	// 			// eslint-disable-next-line no-console
	// 			console.log('response', response);
	// 		} catch (error) {
	// 			console.error('Login failed', error);
	// 		}
	// 	};
	// 	handleLogin();
	// }, []);

	return (
		<main className="flex min-h-screen flex-col">
			<HomeNavbar />

			<HomeHero />

			<HomeMobileapp />

			<HomeBeneficios />

			<HomeSobre />

			<HomeFooter />
		</main>
	);
}