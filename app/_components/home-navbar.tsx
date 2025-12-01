import { GridIcon, Lock, Menu } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const HomeNavbar = () => {
	return (
		<nav className="w-full h-[var(--home-navbar-header-height)] bg-white shadow-md">
			<div className="container flex items-center justify-between gap-4 mx-auto h-full px-4">

				<div className="flex items-center gap-2">
					<GridIcon />
					<h1 className="text-2xl font-bold">Dr. Click</h1>
				</div>

				<div className="flex-1 hidden lg:flex justify-between items-center gap-5">
					<div className="flex justify-center flex-1 w-full">
						<ul className="flex items-center gap-6">
							<li><Link href="" className="hover:underline font-semibold">Sobre nós</Link></li>
							<li><Link href="" className="hover:underline font-semibold">Ajuda?</Link></li>
							<li><Link href="" className="hover:underline font-semibold">Contatos</Link></li>
						</ul>
					</div>

					<div className="flex items-center gap-2">
						<Link href="/usuario/agendamentos" className="no-underline">
							<Button className="cursor-pointer">Quero agendar</Button>
						</Link>
						<Link href="/dashboard" className="no-underline">
							<Button className="cursor-pointer" variant={'ghost'}>
								<Lock />
								Área restrita
							</Button>
						</Link>
					</div>
				</div>

				<div className="flex lg:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant={'ghost'}
								className="rounded-full cursor-pointer"
								size={'icon'}
							>
								<Menu />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<div className="p-4 grid gap-5">
								<div>
									<ul className="flex flex-col gap-6">
										<li><Link href="" className="hover:underline font-semibold">Sobre nós</Link></li>
										<li><Link href="" className="hover:underline font-semibold">Ajuda?</Link></li>
										<li><Link href="" className="hover:underline font-semibold">Contatos</Link></li>
									</ul>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<Link href="/usuario/agendamentos" className="no-underline">
										<Button className="cursor-pointer">Quero agendar</Button>
									</Link>
									<Link href="/dashboard" className="no-underline">
										<Button className="cursor-pointer" variant={'ghost'}>
											<Lock />
											Área restrita
										</Button>
									</Link>
								</div>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
};

export default HomeNavbar;