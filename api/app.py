from flask import Flask, jsonify,request, Response
from bson.json_util import dumps
from bson import ObjectId
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime
from bookModel import Book
from userModel import User

app = Flask(__name__)
cors = CORS(app)

app.config['MONGO_URI']='mongodb+srv://test:test@cluster0.jbp4e.mongodb.net/restaurantDB?retryWrites=true&w=majority'
mongo=PyMongo(app)
collectionBooks = mongo.db['Books']
collectionUsers = mongo.db['User']


@app.get("/api/data")
def get_data():
    book_id = request.args.get('id')
    flt = {} if book_id is None else {"_id":ObjectId(book_id)}
    data = list(collectionBooks.find(flt))

    res = Response(response=dumps(data),status=200,mimetype='application/json')
    return res


@app.post("/api/filter")
def filter():
    book_name = request.args.get('name')
    genre = request.args.get("genre") 
    min_price = request.args.get("min_price")  
    max_price = request.args.get("max_price")
    publication = request.args.get("publication")

    filter_query = {}

    if book_name:
        filter_query['title']={"$regex": "^"+book_name, "$options": "i"}
    if genre:
        filter_query['genre']=genre
    if min_price and max_price:
        filter_query['price']={"$gte": float(min_price),"$lte": float(max_price)}
    if publication:
        date = datetime.strptime(publication, "%Y-%m-%dT%H:%M:%S.%fZ")
        filter_query['publication_date']={"$gte":date}
    

    results = collectionBooks.find(filter_query)

    res = Response(response=dumps(results),status=200,mimetype='application/json')
    return res


@app.post("/api/login")
def get_user():
    body = request.get_json()
    email = body.get('email')
    user_password = body.get('password')
    data = list(collectionUsers.find({"email":email,"password":user_password}))
    final=[]
    if len(data)>0:
        final.append({"message":"success","name":data[0]['name'],"email":data[0]['email']})
    
    res = Response(response=dumps(final),status=200,mimetype='application/json')
    return res

@app.get("/api/user")
def get_by_email():
    email = request.args.get('email')
    data = list(collectionUsers.find({"email":email}))
    final = []
    if len(data)>0:
        final.append({"cartItem":data[0]['cartItem']})

    res = Response(response=dumps(final),status=200,mimetype='application/json')
    return res


@app.post("/api/quantity")
def update_quantity():
    body = request.get_json()
    isPresent = collectionUsers.find_one({"email":body.get('email')})
    if isPresent:
        collectionUsers.update_one({"email":body.get("email"),"cartItem.name": body.get('name')}, {"$set": {"cartItem.$.quantity": body.get('quantity')}})
    return jsonify({'message': "Updated"}), 201



@app.post("/api/user")
def add_or_update_user():
    body = request.get_json()
    user = User(
        name = body.get('name'),
        email = body.get('email'),
        password = body.get('password'),
        cartItem = body.get('cartItem')
    )
    try:
        isPresent = collectionUsers.find_one({"email":body.get('email')})
        if isPresent:
            if len(isPresent['cartItem'])==0:
                print('out')
                collectionUsers.update_one({"email":body.get('email')},{"$addToSet": {"cartItem":body.get('cartItem')[len(body.get('cartItem'))-1]}})
            else: 
                if any(("name",body.get('cartItem')[0]['name']) not in d.items() for d in isPresent['cartItem']):
                    print("inside")
                    collectionUsers.update_one({"email":body.get('email')},{"$addToSet": {"cartItem":body.get('cartItem')[len(body.get('cartItem'))-1]}})
            message="User updated successfully"
        else:
            collectionUsers.insert_one(user.to_dict())
            message="User added successfully"
        return jsonify({'message': message, 'user': user.to_dict()}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to add user', 'error': str(e)}), 500


@app.post('/api/book')
def add_book():
    data = request.get_json()
    book = Book(
        title=data.get('title'),
        author=data.get('author'),
        description=data.get('description'),
        cover_image=data.get('cover_image'),
        price=data.get('price'),
        ratings=data.get('ratings'),
        publication_date=data.get('publication_date'),
        genre=data.get('genre')
    )
    try:
        collectionBooks.insert_one(book.to_dict())
        return jsonify({'message': 'Book added successfully', 'book': book.to_dict()}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to add book', 'error': str(e)}), 500
    

@app.post('/api/user/item')
def delete_book():
    body = request.get_json()
    isPresent = collectionUsers.find_one({"email":body.get('email')})
    if isPresent:
        collectionUsers.update_one({"email":body.get('email')}, {"$pull": {"cartItem": {"name": body.get('name')}}})
    return jsonify({"message": "Item deleted successfully"})
    

if  __name__ == '__main__':
    app.run(debug=True)