import time
from typing import List, Tuple, Optional
from openai import OpenAI
from groq import Groq
from langchain.schema import Document
from config import settings
from models import QueryResponse, Source
class LLMService:
    def __init__(self):
        if not settings.is_llm_configured:
            raise ValueError(f"{settings.LLM_PROVIDER} API key not configured")
        if settings.LLM_PROVIDER == "openai":
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = "gpt-3.5-turbo"
            print("✅ OpenAI LLM service initialized")
        elif settings.LLM_PROVIDER == "groq":
            self.client = Groq(api_key=settings.GROQ_API_KEY)
            self.model = "llama-3.1-8b-instant"
            print("✅ Groq LLM service initialized")
        else:
            raise ValueError(f"Unsupported LLM provider: {settings.LLM_PROVIDER}")
    def generate_answer(
        self, 
        question: str, 
        context_docs: List[Tuple[Document, float]], 
        mode: str = "human",
        language: str = "en",
        short_answer: bool = False
    ) -> QueryResponse:
        """Generate answer using RAG pipeline"""
        start_time = time.time()
        try:
            if not context_docs:
                return QueryResponse(
                    answer="I couldn't find relevant information in the uploaded documents to answer your question.",
                    context="",
                    sources=[],
                    language=language,
                    processing_time_ms=int((time.time() - start_time) * 1000),
                    confidence_score=0.0
                )
            context_text = "\n\n".join([doc.page_content for doc, score in context_docs])
            sources = [
                Source(
                    document=doc.metadata.get("source", "Unknown"),
                    chunk=doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                    relevance_score=round(score, 3)
                )
                for doc, score in context_docs
            ]
            confidence_score = self._calculate_confidence(context_docs)
            system_prompt = self._get_system_prompt(mode, language, short_answer)
            user_prompt = f"""Context from uploaded documents:
{context_text}
Question: {question}
Please provide a comprehensive answer based on the context above."""
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=1000 if short_answer else 2000
            )
            answer = response.choices[0].message.content.strip()
            if language != "en":
                answer = self._translate_text(answer, language)
            processing_time = int((time.time() - start_time) * 1000)
            return QueryResponse(
                answer=answer,
                context=context_text[:500] + "..." if len(context_text) > 500 else context_text,
                sources=sources,
                language=language,
                processing_time_ms=processing_time,
                confidence_score=confidence_score
            )
        except Exception as e:
            print(f"❌ Error generating answer: {e}")
            processing_time = int((time.time() - start_time) * 1000)
            return QueryResponse(
                answer=f"I encountered an error while processing your question: {str(e)}",
                context="",
                sources=[],
                language=language,
                processing_time_ms=processing_time,
                confidence_score=0.0
            )
    def generate_summary(self, documents: List[Document]) -> str:
        """Generate summary of uploaded documents"""
        try:
            combined_text = "\n".join([
                doc.page_content[:300] for doc in documents[:3]
            ])
            if len(combined_text) < 50:
                return "Document processed successfully"
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that creates concise summaries of documents."
                    },
                    {
                        "role": "user",
                        "content": f"Please provide a brief summary (2-3 sentences) of this document:\n\n{combined_text}"
                    }
                ],
                temperature=0.3,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Error generating summary: {e}")
            return "Document processed and ready for questions"
    def generate_followup_questions(self, question: str, answer: str, max_questions: int = 4) -> List[str]:
        """Generate follow-up questions based on the original question and answer"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert at generating relevant follow-up questions. 
                        Based on the user's original question and the AI's answer, suggest related questions 
                        that would naturally follow in a conversation.
                        Focus on:
                        - Deeper details about the same topic
                        - Related aspects not covered in the answer
                        - Practical applications or next steps
                        - Clarifications or specific examples
                        Return ONLY the questions, one per line, without numbers or bullets.
                        Make questions specific and actionable."""
                    },
                    {
                        "role": "user",
                        "content": f"""Original Question: {question}
AI Answer: {answer[:500]}...
Generate {max_questions} relevant follow-up questions that someone might naturally ask next:"""
                    }
                ],
                temperature=0.4,
                max_tokens=200
            )
            questions_text = response.choices[0].message.content.strip()
            questions = [q.strip() for q in questions_text.split('\n') if q.strip()]
            questions = [q for q in questions if len(q) > 10][:max_questions]
            if len(questions) < 2:
                questions.extend([
                    "Can you provide more details about this?",
                    "Are there any related topics I should know about?",
                    "What are the practical implications of this?"
                ])
            return questions[:max_questions]
        except Exception as e:
            print(f"❌ Error generating follow-up questions: {e}")
            return [
                "Can you explain this in more detail?",
                "What are the key takeaways from this?",
                "Are there any related topics?",
                "What should I know next about this?"
            ]
    def _get_system_prompt(self, mode: str, language: str, short_answer: bool) -> str:
        """Get system prompt based on mode, language and answer length"""
        if mode == "technical":
            base_prompt = """You are a senior technical architect. Provide detailed technical explanations with this EXACT format:
⚙️ **Technical Deep Dive**
**📖 From the Document:**
[Quote the exact relevant information from the provided context]
**📄 Source Reference:**
• **Document**: [Document name from metadata]
• **Page/Section**: [Page number or section if available from metadata]
**🏗️ Technical Architecture:**
• **Core Components**: [List main technical components and systems]
• **Implementation Stack**: [Technologies, frameworks, and tools used]
• **Data Flow**: [Step-by-step technical process flow]
**🔧 Deep Technical Analysis:**
• **Algorithms & Methods**: [Specific algorithms, complexity analysis]
• **Performance Metrics**: [Benchmarks, optimization details, scalability]
• **Infrastructure**: [System architecture, deployment patterns, security]
**✅ Implementation Best Practices:**
• [Practice 1 with code examples or technical specifications]
• [Practice 2 with performance considerations]
• [Practice 3 with security and scalability notes]
**🎓 Advanced Learning Resources:**
• **Technical Documentation**: [Suggest official docs, API references]
• **Research Papers**: [Recommend academic papers or whitepapers]
• **Professional Courses**: [Advanced technical courses - Coursera, edX, Udacity]
• **Developer Communities**: [Stack Overflow, GitHub, technical forums]
Guidelines: Use technical terminology, include implementation details, focus on architecture and performance."""
        else:
            base_prompt = """You are a friendly AI assistant. Provide clear, beginner-friendly explanations with this EXACT format:
🤖 **Simple & Clear Answer**
**📖 What the Document Says:**
[Quote or paraphrase the relevant information from the provided context in simple terms]
**📄 Found in:**
• **Document**: [Document name]
• **Page**: [Page number if available, or "Section X" if no page info]
**💡 Easy Explanation:**
Think of it like this: [Use a simple analogy or everyday example that anyone can understand]
**🔍 Key Points to Remember:**
• **What it is**: [Simple definition in everyday language]
• **Why it matters**: [Benefits explained simply]
• **Real-life examples**: [3 examples people encounter daily]
**📚 Want to Learn More? Check These Out:**
• **Beginner-Friendly**: Khan Academy, Coursera basics courses
• **Videos**: YouTube channels like Crash Course, TED-Ed
• **Interactive**: Codecademy, freeCodeCamp (if tech-related)
• **Books**: [Suggest 1-2 beginner-friendly books]
• **Websites**: [Relevant educational websites]
**🚀 Quick Summary:**
[One memorable sentence that captures the essence]
Guidelines: Use simple language, avoid jargon, include relatable examples, make it conversational."""
        if short_answer:
            base_prompt += "\n- Keep your answer concise and to the point (2-3 sentences maximum)"
        else:
            base_prompt += "\n- Provide detailed explanations with examples when helpful"
        if language != "en":
            language_names = {
                "es": "Spanish", "fr": "French", "de": "German", "it": "Italian",
                "pt": "Portuguese", "ru": "Russian", "ja": "Japanese", 
                "ko": "Korean", "zh": "Chinese"
            }
            lang_name = language_names.get(language, language)
            base_prompt += f"\n- Respond in {lang_name}"
        return base_prompt
    def _calculate_confidence(self, context_docs: List[Tuple[Document, float]]) -> float:
        """Calculate confidence score based on retrieval results"""
        if not context_docs:
            return 0.0
        avg_score = sum(score for _, score in context_docs) / len(context_docs)
        result_count_factor = min(len(context_docs) / settings.TOP_K_RESULTS, 1.0)
        confidence = avg_score * result_count_factor
        return round(min(confidence, 1.0), 2)
    def _translate_text(self, text: str, target_language: str) -> str:
        """Translate text to target language using LLM"""
        try:
            language_names = {
                "es": "Spanish", "fr": "French", "de": "German", "it": "Italian",
                "pt": "Portuguese", "ru": "Russian", "ja": "Japanese", 
                "ko": "Korean", "zh": "Chinese"
            }
            lang_name = language_names.get(target_language, target_language)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": f"You are a professional translator. Translate the following text to {lang_name}. Maintain the original meaning and tone."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.1,
                max_tokens=2000
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Translation error: {e}")
            return f"[Translation to {target_language} failed] {text}"
llm_service = LLMService()
