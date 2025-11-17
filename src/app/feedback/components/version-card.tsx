import { PaperclipIcon } from "lucide-react";
import { Version } from "../messages";

function FileTag ({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 text-slate-700 text-xs px-3 py-1">
      <PaperclipIcon className="h-4 w-4" />
      <span className="truncate max-w-[200px]">{name}</span>
    </div>
  );
}

export default function VersionCard ({ version }: { version: Version }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="flex items-center gap-3">
          <FileTag name={version.fileName} />
          <div className="text-xs text-slate-500">Version {version.number}</div>
        </div>
        <div className="text-xs text-slate-500 text-right">
          <div>{version.date}</div>
          <div className={`${version.statusColor} font-medium`}>{version.status}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 pb-4 pt-2 space-y-4">
        {version.messages.map((msg, idx) => {
          const isReviewer = msg.author.type === "reviewer";
          return (
            <div key={idx} className={`flex ${isReviewer ? "items-start gap-3" : "justify-end"}`}>
              {isReviewer && (
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center shrink-0">
                  {msg.author.initials}
                </div>
              )}
              <div
                className={`max-w-[92%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isReviewer ? "bg-slate-200 text-slate-800 rounded-tl-md"
                   : "bg-brand-600 text-white rounded-tr-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[11px] mt-2 ${isReviewer ? "text-slate-500" : "text-white/80"} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer status */}
      {version.footer && (
        <div className="px-4 pb-4">
          <div className="bg-brand-600 text-white text-sm text-center rounded-lg px-3 py-2">
            {version.footer}
          </div>
        </div>
      )}
    </div>
  );
}