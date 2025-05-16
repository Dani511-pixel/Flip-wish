import { Message } from "@shared/schema";
import { formatTimeAgo } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { MoveUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageCardProps {
  message: Message;
  className?: string;
  isFlipbook?: boolean;
}

const MessageCard = ({ message, className = "", isFlipbook = false }: MessageCardProps) => {
  return (
    <Card className={`overflow-hidden border border-gray-100 hover:shadow-md transition ${className} ${isFlipbook ? 'h-full flex flex-col justify-between' : ''}`}>
      <CardContent className={`p-4 ${isFlipbook ? 'h-full flex flex-col' : ''}`}>
        <div className={`${isFlipbook ? 'flex-grow flex items-center justify-center p-2 sm:p-4' : ''}`}>
          <p className={`${isFlipbook ? 'text-center text-base sm:text-lg md:text-xl leading-relaxed' : ''} text-gray-800 mb-2 sm:mb-4`}>
            "{message.content}"
          </p>
        </div>
        <div className={`flex justify-between items-center ${isFlipbook ? 'border-t border-gray-200 pt-4' : ''}`}>
          {!isFlipbook && (
            <div className="font-medium text-gray-700">
              {message.fromName}
            </div>
          )}
          {isFlipbook && (
            <div className="text-xs text-gray-500">{formatTimeAgo(message.createdAt)}</div>
          )}
          <div className="flex items-center gap-2">
            {message.hasVoice && (
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Play voice message">
                <MoveUp size={16} />
              </Button>
            )}
            {isFlipbook ? (
              <div className="font-bold text-sm text-primary">
                - {message.fromName}
              </div>
            ) : (
              <div className="text-xs text-gray-500">{formatTimeAgo(message.createdAt)}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
