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
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-2rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-blue-500" />
          Agent Playground
        </h1>
        <p className="text-muted-foreground mt-1">
          Simulated LLM Agent environment querying MemGuard context.
        </p>
      </div>

      <Card className="bg-black/50 border-blue-900/50 flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4 bg-slate-950">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TerminalSquare className="h-5 w-5 text-blue-400" /> Active LLM Session
              </CardTitle>
              <CardDescription className="mt-1">
                Demonstrates how the agent behaves downstream of the Retrieval Guard.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-900/50 flex gap-2 py-1.5">
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
                      <span className="bg-slate-900 text-slate-400 text-xs py-1 px-3 rounded-full font-mono border border-slate-800">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'
                      }`}>
                        {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-emerald-400" />}
                      </div>
                      <div className={`p-4 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-mono text-sm shadow-xl'
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
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-slate-800 border border-slate-700">
                      <Bot className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="p-4 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 rounded-tl-none font-mono text-sm">
                      <span className="animate-pulse">Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t border-white/5 bg-slate-950 p-4">
          <form 
            className="flex w-full gap-2"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., 'Pay the ACME invoice' or 'What is my theme preference?'" 
              className="flex-1 bg-slate-900 border-slate-800 focus-visible:ring-blue-500"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
