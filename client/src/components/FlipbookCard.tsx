import { Link } from "wouter";
import { Flipbook } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface FlipbookCardProps {
  flipbook: Flipbook & {
    messageCount?: number;
  };
}

const FlipbookCard = ({ flipbook }: FlipbookCardProps) => {
  return (
    <Link href={`/flipbook/${flipbook.id}`}>
      <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center">
            <motion.div 
              className="relative w-32 h-40 bg-white shadow-md rounded transform -rotate-6 transition-transform"
              whileHover={{ rotate: -12 }}
            >
              <div className="absolute inset-0 flex justify-center items-center p-2">
                <p className="text-xs text-center text-gray-600">
                  {flipbook.theme === "premium" ? "Premium Design" : "Standard Design"}
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="relative w-32 h-40 bg-white shadow-md rounded transform -rotate-3 transition-transform"
              whileHover={{ rotate: -6 }}
            >
              <div className="absolute inset-0 flex justify-center items-center p-2">
                <p className="text-xs text-center text-gray-600">
                  {flipbook.title}
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="relative w-32 h-40 bg-white shadow-md rounded transform rotate-0 transition-transform"
              whileHover={{ rotate: 3 }}
            >
              <div className="absolute inset-0 flex justify-center items-center p-2">
                <p className="text-xs text-center text-gray-600">
                  "Click to view!"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{flipbook.title}</h3>
          <p className="text-gray-500 text-sm mb-3">
            Created on {formatDate(flipbook.createdAt)}
          </p>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              {flipbook.messageCount || 0} messages
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
              {flipbook.status === "active" ? "Active" : "Complete"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FlipbookCard;
