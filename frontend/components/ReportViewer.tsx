"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ReportViewer({ report }: { report: string[] }) {
  const [copied, setCopied] = useState(false);
  const content = report.join("\n\n");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-card-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-muted/50 border-b border-card-border px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold text-foreground/90 uppercase text-xs tracking-widest">
          <BookOpen size={18} className="text-accent" />
          Intelligence Synthesis
        </div>
        <button onClick={copyToClipboard} className="text-muted-foreground hover:text-accent transition-colors">
          {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="p-8 md:p-12">
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}