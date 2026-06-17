import QRCode from "qrcode";

export async function createTableQrImage(qrUrl: string) {
  return QRCode.toDataURL(qrUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
  });
}
