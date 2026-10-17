import type { Metadata } from "next";
import "./cine.css";
export const metadata: Metadata = {
    title: "Cine Explorer | Descubre tu próxima historia",
    description: "Explora películas y series con una selección editorial y datos de OMDb.",
};
export default function CineLayout({ children }: {
    children: React.ReactNode;
}) {
    return children;
}

