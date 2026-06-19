"""Supabase client initialization."""

from supabase import create_client, Client
from app.config import settings

from collections import defaultdict
import uuid

class MockDBResponse:
    def __init__(self, data):
        self.data = data

class MockDBTable:
    def __init__(self, table_name, db):
        self.table_name = table_name
        self.db = db
        self._pending_data = None
        
    def select(self, *args, **kwargs): return self
    def insert(self, data):
        from datetime import datetime, timezone
        now_str = datetime.now(timezone.utc).isoformat()
        if isinstance(data, dict):
            if "id" not in data:
                data["id"] = str(uuid.uuid4())
            if "created_at" not in data:
                data["created_at"] = now_str
            if "updated_at" not in data:
                data["updated_at"] = now_str
            self.db.store[self.table_name].append(data)
            self._pending_data = [data]
        return self
    def update(self, data): return self
    def eq(self, col, val): return self
    def order(self, col, desc=False): return self
    def maybe_single(self): return self
    def range(self, start, end): return self
    
    def execute(self):
        if self._pending_data is not None:
            return MockDBResponse(self._pending_data)
        return MockDBResponse(self.db.store[self.table_name])

class MockDB:
    def __init__(self):
        self.store = defaultdict(list)
    def table(self, name): return MockDBTable(name, self)

if settings.APP_MODE == "mock":
    supabase = MockDB()
else:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def get_supabase():
    """Dependency injection helper for Supabase client."""
    return supabase
