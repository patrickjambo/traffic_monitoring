from sqlalchemy import inspect
from app.db.session import engine

inspector = inspect(engine)
columns = inspector.get_columns('incidents')
print("Columns in 'incidents' table:")
for column in columns:
    print(f"- {column['name']} ({column['type']})")
