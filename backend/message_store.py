# All messages stored im sqlalchemy database, each message is an array of char strings
from config import db
class MessageStore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(1000), unique=True, nullable = False)

    def to_json(self):
        return{
            "id": self.id,
            "message": self.message
        }