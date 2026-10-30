import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ProjectChatMessage } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Sparkles,
  Link2,
  AlertCircle,
  Bug,
  Palette,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectTeamChatProps {
  projectId: string;
  projectName: string;
}

export const ProjectTeamChat: React.FC<ProjectTeamChatProps> = ({ projectId, projectName }) => {
  const { projectMessages, sendProjectMessage, activePersona, currentUser, users } = usePortal();
  const user = currentUser || activePersona;

  const [newMessage, setNewMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState<'general' | 'design' | 'bug' | 'blocker' | 'update'>('general');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const messages = projectMessages.filter((m) => m.projectId === projectId);
  const filteredMessages =
    activeFilter === 'all' ? messages : messages.filter((m) => m.tag === activeFilter);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await sendProjectMessage(
      projectId,
      newMessage.trim(),
      selectedTag,
      attachmentUrl.trim() || undefined
    );

    if (res.success) {
      setNewMessage('');
      setAttachmentUrl('');
      setShowAttachmentInput(false);
      setSelectedTag('general');
    } else {
      toast.error(res.error || 'Failed to send message');
    }
  };

  const getTagBadge = (tag?: string) => {
    switch (tag) {
      case 'design':
        return (
          <Badge variant="outline" className="text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1">
            <Palette className="w-2.5 h-2.5" /> Design Review
          </Badge>
        );
      case 'bug':
        return (
          <Badge variant="outline" className="text-[9px] bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1">
            <Bug className="w-2.5 h-2.5" /> Bug / Defect
          </Badge>
        );
      case 'blocker':
        return (
          <Badge variant="outline" className="text-[9px] bg-red-500/20 text-red-400 border-red-500/40 gap-1 font-bold animate-pulse">
            <AlertCircle className="w-2.5 h-2.5" /> Critical Blocker
          </Badge>
        );
      case 'update':
        return (
          <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Progress Update
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="p-3.5 border-b border-border/40 bg-muted/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground flex items-center gap-2">
              <span>{projectName} Team Communication Room</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-[10px] text-muted-foreground">
              Real-time collaboration across assigned Tech Leads, Developers, and QA engineers
            </div>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1">
          {['all', 'design', 'bug', 'blocker', 'update'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`text-[10px] px-2 py-0.5 rounded-full capitalize transition-colors ${
                activeFilter === tag
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag === 'all' ? 'All Messages' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
            <MessageSquare className="w-8 h-8 text-primary/40" />
            <div className="text-xs font-semibold text-foreground">No messages in #{activeFilter} yet</div>
            <p className="text-[11px] max-w-sm">
              Use this channel to discuss architecture, review Figma mockups, flag blockers, and ensure zero design defects.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.authorId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                  {msg.authorName.charAt(0).toUpperCase()}
                </div>

                <div
                  className={`max-w-[80%] rounded-xl p-3 space-y-1.5 ${
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted/50 border border-border/40 text-foreground rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                    <span className="font-semibold">{isMe ? 'You' : msg.authorName}</span>
                    <span className="font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {msg.tag && msg.tag !== 'general' && (
                    <div className="pt-0.5">{getTagBadge(msg.tag)}</div>
                  )}

                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                  {msg.attachmentUrl && (
                    <a
                      href={msg.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 text-[10px] underline hover:opacity-80 pt-1 ${
                        isMe ? 'text-primary-foreground' : 'text-primary'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{msg.attachmentUrl}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Composer */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-border/40 bg-muted/20 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Quick Tag Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground font-medium">Tag:</span>
            {(['general', 'design', 'bug', 'blocker', 'update'] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  selectedTag === t
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border/40 text-muted-foreground hover:bg-muted/40'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Attachment Toggle */}
          <button
            type="button"
            onClick={() => setShowAttachmentInput((v) => !v)}
            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Link2 className="w-3 h-3" />
            <span>{showAttachmentInput ? 'Remove Link' : 'Add Link / Figma URL'}</span>
          </button>
        </div>

        {showAttachmentInput && (
          <Input
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Paste Figma prototype, GitHub PR, or error log link..."
            className="text-xs h-7"
          />
        )}

        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${projectName} team... (Press Enter to send)`}
            className="text-xs flex-1"
          />
          <Button type="submit" size="sm" className="h-8 gap-1">
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

