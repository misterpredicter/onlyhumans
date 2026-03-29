import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskResultsPage({ params }: Props) {
  await params;
  redirect("/docs");
}
