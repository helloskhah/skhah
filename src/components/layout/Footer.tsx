import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-primary">LUXE</h3>
                        <p className="text-sm text-gray-400">
                            Crafting timeless elegance for the modern soul.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-primary">Best Sellers</Link></li>
                            <li><Link href="#" className="hover:text-primary">Rings</Link></li>
                            <li><Link href="#" className="hover:text-primary">Necklaces</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-4">Newsletter</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-background border border-white/10 px-4 py-2 text-sm w-full focus:outline-none focus:border-primary"
                            />
                            <button className="bg-primary text-primary-foreground px-4 py-2 text-sm uppercase tracking-wider hover:bg-white transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Luxe Jewelry. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
