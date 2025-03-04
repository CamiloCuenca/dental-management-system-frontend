export default function Header() {
    return (
        <header className="bg-secondary">
            <nav className=" text-white py-5">
                <ul className="flex justify-center text-2xl space-x-8">
                    <li><a href="#" className="hover:text-accent">Home</a></li>
                    <li><a href="/citas" className="hover:text-accent">Citas</a></li>
                </ul>
            </nav>
        </header>
    );
}
