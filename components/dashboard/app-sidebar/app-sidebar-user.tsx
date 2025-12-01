'use client';

import {
	IconLogout,
	IconUserCircle,
} from '@tabler/icons-react';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useUserAuthentication } from '@/contexts/user-authentication-context';
import { useEffect } from 'react';

type Props = {
	profile: 'admin' | 'user';
}

export function NavUser({ profile }: Props) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const { user, fetchUser } = useUserAuthentication();

	const logoutPath = profile === 'admin' ? '/api/authentication/admin/logout' : '/api/authentication/user/logout';
	const redirectPath = profile === 'admin' ? '/authentication/admin/login' : '/authentication/user/login';
	const profilePath = profile === 'admin' ? '/dashboard/minha-conta' : '/usuario/minha-conta';

	useEffect(() => {
		if (!user.email) {
			fetchUser();
		}
	}, [user, fetchUser]);

	async function handleLogout() {
		await fetch(logoutPath, { method: 'POST' });
		router.push(redirectPath);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="cursor-pointer">
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar>
								<AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} />
								<AvatarFallback>{user.initials}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="text-muted-foreground truncate text-xs">
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href={profilePath}>
								<DropdownMenuItem className="cursor-pointer">
									<IconUserCircle />
									Minha conta
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu >
	);
}
