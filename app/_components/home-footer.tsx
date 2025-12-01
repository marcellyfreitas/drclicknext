import React from 'react';
import { Button } from '@/components/ui/button';
import { IconBrandFacebook, IconBrandGooglePlay, IconBrandInstagram, IconBrandLinkedin, IconBrandYoutube } from '@tabler/icons-react';
import Link from 'next/link';

const HomeFooter = () => {
	return (
		<footer className="bg-primary text-secondary border-t">
			<div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<h4 className="font-semibold mb-3">
						Dr. Click
					</h4>

					<div className="grid gap-4">
						<p>Agende sua consulta de forma rápida e segura. Sua saúde e bem-estar são nossa prioridade!</p>
						<p>Rua Camilo Gonçalves, 224, Centro. Belo Horizonte - Minas Gerais</p>
						<p>(31) 3244-5555</p>
					</div>
				</div>

				<div className="">
					<h4 className="font-semibold mb-3">Navegue pelo nosso site</h4>

					<ul>
						<li><Link className="hover:underline cursor-pointer" href="#">Sobre nós</Link></li>
						<li><Link className="hover:underline cursor-pointer" href="#">Ajuda?</Link></li>
						<li><Link className="hover:underline cursor-pointer" href="#">Contato</Link></li>
					</ul>
				</div>

				<div>
					<h4 className="font-semibold mb-3 text-secondary">
						Já é cliente? Baixe o aplicativo para usar seus benefícios.
					</h4>
					<div className="grid grid-cols-1 gap-2">
						<Button className="cursor-pointer" variant={'secondary'}>
							<IconBrandGooglePlay />
							Baixe o aplicativo
						</Button>
					</div>
				</div>

				<div>
					<h4 className="font-semibold mb-3 text-secondary">
						Continue conectado com a Dr. Click nas redes sociais
					</h4>
					<div className="flex items-center gap-4 text-gray-500">
						<a href="#" aria-label="Instagram">
							<IconBrandInstagram />
						</a>
						<a href="#" aria-label="Facebook">
							<IconBrandFacebook />
						</a>
						<a href="#" aria-label="YouTube">
							<IconBrandYoutube />
						</a>
						<a href="#" aria-label="LinkedIn">
							<IconBrandLinkedin />
						</a>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 pb-8 text-xs space-y-2">
				<p>Copyright © {new Date().getFullYear()} Dr. Click. Todos os direitos reservados.</p>
			</div>
		</footer>
	);
};

export default HomeFooter;
