class Book:
    def __init__(self, title, author, description, cover_image, price, ratings, publication_date, genre):
        self.title = title
        self.author = author
        self.description = description
        self.cover_image = cover_image
        self.price = price
        self.ratings = ratings
        self.publication_date = publication_date
        self.genre = genre

    def to_dict(self):
        return {
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'cover_image': self.cover_image,
            'price': self.price,
            'ratings': self.ratings,
            'publication_date': self.publication_date,
            'genre': self.genre
        }