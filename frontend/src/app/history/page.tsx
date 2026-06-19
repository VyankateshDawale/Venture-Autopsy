"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { investigationApi } from "@/lib/api";
import { Header } from "@/components/layout/Header";

export default function HistoryPage() {
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investigationApi.list()
      .then((data) => {
        setInvestigations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch investigations", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto pt-24 pb-10 min-h-[80vh]">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Investigation History</h1>
        
        {loading ? (
          <div className="text-gray-400">Loading history...</div>
        ) : investigations.length === 0 ? (
          <div className="text-gray-400">No investigations found.</div>
        ) : (
          <div className="grid gap-6">
            {investigations.map((inv) => (
              <Card key={inv.id} className="bg-white/5 border-white/10 text-left hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white">
                        <Link href={`/investigation/${inv.id}`} className="hover:text-cyan-400 transition-colors">
                          {inv.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-2">{inv.description}</CardDescription>
                    </div>
                    <div className="text-sm font-medium px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                      {inv.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    Created at: {new Date(inv.created_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
