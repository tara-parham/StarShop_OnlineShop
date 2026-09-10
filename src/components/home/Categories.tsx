import type { Category } from "../../types/product";

const categories :{title:Category, desc:string, icon:string}[] = [
    {title:"Cosmetics", desc:"Signature Beauty & Makeup", icon:"💄"},
    {title: "Skin Care", desc:"Glow Naturally", icon:"✨"},
    {title:"Hair Care", desc:"Strong & Radiant Hair", icon:"🌿"},
    {title:"Self Care", desc:"Wellness & Self-Care", icon:"🌸"},
]

export function Categories(){
    return(
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Featured Categories</h2>
            <div className="grid grid-col-2 md:grid-cols-4 gap-4">
                {categories.map((cat)=>(
                    <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center group cursor-pointer" key={cat.title}>
                    <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <h3 className="font-semibold text-gray-800">{cat.title}</h3>
                    <p className="text-sm mt-1 text-gray-500">{cat.desc}</p>
                </div>
                ))}
            </div>
        </section>
    )
}