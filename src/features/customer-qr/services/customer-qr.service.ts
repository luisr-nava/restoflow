import { createClient } from "@/src/lib/supabase/server";

import {
  customerQrRepository,
  type ICustomerQrRepository,
} from "../repositories/customer-qr.repository";

class CustomerQrService {
  constructor(private readonly customerQrRepository: ICustomerQrRepository) {}

  private async getSupabase() {
    return createClient();
  }

  async getCustomerQrData(qrToken: string) {
    const supabase = await this.getSupabase();

    if (!qrToken) {
      return null;
    }

    const { data } = await this.customerQrRepository.getCustomerQrData(
      supabase,
      qrToken,
    );

    return data;
  }
}

export const customerQrService = new CustomerQrService(customerQrRepository);
