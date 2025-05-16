import { useState } from "react";
import { MessageCollection } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCode } from "@/components/ui/qr-code";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MessageCollection;
}

const ShareModal = ({ isOpen, onClose, collection }: ShareModalProps) => {
  const { toast } = useToast();
  const [newDeadline, setNewDeadline] = useState(
    collection.deadline instanceof Date
      ? collection.deadline.toISOString().split("T")[0]
      : new Date(collection.deadline).toISOString().split("T")[0]
  );

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/submit/${collection.slug}`;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share this link with people you want to receive messages from.",
    });
  };

  // Get QR code from the server
  const { data: qrData } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/collections/${collection.slug}/qr`);
      if (!res.ok) throw new Error("Failed to get QR code");
      return res.json();
    },
  });

  const downloadQRCode = () => {
    if (qrData?.qrCode) {
      const link = document.createElement("a");
      link.href = qrData.qrCode;
      link.download = `qrcode-${collection.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const updateDeadline = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/collections/${collection.id}`, {
        deadline: newDeadline,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Deadline updated!",
        description: `Collection deadline updated to ${formatDate(newDeadline)}.`,
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update the deadline.",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Share Your Collection Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="collection-link">Collection Link</Label>
            <div className="flex">
              <Input
                id="collection-link"
                readOnly
                value={shareUrl}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-2"
                onClick={copyLinkToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Share this link with people you want to receive messages from.
            </p>
          </div>

          <div className="space-y-3">
            <Label>QR Code</Label>
            <div className="flex justify-center mb-2">
              <QRCode value={shareUrl} size={200} />
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={downloadQRCode}>
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="deadline">Deadline</Label>
            <div className="flex">
              <Input
                id="deadline"
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="flex-1"
                min={new Date().toISOString().split("T")[0]}
              />
              <Button
                type="button"
                className="ml-2"
                onClick={() => updateDeadline.mutate()}
                disabled={updateDeadline.isPending}
              >
                Update
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Messages will be collected until this date.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
