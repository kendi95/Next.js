import { GetServerSideProps } from "next";
import Link from 'next/link';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';


import SEO from "../components/SEO";
import { Title } from "../styles/pages/Home";
import { client } from "@/lib/prismic";

export interface IProduct {
	id: string;
	title: string;
}

interface HomeProps {
	recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {

	return (
		<div>
			<SEO
				title="DevCommerce, your best e-commerce!"
				shouldExcludeTitleSuffix 
				image="boost.png"
			/>

			<section>
				<Title>Products</Title>

				<ul>
					{recommendedProducts.map((recommended) => (
						<li key={recommended.id}>
							<Link href={`/catalog/products/${recommended.uid}`}>
								<a>
									{PrismicDOM.RichText.asText(recommended.data.title)}
								</a>
							</Link>
						</li>
					))}
				</ul>
			</section>

		</div>
	);
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
	const recommendedProducts = await client().query([
		Prismic.Predicates.at('document.type', 'product')
	])

	return {
		props: {
			recommendedProducts: recommendedProducts.results
		}
	}
}