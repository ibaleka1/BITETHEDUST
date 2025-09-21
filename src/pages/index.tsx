import React from "react";
import VERAOrb from "../components/VERAOrb";

export default function Home() {
  return (
    <main style={{minHeight:"100vh",background:"#e0f7fa",padding:0}}>
      <h1 style={{textAlign:"center",marginTop:"40px",color:"#00796b"}}>Welcome to VERA</h1>
      <VERAOrb />
    </main>
  );
}
