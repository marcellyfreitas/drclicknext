import Image from 'next/image';
import React from 'react';

const HomeSobre = () => {
	return (
		<div className="bg-white flex">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 py-20" >
					<div className="grid gap-5 order-1 lg:order-1">
						<h2 className="text-2xl font-semibold">Sobre a DR.Click</h2>

						<div className="grid gap-3">
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde eius, cumque ullam ad aliquam suscipit illum pariatur recusandae eos soluta autem repellat veritatis, tenetur cum, numquam quos doloremque obcaecati!</p>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde eius, cumque ullam ad aliquam suscipit illum pariatur recusandae eos soluta autem repellat veritatis, tenetur cum, numquam quos doloremque obcaecati!</p>
						</div>
					</div>
					<div className="order-2 lg:order-2">
						<figure className="w-full overflow-hidden rounded-4xl">
							<Image
								className="object-cover w-full"
								width={720}
								height={720}
								alt="Médica segurando as mãos"
								src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							/>
						</figure>
					</div>
					<div className="order-4 lg:order-3">
						<figure className="w-full overflow-hidden rounded-4xl">
							<Image
								className="object-cover w-full"
								width={720}
								height={720}
								alt="Profissional médica ao ar livre"
								src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							/>
						</figure>
					</div>

					<div className="grid gap-5 order-3 lg:order-4">
						<h2 className="text-2xl font-semibold">Médicos responsáveis</h2>

						<div className="grid">
							<div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam impedit ratione quam hic nulla, error eveniet dicta animi deserunt totam harum mollitia ut nam quas debitis eum. Magni, unde molestiae.</div>
							<div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam impedit ratione quam hic nulla, error eveniet dicta animi deserunt totam harum mollitia ut nam quas debitis eum. Magni, unde molestiae.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeSobre;