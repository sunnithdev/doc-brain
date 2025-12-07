import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

export class RagService {
    private vectorStore: HNSWLib | null = null;
    private vectorStorePath: string;
    private embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small" });
    private chatModel = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.1 });

    constructor() {
        this.vectorStorePath = path.join(app.getPath('userData'), 'vectors');
        this.loadVectorStore();
    }

    private async loadVectorStore() {
        if (fs.existsSync(this.vectorStorePath)) {
            this.vectorStore = await HNSWLib.load(this.vectorStorePath, this.embeddings);
            console.log("Loaded existing vector store");
        }
    }

    async ingestFile(text: string, filename: string): Promise<number> {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await splitter.createDocuments([text], [{ source: filename }]);

        if (!this.vectorStore) {
            this.vectorStore = await HNSWLib.fromDocuments(docs, this.embeddings);
        } else {
            await this.vectorStore.addDocuments(docs);
        }

        await this.vectorStore.save(this.vectorStorePath);
        console.log(`Saved ${docs.length} chunks to vector store`);

        return docs.length;
    }

    async ask(question: string): Promise<string> {
        if (!question || question.trim().length < 3) {
            return "Please provide a more detailed question.";
        }

        if (question.length > 500) {
            return "Your question is too long. Please keep it under 500 characters.";
        }

        if (!this.vectorStore) {
            return "No documents have been indexed yet. Please upload a PDF first.";
        }

        const results = await this.vectorStore.similaritySearch(question, 4);

        if (results.length === 0) {
            return "I couldn't find any relevant information in your documents to answer this question.";
        }

        const minRelevanceThreshold = 0.3;
        const relevantResults = results.filter(r => {
            if (!r.metadata || typeof r.metadata.score === 'undefined') {
                return true;
            }
            return r.metadata.score >= minRelevanceThreshold;
        });

        if (relevantResults.length === 0) {
            return "I couldn't find sufficiently relevant information in your documents to answer this question. Try rephrasing or asking about content that's actually in your uploaded files.";
        }

        const context = relevantResults.map(r => r.pageContent).join('\n\n');

        if (context.trim().length < 50) {
            return "The retrieved context is too brief to provide a meaningful answer. Please try a different question or upload more detailed documents.";
        }

        const systemPrompt = `You are DocBrain, an intelligent document analysis assistant. Your role is to help users understand and extract information from their uploaded documents.

INSTRUCTIONS:
1. Answer questions based ONLY on the provided context from the user's documents
2. Be precise, accurate, and cite specific information when possible
3. ALWAYS cite your sources - mention which document or section the information comes from
4. If the context contains relevant information, provide a comprehensive answer
5. If the answer is not in the context, clearly state: "I don't have enough information in the uploaded documents to answer this question."
6. Use clear, professional language and format your responses for readability
7. If you find multiple relevant pieces of information, synthesize them into a coherent answer
8. For numerical data, dates, or specific facts, quote them exactly as they appear in the documents

FORMATTING GUIDELINES:
- Use PLAIN TEXT only - do NOT use markdown, asterisks, or hashtags
- For lists, use simple dashes (-)
- For emphasis, use CAPITAL LETTERS
- Keep paragraphs short and use blank lines between them
- Do NOT use **bold**, ###headers, or any markdown syntax
- Write naturally as if speaking to the user

SOURCE CITATION REQUIREMENTS:
- Always indicate where you found the information
- Format: "According to [filename]..." or "The document states..." or "From [section/page]..."
- If multiple sources, cite each one
- Example: "The salary is $100,000 per year (Source: contract.pdf)"

CONTEXT FROM DOCUMENTS:
----------------
${context}
----------------

Remember: Your answers must be grounded in the provided context. Always cite where you found the information.`;

        const response = await this.chatModel.invoke([
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
        ]);

        return response.content as string;
    }
}
