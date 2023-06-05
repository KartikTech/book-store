class User:
    def __init__(self, name, email, password, cartItem):
        self.name = name
        self.email = email
        self.password = password
        self.cartItem = cartItem

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'cartItem': self.cartItem
        }