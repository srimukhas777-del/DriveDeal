import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About CarMarket</h3>
            <p className="text-gray-400">
              Your trusted marketplace for buying and selling cars online.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/search" className="hover:text-white">Search Cars</a></li>
              <li><a href="/" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400">Email: info@carmarket.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CarMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
