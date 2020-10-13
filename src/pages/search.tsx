import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useCallback, useState, FormEvent } from "react";
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import {Document} from 'prismic-javascript/types/documents';

import { client } from "@/lib/prismic";
interface SearchProps {
	searchResults: Document[];
}

export default function Search({searchResults}: SearchProps) {
	const router = useRouter();
	const [search, setSearch] = useState('');

	const handleSuarch = useCallback((e: FormEvent) => {
		e.preventDefault();

		router.push(`/search?q=${encodeURIComponent(search)}`)
		setSearch('')
	}, [search]);

	return (
		<div>
			<form onSubmit={handleSuarch}>
				<input type="text" onChange={e => setSearch(e.target.value)} value={search} />
				<button type="submit">Search</button>
			</form>

			{searchResults.map((product) => (
						<li key={product.id}>
							<Link href={`/catalog/products/${product.uid}`}>
								<a>
									{PrismicDOM.RichText.asText(product.data.title)}
								</a>
							</Link>
						</li>
					))}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
	const {q} = context.query;

	if (!q) {
		return { props: { searchResults: [] } };
	}

	const searchResults = await client().query([
		Prismic.Predicates.at('document.type', 'product'),
		Prismic.Predicates.fulltext('my.product.title', String(q)),
	])

	return {
		props: {
			searchResults: searchResults.results
		}
	}
}
