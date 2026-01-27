import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from collections import Counter
from models import AnalyticsEntry, AnalyticsResponse
from config import settings
class AnalyticsService:
    def __init__(self):
        self.analytics_file = settings.ANALYTICS_FILE
        self._ensure_analytics_file()
    def _ensure_analytics_file(self):
        """Ensure analytics file exists"""
        if not os.path.exists(self.analytics_file):
            self._save_analytics([])
    def log_interaction(self, interaction_type: str, data: Dict[str, Any], session_id: Optional[str] = None):
        """Log user interaction"""
        try:
            entry = AnalyticsEntry(
                timestamp=datetime.now(),
                type=interaction_type,
                data=data,
                session_id=session_id
            )
            analytics = self._load_analytics()
            analytics.append(entry.dict())
            if len(analytics) > 1000:
                analytics = analytics[-1000:]
            self._save_analytics(analytics)
            print(f"📊 Logged {interaction_type} interaction")
        except Exception as e:
            print(f"❌ Error logging interaction: {e}")
    def get_analytics(self) -> AnalyticsResponse:
        """Get analytics summary"""
        try:
            analytics = self._load_analytics()
            queries = [entry for entry in analytics if entry.get('type') == 'query']
            uploads = [entry for entry in analytics if entry.get('type') == 'upload']
            topics = []
            for query in queries:
                question = query.get('data', {}).get('question', '')
                if question:
                    words = [word.lower() for word in question.split() 
                            if len(word) > 3 and word.lower() not in ['what', 'how', 'why', 'when', 'where', 'which', 'this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'their']]
                    topics.extend(words)
            topic_counter = Counter(topics)
            most_asked_topics = [topic for topic, count in topic_counter.most_common(10)]
            recent_entries = []
            for entry_dict in analytics[-20:]:
                try:
                    entry = AnalyticsEntry(**entry_dict)
                    recent_entries.append(entry)
                except Exception as e:
                    print(f"⚠️ Error parsing analytics entry: {e}")
                    continue
            return AnalyticsResponse(
                total_queries=len(queries),
                total_uploads=len(uploads),
                most_asked_topics=most_asked_topics,
                recent_activity=recent_entries
            )
        except Exception as e:
            print(f"❌ Error getting analytics: {e}")
            return AnalyticsResponse(
                total_queries=0,
                total_uploads=0,
                most_asked_topics=[],
                recent_activity=[]
            )
    def log_upload(self, filename: str, file_size: int, chunks_created: int, session_id: Optional[str] = None):
        """Log document upload"""
        self.log_interaction(
            "upload",
            {
                "filename": filename,
                "file_size": file_size,
                "chunks_created": chunks_created,
                "success": True
            },
            session_id
        )
    def log_query(self, question: str, answer_length: int, confidence_score: float, 
                  processing_time_ms: int, language: str = "en", session_id: Optional[str] = None):
        """Log user query"""
        self.log_interaction(
            "query",
            {
                "question": question,
                "answer_length": answer_length,
                "confidence_score": confidence_score,
                "processing_time_ms": processing_time_ms,
                "language": language,
                "success": True
            },
            session_id
        )
    def log_error(self, error_type: str, error_message: str, context: Dict[str, Any] = None, 
                  session_id: Optional[str] = None):
        """Log error occurrence"""
        self.log_interaction(
            "error",
            {
                "error_type": error_type,
                "error_message": error_message,
                "context": context or {},
                "success": False
            },
            session_id
        )
    def _load_analytics(self) -> List[Dict[str, Any]]:
        """Load analytics from file"""
        try:
            with open(self.analytics_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    def _save_analytics(self, analytics: List[Dict[str, Any]]):
        """Save analytics to file"""
        try:
            os.makedirs(os.path.dirname(self.analytics_file), exist_ok=True)
            with open(self.analytics_file, 'w') as f:
                json.dump(analytics, f, indent=2, default=str)
        except Exception as e:
            print(f"❌ Error saving analytics: {e}")
    def clear_analytics(self):
        """Clear all analytics data"""
        try:
            self._save_analytics([])
            print("🗑️ Analytics data cleared")
        except Exception as e:
            print(f"❌ Error clearing analytics: {e}")
    def export_analytics(self) -> Dict[str, Any]:
        """Export all analytics data"""
        try:
            analytics = self._load_analytics()
            summary = self.get_analytics()
            return {
                "export_timestamp": datetime.now().isoformat(),
                "summary": summary.dict(),
                "raw_data": analytics
            }
        except Exception as e:
            print(f"❌ Error exporting analytics: {e}")
            return {}
analytics_service = AnalyticsService()
