'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeSwitcher from './ThemeSwitcher';
import ApiStatus from './ApiStatus';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link href="/" className="flex items-center">
          <Image src="/geo-logo.svg" alt="Geo-Processor Logo" width={40} height={40} />
          <span className="ml-2 text-lg font-semibold">Geo-Processor</span>
        </Link>
      </div>
      
      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Home</Link></li>
          <li>
            <details>
              <summary>Info</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><Link href="https://github.com/yourusername/geo-processor-frontend" target="_blank">GitHub</Link></li>
                <li><Link href="https://github.com/yourusername/geo-processor-api" target="_blank">API Docs</Link></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end flex items-center gap-4">
        <ApiStatus />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
