import React from 'react';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

const HomeHero = () => {
	return (
		<div className="min-h-[50vh] bg-primary dark:bg-secondary flex">
			<div className="container mx-auto px-4">
				<div className="flex flex-col min-h-[50vh] py-10">
					<div>
						<h1 className="text-lg font-semibold text-secondary dark:text-primary">DR. CLICK.</h1>
					</div>

					<div className="text-secondary dark:text-primary flex-1 items-baseline flex flex-col justify-center gap-10 lg:max-w-1/2">
						<p className="text-4xl"><b>Dr. Click </b> saúde: a forma mais fácil, acessível e segura de cuidar da sua saúde</p>

						<div>
							<Link href="/usuario/agendamentos" className="no-underline">
								<Button className="h-[50px] px-5 cursor-pointer" variant={'secondary'}>
									<span className="text-lg font-semibold">
										Agende sua consulta
									</span>
								</Button>
							</Link>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default HomeHero;