import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: string;
  className?: string;
}

export function QRCode({
  value,
  size = 200,
  level = 'M',
  className,
}: QRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setError("QR Code value is required");
      return;
    }

    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCodeLib.toDataURL(value, {
          width: size,
          margin: 1,
          errorCorrectionLevel: level as any,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeUrl(dataUrl);
        setError(null);
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code");
      }
    };

    generateQRCode();
  }, [value, size, level]);

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 rounded-md", className)} style={{ width: size, height: size }}>
        <span className="text-sm text-gray-500">{error}</span>
      </div>
    );
  }

  if (!qrCodeUrl) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 rounded-md animate-pulse", className)} style={{ width: size, height: size }}>
        <span className="sr-only">Loading QR Code...</span>
      </div>
    );
  }

  return (
    <img 
      src={qrCodeUrl} 
      alt="QR Code" 
      className={cn("rounded-md", className)}
      style={{ width: size, height: size }}
    />
  );
}
