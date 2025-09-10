import sqlite3, os
db = r"D:\dev\ove-b2b-strapi\.tmp\data.db"
print("DB exists:", os.path.exists(db), db)
con = sqlite3.connect(db)
cur = con.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = [r[0] for r in cur.fetchall()]
print("Tables:", len(tables))
print([t for t in tables if t.startswith('strapi')][:12], '...')
cur.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='strapi_administrator';")
has_admin = cur.fetchone()[0]
print("Has strapi_administrator:", has_admin)
con.close()
