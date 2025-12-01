import { CheckCircle } from 'lucide-react';
import React from 'react';
import { Button } from '../../components/ui/button';
import { IconBrandAndroid } from '@tabler/icons-react';

const HomeMobileapp = () => {
	return (
		<div className="min-h-[50vh] bg-white flex text-slate-800">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10">
					<div className="flex flex-col justify-center gap-6">
						<div className="grid gap-2">
							<h2 className="text-3xl font-bold mb-4">Baixe nosso aplicativo móvel</h2>
							<p>Acesse seus agendamentos, resultados de exames e muito mais diretamente do seu celular.</p>
						</div>

						<ul className="grid gap-4">
							<li className="flex gap-2 items-center"><CheckCircle className="text-emerald-700" /> Agendamento facilitado</li>
							<li className="flex gap-2 items-center"><CheckCircle className="text-emerald-700" /> Consulte unidades mais próximas</li>
							<li className="flex gap-2 items-center"><CheckCircle className="text-emerald-700" /> Pesquise por médicos e especialidades</li>
							<li className="flex gap-2 items-center"><CheckCircle className="text-emerald-700" /> Fácil de usar</li>
						</ul>

						<div className="flex space-x-4">
							<Button className="cursor-pointer">
								<IconBrandAndroid />

								Baixar aplicativo
							</Button>
						</div>
					</div>
					<div className="flex justify-center items-center">
						<img src="/images/phone.png" alt="Mobile App Mockup" className="w-3/4 h-auto" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeMobileapp;