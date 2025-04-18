"use client";

const Header = () => {
  return (
    <header className="bg-gray-900 fixed w-full top-0 left-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Admin</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="text-white hover:text-gray-200">Home</a></li>
              <li><a href="/accounts" className="text-white hover:text-gray-200">Accounts</a></li>
              <li><a href="/services" className="text-white hover:text-gray-200">Auspost</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
