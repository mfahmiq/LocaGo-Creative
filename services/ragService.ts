import { supabase } from '../lib/supabase';

export interface KbBrief {
  id: number;
  category: string;
  topic: string;
  content: string;
  similarity_score: number;
}

/**
 * Retrieve the most relevant knowledge briefs from Supabase using RAG (search_kb_briefs RPC).
 * Saves token usage (>80% token reduction) by injecting only relevant brief chunks.
 */
export async function retrieveRelevantContext(userQuery: string, matchCount: number = 2): Promise<string> {
  if (!userQuery || !userQuery.trim()) {
    return '';
  }

  try {
    const { data, error } = await supabase.rpc('search_kb_briefs', {
      query_text: userQuery.trim(),
      match_count: matchCount,
    });

    if (error) {
      console.warn('Supabase RAG query warning:', error.message);
      return '';
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return '';
    }

    const briefs = data as KbBrief[];
    // Format into compact context for LLM
    const formattedContext = briefs
      .map((b) => `• [${b.topic}]: ${b.content}`)
      .join('\n');

    return formattedContext;
  } catch (err) {
    console.warn('RAG retrieval fallback error:', err);
    return '';
  }
}
