import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NotFound() {
  const h = await headers();
  const accept = h.get("accept") ?? "";

  // Only redirect browser page navigations — asset requests (CSS, JS, images)
  // don't include text/html and must not be redirected or they return HTML as CSS.
  if (accept.includes("text/html")) {
    redirect("/");
  }

  return null;
}
