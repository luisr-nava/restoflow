"use server";

import { customerQrService } from "../services/customer-qr.service";

export async function getCustomerQrDataAction(qrToken: string) {
  return customerQrService.getCustomerQrData(qrToken);
}
