"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import heroImage from "../public/reading-side.svg";
import { useUser } from "@clerk/nextjs";

function LandingPage() {
  const { isSignedIn } = useUser();
  return (
    <div className="w-full min-h-screen">
      <div className="flex overflow-hidden h-160 p-10">
      
        <div className="w-1/2 flex flex-col items-center justify-center bg-[#1a1a1a] rounded-l-[8rem] text-white text-center px-6 ">
          <p className="text-3xl mb-1">Unlock Your Potential with</p>
          <span className="text-white text-2xl font-bold mb-2">
            AI-Powered Tasks
          </span>
          <p className="text-3xl mb-1">
            Transform any idea into actionable steps.
          </p>
          <p className="text-3xl mb-1">
            Get personalized tasks generated by AI,
          </p>
          <p className="text-3xl mb-4">
            then effortlessly manage your progress.
          </p>
          {isSignedIn === true ? (
            <Link href="/dashboard">
              <Button variant={"ghost"} className="">
                Get Started
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button variant={"ghost"} className="">
                Get Started
              </Button>
            </Link>
          )}
        </div>


        <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-[#fe7de9] to-[#edfe4d] rounded-r-[8rem]">
          <Image
            width={500}
            src={heroImage}
            alt="hero"
            className="scale-x-[-1]" 
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
