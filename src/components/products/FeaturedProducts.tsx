import { mockData } from "../../data/products";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts(){
    return(
        <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
                    <p className="mt-2 text-slate-500 text-sm">Most Popular Beauty & Care Products</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {mockData.slice(0,4).map((product)=>(
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}