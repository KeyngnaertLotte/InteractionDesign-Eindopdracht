from pickletools import read_string1
from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    ##### BookLikes #####
    @staticmethod
    def readAllLikes():
        sql = "Select * from bookranking order by likes desc;"
        result = Database.get_rows(sql)
        return result

    @staticmethod
    def readLikes(isbn):
        sql = "SELECT * from bookranking WHERE Id = %s"
        params = [isbn]
        result = Database.get_one_row(sql, params)
        if result == None:
            return DataRepository.addBook(isbn)
        else:
            return result

    @staticmethod
    def addBook(isbn):
        sql1 = "INSERT INTO bookranking(Id, Likes, Dislikes) VALUES (%s, 0, 0);"
        params = [isbn]
        Database.execute_sql(sql1, params)
        return {'Dislikes': 0, 'Id': isbn, 'Likes': 0}

    @staticmethod
    def updateLike(isbn):
        sql = "UPDATE bookranking SET Likes = Likes + 1 WHERE Id = %s"
        params = [isbn]
        return Database.execute_sql(sql, params)

    @staticmethod
    def updateDislike(isbn):
        sql = "UPDATE bookranking SET Dislikes = Dislikes + 1 WHERE Id = %s"
        params = [isbn]
        return Database.execute_sql(sql, params)
