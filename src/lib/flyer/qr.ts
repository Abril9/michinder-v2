import QRCode from "qrcode";

export async function qrDataUrl(value: string) {
  const buffer = await QRCode.toBuffer(value, {
    type: "png",
    width: 440,
    margin: 1,
    errorCorrectionLevel: "Q",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return `data:image/png;base64,${buffer.toString("base64")}`;
}
