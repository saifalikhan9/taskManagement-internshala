"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser, 
} from "@clerk/nextjs";

export function Navbar() {
  const { isLoaded } = useUser(); 

  return (
    <nav className="bg-white/20 backdrop-blur-md  sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16 space-x-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold tracking-widest bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              EIDO
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href={"/dashboard"}>
              <Button variant={"link"} className="flex items-center space-x-2">
                <span>Dashboard</span>
              </Button>
            </Link>
          </div>

          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <>
              <SignedOut>
                <SignInButton>
                  <Button>Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
