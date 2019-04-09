const graphql = require('graphql'); 
const _ = require('lodash');
const Book = require('../models/book'); 
const Author = require('../models/author');


//distructuring from graphql package and storing in variables 
const {GraphQLObjectType, 
      GraphQLID,
      GraphQLString,
      GraphQLInt,
      GraphQLList,
      GraphQLNonNull,
      GraphQLSchema} = graphql; 


const BookType = new GraphQLObjectType({
    name: 'Book', 
    //fields must be properties initialized via constructor function 
    fields:() => ({
        //let's defines this object properties
       id: {type: GraphQLID}, 
       name: {type: GraphQLString}, 
       genre: {type: GraphQLString}, 
       author: {
           type: AuthorType, 
           resolve(parent, args) {
               //return _.find(authors, {id: parent.authorid})
               return Author.findById(parent.authorid);
            }
       }
    }),
});

const AuthorType = new GraphQLObjectType({
    name: 'Author', 
    fields: () => ({
       id: {type: GraphQLID}, 
       name: {type: GraphQLString}, 
       age: {type: GraphQLInt}, 
       books: {
           type: new GraphQLList(BookType), 
           resolve(parent, args) {
               //return _.filter(books, {authorid:parent.id})
              return Book.find({
                 authorid: parent.id
              });
            }
       }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType, 
            args: {id: {type: GraphQLID}}, 
            resolve(parent, args) {
               //return _.find(books,{id: args.id});
                return Book.findById(args.id)
            }
        }, 
        author:{
            type: AuthorType, 
            args: {id:{type:GraphQLID}}, 
            resolve(parent, args) {
               // return _.find(authors, {id: args.id});
               return Author.findById(args.id)
            }
        }, 
        books: {
            type: new GraphQLList(BookType), 
            resolve(parent, args) {
                //return all books; 
                return Book.find({});
            }
        }, 
        authors: {
            type: new GraphQLList(AuthorType), 
            resolve(parent, args){
               // return all authors;
               return Author.find({})
            }
        }
    }
}); 

//mutations allows us to post to the database 
const Mutation = new GraphQLObjectType({
     name: 'Mutation', 
     fields: {
         addAuthor: {
             type: AuthorType, 
             args: {
                 name: {type: new GraphQLNonNull(GraphQLString)}, 
                 age: {type: new GraphQLNonNull(GraphQLInt)},
             },
             resolve(parent, args) {
               let author = new Author({
                   name: args.name,
                   age: args.age, 
               }); 
               return author.save();
             }
         }, 
         addBook: {
             type: BookType, 
             args: {
                 name: {type: new GraphQLNonNull(GraphQLString)}, 
                 genre: {type: new GraphQLNonNull(GraphQLString)}, 
                 authorid: {type: new GraphQLNonNull(GraphQLID)}
             }, 
             resolve(parent, args) {
                 let book = new Book({
                     name: args.name, 
                     genre: args.genre, 
                     authorid: args.authorid
                 }); 
                 return book.save();
             }
         }
     }
});

module.exports = new GraphQLSchema({
    query: RootQuery, 
    mutation: Mutation,
});