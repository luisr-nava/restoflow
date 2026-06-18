import { notFound } from "next/navigation";

import { CustomerQrOrderView } from "@/src/features/customer-qr/components/customer-qr-order-view";
import { getCustomerQrDataAction } from "@/src/features/customer-qr/actions/customer-qr.actions";

type QrTablePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function QrTablePage({ params }: QrTablePageProps) {
  const { token } = await params;

  const data = await getCustomerQrDataAction(token);

  if (!data) {
    notFound();
  }

  return <CustomerQrOrderView data={data} />;
}
