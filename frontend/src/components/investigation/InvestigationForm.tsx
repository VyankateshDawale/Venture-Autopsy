"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { investigationApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Loader2 } from "lucide-react";

export function InvestigationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inputType: "startup_idea",
    inputData: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title: formData.title,
        description: formData.description || formData.title,
        input_type: formData.inputType,
        input_data: { content: formData.inputData }
      };
      const res = await investigationApi.create(data as any);
      
      router.push(`/investigation/${res.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create investigation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Investigation Title</label>
          <Input 
            required 
            className="bg-white/[0.04] border-white/[0.08] h-11 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g. Acme Corp Series B Due Diligence" 
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Target Type</label>
          <Select value={formData.inputType} onValueChange={(v: string | null) => setFormData({...formData, inputType: v ?? "startup_idea"})}>
            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] h-11 text-white focus:border-emerald-500/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#111114] border-white/10">
              <SelectItem value="startup_idea">Startup Idea</SelectItem>
              <SelectItem value="pitch_deck">Pitch Deck (PDF Upload)</SelectItem>
              <SelectItem value="github_repo">GitHub Repository</SelectItem>
              <SelectItem value="enterprise_proposal">Enterprise Proposal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Target Data / Content</label>
          <Textarea 
            required 
            className="bg-white/[0.04] border-white/[0.08] h-28 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 resize-none transition-all"
            value={formData.inputData} 
            onChange={e => setFormData({...formData, inputData: e.target.value})}
            placeholder="Paste the pitch, idea description, GitHub URL, or proposal content..."
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Deploying 8 AI Agents...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Launch Investigation
          </span>
        )}
      </Button>
    </form>
  );
}
