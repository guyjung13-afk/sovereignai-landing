import { useEffect } from "react";

const useReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal, .interlock, .noise-resolve").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

export default useReveal;
