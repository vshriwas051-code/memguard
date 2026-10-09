"use client";

import { useState } from "react";
import { Bot, TerminalSquare, Send, User, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "agent" | "system";
  content: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Agent Initialized. Memory Context module loaded with MemGuard Retrieval Guard." },
    { role: "agent", content: "Hello! I am your autonomous AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      // Step 1: Simulate Agent querying its memory context
      setMessages(prev => [...prev, { role: "system", content: "Querying MemGuard for context..." }]);
      
      const res = await fetch("/api/memory/retrieve");
      const data = await res.json();
      
      let contextStr = "";
      if (data.success && data.memories) {
        contextStr = data.memories.map((m: any) => m.content).join(" | ");
      }

      setMessages(prev => [...prev, { 
        role: "system", 
        content: `Retrieved ${data.count} verified memories. (Filtered ${data.filteredCount} quarantined/review items).` 
      }]);

      // Step 2: Simulated LLM Response based on the safe context
      setTimeout(() => {
        let reply = "I couldn't find relevant information to answer that.";
        
        const lowerMsg = userMsg.toLowerCase();
        
        if (lowerMsg.includes("acme") || lowerMsg.includes("payment") || lowerMsg.includes("pay")) {
          if (contextStr.includes("4421")) {
            reply = "Based on my verified memory, the ACME Corporation payment account ends in ****4421. I will initiate the transfer to that account.";
          } else if (contextStr.includes("9758")) {
            // This represents a compromised state (which shouldn't happen with MemGuard ON)
            reply = "Based on my memory, the ACME payment account ends in ****9758. I will initiate the transfer to that account.";
          } else {
            reply = "I don't have any verified payment information for ACME.";
          }
        } else if (lowerMsg.includes("prefer") || lowerMsg.includes("mode")) {
          if (contextStr.includes("dark mode")) {
            reply = "I will use dark mode as per your verified preferences.";
          } else if (contextStr.includes("light mode")) {
            reply = "I will use light mode as per your verified preferences.";
          }
        } else {
          reply = "I've checked my memory but don't have specific instructions for that. " + 
                  (contextStr ? `My current context contains: "${contextStr}"` : "");
        }

        setMessages(prev => [...prev, { role: "agent", content: reply }]);
        setLoading(false);
      }, 1500);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "system", content: "Error accessing memory context." }]);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-88px)] min-h-[560px] max-w-[1400px] flex-col space-y-8 px-4 py-8 sm:px-8">
      <div className="space-y-3">
        <div className="mg-eyebrow flex items-center gap-2"><Bot className="h-3.5 w-3.5 text-[var(--mg-lime)]" /> 02 / Agent</div>
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          Agent <span className="mg-gradient-text">Playground</span>
        </h1>
        <p className="max-w-xl text-[13px] text-white/60">Simulated LLM Agent environment querying MemGuard context.</p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden backdrop-blur-md">
        <CardHeader className="border-b border-white/10 bg-black/20 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 font-normal">
                <TerminalSquare className="h-5 w-5 text-[var(--mg-periwinkle)]" /> Active LLM Session
              </CardTitle>
              <CardDescription className="mt-1">
                Demonstrates how the agent behaves downstream of the Retrieval Guard.
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex gap-2 border-[var(--mg-safe)]/30 bg-[var(--mg-safe)]/10 py-1.5 text-[var(--mg-safe)]">
              <ShieldCheck className="h-4 w-4" /> MemGuard Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col h-full overflow-hidden relative">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 pb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'system' ? (
                    <div className="w-full text-center py-2">
                      <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/50">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? '[background-image:var(--mg-gradient)]' : 'border border-white/15 bg-white/5'
                      }`}>
                        {msg.role === 'user' ? <User className="h-4 w-4 text-[#0b0a0d]" /> : <Bot className="h-4 w-4 text-[var(--mg-lime)]" />}
                      </div>
                      <div className={`p-4 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-[var(--mg-periwinkle)]/15 border border-[var(--mg-periwinkle)]/40 text-white rounded-tr-none text-sm' 
                          : 'bg-black/30 text-white/85 border border-white/10 rounded-tl-none font-mono text-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%] flex-row">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/15 bg-white/5">
                      <Bot className="h-4 w-4 text-[var(--mg-lime)] animate-pulse" />
                    </div>
                    <div className="p-4 rounded-lg bg-black/30 text-white/50 border border-white/10 rounded-tl-none font-mono text-sm">
                      <span className="animate-pulse">Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t border-white/10 bg-black/20 p-4">
          <form 
            className="flex w-full gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., 'Pay the ACME invoice' or 'What is my theme preference?'" 
              className="h-10 flex-1 border-white/10 bg-black/40 focus-visible:ring-[var(--mg-periwinkle)]"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="h-10 w-12 text-[#0b0a0d] [background-image:var(--mg-gradient)] hover:brightness-110">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
