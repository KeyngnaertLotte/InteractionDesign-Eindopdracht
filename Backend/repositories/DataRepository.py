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
    def readLikes(isbn, title, cat):
        sql = "SELECT * from bookranking WHERE Id = %s"
        params = [isbn]
        result = Database.get_one_row(sql, params)
        if result == None:
            return DataRepository.addBook(isbn, title, cat)
        else:
            return result
        
    @staticmethod    
    def readUpdatedLikes(isbn):
        sql = "SELECT * from bookranking WHERE Id = %s"
        params = [isbn]
        result = Database.get_one_row(sql, params)
        return result 
    
    @staticmethod
    def getBookName(isbn):
        sql = "SELECT Bookname FROM nytbooksscore.bookranking where Id = %s"
        params = [isbn]
        result = Database.get_one_row(sql, params)
        return result
    
    @staticmethod
    def addBook(isbn, title, cat):
        print(isbn, title)
        sql1 = "INSERT INTO bookranking(Id, BookName, Likes, Dislikes, Categorie) VALUES (%s, %s, 0, 0, %s);"
        params = [isbn, title, cat]
        Database.execute_sql(sql1, params)
        return {'Dislikes': 0, 'Id': isbn, 'Title': title, 'Likes': 0}

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

    @staticmethod
    def updateName(isbn, title):
        sql = "UPDATE bookranking SET Id = %s WHERE Bookname = %s"
        params = [isbn, title]
        return Database.execute_sql(sql, params)
    
    # @staticmethod
    # def addCat(isbn, cat):
    #     sql = "UPDATE bookranking SET Categorie = %s WHERE Id = %s"
    #     params = [cat, isbn]
    #     return Database.execute_sql(sql, params)
