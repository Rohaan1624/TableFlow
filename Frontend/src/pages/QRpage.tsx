import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "#components/ui/button";
import { Badge } from "#components/ui/badge";
import { Separator } from "#components/ui/separator";
import { Download, Printer, Copy, Check, ExternalLink, Lightbulb } from "lucide-react";
import { supabase } from "#lib/supabase";
import { AppHeader } from "#components/dashboardHeader";

const MenuQRPage = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("Your Restaurant");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const menuUrl = restaurantId
    ? `${window.location.origin}/public-menu/${restaurantId}`
    : "";

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("restaurants")
          .select("id, name")
          .eq("user_id", user.id)
          .maybeSingle();

        setRestaurantId(data?.id ?? null);
        setRestaurantName(data?.name ?? "Your Restaurant");
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, []);

  const handleDownloadPNG = () => {
    const svgEl = document.getElementById("menu-qr") as SVGSVGElement | null;
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `menu-qr-${restaurantId}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  };

  const handlePrint = () => {
    const svgEl = document.getElementById("menu-qr") as SVGSVGElement | null;
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Menu QR Code — ${restaurantName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: Georgia, serif;
              background: #fff;
              padding: 2rem;
            }
            .name { font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; }
            svg { width: 280px; height: 280px; }
            .url { margin-top: 1.25rem; font-size: 0.75rem; color: #555; font-family: monospace; word-break: break-all; text-align: center; max-width: 300px; }
            .hint { margin-top: 0.5rem; font-size: 0.7rem; color: #999; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <p class="name">${restaurantName}</p>
          ${svgData}
          <p class="url">${menuUrl}</p>
          <p class="hint">Scan to view our menu</p>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-center px-4">
        <p className="text-lg font-medium">No restaurant found</p>
        <p className="text-sm text-muted-foreground">
          Make sure your account is linked to a restaurant.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Page header */}
      <AppHeader
      />

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">

          {/* QR card */}
          <div className="bg-background rounded-2xl border shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row">

              {/* QR code side */}
              <div className="flex items-center justify-center bg-muted/20 p-10 sm:w-64 shrink-0">
                <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-border">
                  <QRCodeSVG
                    id="menu-qr"
                    value={menuUrl}
                    size={180}
                    level="H"
                    marginSize={2}
                  />
                </div>
              </div>

              {/* Info side */}
              <div className="flex flex-col justify-between p-6 flex-1 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Restaurant</p>
                  <p className="text-xl font-semibold">{restaurantName}</p>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Menu URL</p>
                  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <span className="text-xs font-mono text-muted-foreground flex-1">{menuUrl}</span>
                    <a
                      href={menuUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  This QR code is permanent and tied to your restaurant ID. Safe to print on menus, flyers, and table stands.
                </p>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-background rounded-2xl border shadow-sm p-6 space-y-4">
            <div>
              <p className="font-medium text-sm">Actions</p>
              <p className="text-xs text-muted-foreground mt-0.5">Download, print, or share your QR code</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 h-11"
                onClick={handleCopy}
              >
                {copied
                  ? <Check className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4" />
                }
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 h-11"
                onClick={handleDownloadPNG}
              >
                <Download className="w-4 h-4" />
                Save as Image
              </Button>

              <Button
                className="flex items-center gap-2 h-11"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>

          {/* Tip card */}
          <div className="rounded-xl border border-dashed px-5 py-4 text-sm text-muted-foreground flex gap-3 items-start">
            <span className="text-base"><Lightbulb /></span>
            <p>
              For best print quality, use <strong className="text-foreground font-medium">Save as Image</strong> and print at a high DPI, or use <strong className="text-foreground font-medium">Print</strong> for a ready-to-print layout with your restaurant name.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MenuQRPage;