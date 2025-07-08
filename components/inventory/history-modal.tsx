"use client";

import { CheckoutLog } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { statusConfig, formatDateTime } from '@/lib/inventory-utils';
import { Clock, User, MapPin, FileText } from 'lucide-react';

interface HistoryModalProps {
  productName: string;
  history: CheckoutLog[];
  onClose: () => void;
}

export function HistoryModal({ productName, history, onClose }: HistoryModalProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CHECKOUT':
        return '📤';
      case 'RETURN':
        return '📥';
      case 'STATUS_CHANGE':
        return '🔄';
      default:
        return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CHECKOUT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RETURN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'STATUS_CHANGE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[600px]">
      <DialogHeader>
        <DialogTitle>Checkout History</DialogTitle>
        <DialogDescription>
          Complete activity history for "{productName}"
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No history available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Status changes and checkout activities will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((log, index) => {
              const previousStatusInfo = statusConfig[log.previousStatus];
              const newStatusInfo = statusConfig[log.newStatus];
              const actionColor = getActionColor(log.action);

              return (
                <div
                  key={log.id}
                  className="relative border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Badge className={`${actionColor} px-2 py-1 text-xs font-medium`}>
                          {getActionIcon(log.action)} {log.action.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${previousStatusInfo.color}`}>
                            {previousStatusInfo.icon} {log.previousStatus}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${newStatusInfo.color}`}>
                            {newStatusInfo.icon} {log.newStatus}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(log.timestamp)}</span>
                          </div>
                          
                          {log.pickedBy && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{log.pickedBy}</span>
                            </div>
                          )}
                          
                          {log.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{log.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>By: {log.updatedBy}</span>
                          </div>
                        </div>

                        {log.notes && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                            <div className="flex items-start gap-1">
                              <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{log.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < history.length - 1 && (
                    <div className="absolute left-8 top-full w-px h-4 bg-border -mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={onClose}>Close</Button>
      </div>
    </DialogContent>
  );
}