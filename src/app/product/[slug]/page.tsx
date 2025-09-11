import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import ProductDetailsWrapper from "./ProductDetailsWrapper";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;

  const productQuery = `
    *[_type == "food" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      price,
      originalPrice,
      image {
        asset {
          _ref
        }
      },
      description,
      longDescription,
      tags,
      images[] {
        asset {
          _ref
        }
      },
      reviews[] {
        user,
        rating,
        comment
      },
      available,
      category
    }`;

  const adjacentQuery = `
    {
      "previous": *[_type == "food" && slug.current < $slug] | order(slug.current desc)[0].slug.current,
      "next": *[_type == "food" && slug.current > $slug] | order(slug.current asc)[0].slug.current
    }`;

  let product, adjacentSlugs;
  
  try {
    product = await client.fetch(productQuery, { slug });
    adjacentSlugs = await client.fetch(adjacentQuery, { slug });
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return mock data for demo
    product = {
      _id: '1',
      name: 'Demo Product',
      slug: { current: slug },
      price: 12.99,
      originalPrice: 15.99,
      description: 'This is a demo product',
      available: true,
      category: 'Demo'
    };
    adjacentSlugs = { previous: null, next: null };
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold text-gray-800">Product Not Found</h1>
        <p className="text-lg text-gray-600 mt-4">
          Sorry, the product you're looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <ProductDetailsWrapper
      product={product}
      previousSlug={adjacentSlugs.previous || null}
      nextSlug={adjacentSlugs.next || null}
    />
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await client.fetch(
      `*[_type == "food" && slug.current == $slug][0]{ name, description }`,
      { slug }
    );
    
    return {
      title: product?.name || "Product Not Found",
      description: product?.description || "This product does not exist.",
    };
  } catch (error) {
    return {
      title: "Product",
      description: "Product page",
    };
  }
}
