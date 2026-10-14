import type { Metadata } from "next";
import ReviewFormulier from "@/components/ReviewFormulier";

export const metadata: Metadata = {
  title: "Review schrijven – Pleuntje",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewFormulier />;
}
