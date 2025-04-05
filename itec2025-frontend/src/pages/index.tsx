
"use client";
import React, { useEffect, useState } from "react";
import IndexSkeleton from "@/pages/home/home-skeleton";
import HomeContent from "@/pages/home/home-content";

export default function IndexPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return loading ? <IndexSkeleton /> : <HomeContent />;
}
