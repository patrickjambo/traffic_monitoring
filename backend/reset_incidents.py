from app.db.session import engine
from sqlalchemy import text

# Drop the incidents table
with engine.connect() as connection:
    connection.execute(text("DROP TABLE IF EXISTS incidents CASCADE"))
    connection.commit()
    print("Successfully dropped incidents table")
