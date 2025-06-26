"use client";
import Loader from "@/components/CircleLoader";
import { useEffect, useState } from "react";
import LandingPage from "@/components/LandingPage";
export default function Home() {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoader(!loader), 1002);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="min-h-screen ">
      <main>
        {loader ? (
          <Loader />
        ) : (
          <>
            <LandingPage />
          </>
        )}
      </main>
    </div>
  );
}
