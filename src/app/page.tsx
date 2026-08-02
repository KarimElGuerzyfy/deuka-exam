"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import InputArea from "./components/InputArea";

export type Provider = "osd" | "telc" | "goethe";

export default function Home() {
  const [provider, setProvider] = useState<Provider>("osd");

  return (
    <>
      <Navbar />
      <div data-provider={provider} style={{ background: "var(--surface)", minHeight: "calc(100vh - 54px)" }}>
        <InputArea provider={provider} onProviderChange={setProvider} />
      </div>
    </>
  );
}