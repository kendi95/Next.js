import { GetStaticPaths, GetStaticProps } from "next";
import Link from 'next/link';
import { useRouter } from "next/router";
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

import { client } from "@/lib/prismic";

interface CategoryProps {
  products: Document[];
  category: Document;
}

export default function Produts({ category, products }: CategoryProps) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <p>Carregando...</p>
  }
  

	return (
    <div>
      <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`}>
              <a>
                {PrismicDOM.RichText.asText(product.data.title)}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categoriesResponse = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ])

  return {
    paths: categoriesResponse.results.map((category) => {
      return {
        params: { slug: category.uid }
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const {slug} = context.params;

  const categoryResponse = await client().getByUID('category', String(slug), {});
  const productsResponse = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', categoryResponse.id)
  ])


  return {
    props: {
      category: categoryResponse,
      products: productsResponse.results
    },
    revalidate: 60
  }
}