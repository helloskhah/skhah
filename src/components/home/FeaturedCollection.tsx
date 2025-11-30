"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "The Royal Ring",
        price: "$1,200",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 2,
        name: "Golden Necklace",
        price: "$2,450",
        image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        name: "Diamond Earrings",
        price: "$3,100",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    },
];

export function FeaturedCollection() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                        Featured Collection
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-secondary">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white uppercase tracking-widest border border-white px-6 py-2">
                                        View Details
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-lg font-serif text-foreground mb-1">{product.name}</h3>
                            <p className="text-primary">{product.price}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
