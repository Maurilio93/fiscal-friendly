import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType(); // POP = back/forward

  useEffect(() => {
    // Se c'è un hash, prova a scrollare a quell'elemento
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    // Per back/forward lascia che il browser ripristini la posizione
    if (navType === "POP") return;

    // Altrimenti vai in cima
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.search, location.hash, navType]);

  return null;
}
