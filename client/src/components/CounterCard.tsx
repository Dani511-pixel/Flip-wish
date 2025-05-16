import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCollection } from "@shared/schema";
import { formatDeadline, calculateProgress } from "@/lib/utils";
import { useState } from "react";
import ShareModal from "./ShareModal";

interface CounterCardProps {
  collection: MessageCollection & {
    messageCount: number;
  };
}

const CounterCard = ({ collection }: CounterCardProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const progressPercentage = calculateProgress(collection.messageCount, collection.goal);

  return (
    <>
      <Card className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-dark mb-2">{collection.title}</h2>
              <p className="text-gray-500 mb-4">
                Collecting messages until:{" "}
                <span className="font-medium text-primary">
                  {formatDeadline(collection.deadline)}
                </span>
              </p>
              <div className="flex items-center space-x-4">
                <Button onClick={() => setShowShareModal(true)}>Share Link</Button>
                <Button variant="outline" onClick={() => setShowShareModal(true)}>
                  View QR Code
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
              <div className="text-6xl font-bold text-primary">{collection.messageCount}</div>
              <div className="text-gray-500 text-lg">Messages Collected</div>
              {collection.goal && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {progressPercentage}% to your goal of {collection.goal} messages
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        collection={collection}
      />
    </>
  );
};

export default CounterCard;
