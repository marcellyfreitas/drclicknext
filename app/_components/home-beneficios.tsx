import { CalendarCheckIcon, PhoneCall, ShieldCheckIcon, TargetIcon } from 'lucide-react';
import React from 'react';

const HomeBeneficios = () => {
	const beneficios = [
		{ title: 'Atendimento facilitado', icon: <PhoneCall size={50} />, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, laboriosam?' },
		{ title: 'Agilidade', icon: <TargetIcon size={50} />, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, laboriosam?' },
		{ title: 'Segurança', icon: <ShieldCheckIcon size={50} />, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, laboriosam?' },
		{ title: 'Registro de histórico', icon: <CalendarCheckIcon size={50} />, description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, laboriosam?' },
	];

	return (
		<div className="min-h-[50vh] bg-slate-100 flex">
			<div className="container mx-auto px-4">
				<div className="flex flex-col gap-20 text-primary items-center py-10">
					<div className="flex flex-col gap-4 justify-center items-center">
						<h1 className="text-2xl font-semibold">Benefícios</h1>
						<p>Consulte um proficional geral da Dr. Click se você deseja:</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{beneficios.map((beneficio, index) => (
							<div className="flex flex-col justify-center items-center gap-4" key={index}>
								{beneficio.icon}

								<h2 className="text-lg font-semibold">{beneficio.title}</h2>

								<p>{beneficio.description}</p>
							</div>
						))}

					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeBeneficios;