'use client';
import React, { ComponentProps } from 'react';
// import { NavDocuments } from '@/components/dashboard/app-sidebar/app-sidebar-documents';
import { NavMain } from '@/components/dashboard/app-sidebar/app-sidebar-main';
import { NavUser } from '@/components/dashboard/app-sidebar/app-sidebar-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard } from 'lucide-react';
import { sidebarLinks } from '@/utils';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
	profileType: 'admin' | 'user';
};

export function AppSidebar({ profileType, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="#">
								<LayoutDashboard className="!size-5" />
								<span className="text-base font-semibold">DR. CLICK.</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{profileType === 'admin' && (
					<NavMain items={sidebarLinks.navMain} />
				)}

				{profileType === 'user' && (
					<NavMain items={sidebarLinks.navUser} />
				)}
				{/* {profileType === 'admin' && (
					<NavSecondary items={sidebarLinks.navSecondary} className="mt-auto" />
				)} */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser profile={profileType} />
			</SidebarFooter>
		</Sidebar>
	);
}
