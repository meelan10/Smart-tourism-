import { useEffect, useState } from "react";

export default function PageLoader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="page-loader">
      <div style={{fontSize:"3rem",animation:"float 1s ease-in-out infinite"}}>🏔️</div>
      <div className="loader-spinner"></div>
      <div style={{color:"var(--text3)",fontSize:"0.85rem",fontWeight:700,letterSpacing:2}}>NEPAL WANDER</div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}
