import { redirect } from "next/navigation";

export default function PortfolioPage() {
  // Since the main page (/) is the portfolio, we redirect there.
  redirect("/");
}
