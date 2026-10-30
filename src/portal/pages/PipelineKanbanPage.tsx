import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { TelecallerLead } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PhoneCall,
  Lock,
  Unlock,
  Building,
  User,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  FolderPlus,
  Flame,
} from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  { key: 'New', label: 'New Inbound / Pool', color: 'border-t-zinc-500' },
  { key: 'Contacted', label: 'Contacted / Pitch Given', color: 'border-t-amber-500' },
  { key: 'Qualified', label: 'Interested / Pain Identified', color: 'border-t-emerald-500' },
  { key: 'Demo Scheduled', label: 'Demo Requested', color: 'border-t-blue-500' },
  { key: 'Converted', label: 'Won / Converted to ERP', color: 'border-t-purple-500' },
];

export const PipelineKanbanPage: React.FC = () => {
  const { leads, activePersona, lockContact } = usePortal();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
              CRM Pipeline View
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {leads.length} Total Prospects Tracked
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            Outreach Pipeline Kanban
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stage-wise conversion board tracking merchant prospect progression from raw phone intake to signed contract.
          </p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.key);

          return (
            <div key={col.key} className="space-y-2.5">
              {/* Column Header */}
              <div className={`p-3 rounded-xl border bg-card/70 border-t-4 ${col.color} flex items-center justify-between shadow-sm`}>
                <span className="font-bold text-xs text-foreground truncate pr-1">
                  {col.label}
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                  {colLeads.length}
                </Badge>
              </div>

              {/* Column Cards */}
              <div className="space-y-2 min-h-[450px]">
                {colLeads.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-border/40 text-center text-[11px] text-muted-foreground">
                    Empty Stage
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="border-border/60 bg-card/60 backdrop-blur shadow-sm hover:border-primary/40 transition-colors p-3 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-foreground text-xs leading-tight">
                          {lead.businessName}
                        </span>
                        {lead.score ? (
                          <Badge variant="outline" className="text-[9px] font-mono text-primary bg-primary/10">
                            {lead.score}pts
                          </Badge>
                        ) : null}
                      </div>

                      <div className="text-[11px] text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span>{lead.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span>{lead.city} • {lead.category}</span>
                        </div>
                      </div>

                      {lead.painPoints && lead.painPoints.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {lead.painPoints.slice(0, 2).map((pt, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground truncate max-w-[150px]"
                            >
                              {pt}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                        {lead.isLocked ? (
                          <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Ready
                          </span>
                        )}

                        <span className="text-[10px] text-muted-foreground font-mono">
                          {lead.source}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineKanbanPage;
