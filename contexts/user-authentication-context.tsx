// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
	id: string
	initials: string
	name: string
	email: string
	avatar: string
	profile?: 'admin' | 'user'
}

type UserAuthenticationContextType = {
	user: User
	loading: boolean
	logout: () => Promise<void>
	fetchUser: (call?: boolean) => Promise<void>
}

const UserAuthenticationContext = createContext<UserAuthenticationContextType | undefined>(undefined);
const defaultUser = {
	initials: 'JD',
	id: '',
	name: '',
	email: '',
	avatar: 'https://github.com/shadcn.png',
	profile: undefined,
} as User;

type Props = {
	children: ReactNode,
	profile: 'admin' | 'user'
}

export function UserAuthenticationProvider({ children, profile }: Props) {
	const [user, setUser] = useState<User>(defaultUser);
	const [loading, setLoading] = useState(true);
	const [counter, setCounter] = useState(0);

	const LOGOUTPATH = profile === 'admin' ? '/api/authentication/admin/logout' : '/api/authentication/user/logout';
	const FETCHPROFILEPATH = profile === 'admin' ? '/api/authentication/admin/profile' : '/api/authentication/user/profile';

	useEffect(() => {
		if (user.profile !== profile) {
			setUser(defaultUser);
		}
	}, [profile, user.profile]);

	async function fetchUser(callCaunter = true) {
		try {
			setLoading(true);

			if (counter > 1) {
				return;
			}

			const res = await fetch(FETCHPROFILEPATH);
			if (res.ok) {
				const { data } = await res.json();
				setUser({
					profile,
					...user,
					...data,
				});
			} else {
				setUser(defaultUser);
			}

			if (callCaunter) {
				setCounter(prev => prev + 1);
			}

		} catch (error) {
			console.error(error);
			setUser(defaultUser);
		} finally {
			setLoading(false);
		}
	}

	async function logout() {
		await fetch(LOGOUTPATH, { method: 'POST' });
		setUser(defaultUser);
	}

	return (
		<UserAuthenticationContext.Provider value={{ user, loading, logout, fetchUser }}>
			{children}
		</UserAuthenticationContext.Provider>
	);
}

export function useUserAuthentication() {
	const ctx = useContext(UserAuthenticationContext);
	if (!ctx) throw new Error('useAuth deve estar dentro do AuthProvider');
	return ctx;
}
