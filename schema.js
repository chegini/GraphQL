import {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLSchema
} from 'graphql';

import Db from './db';

const Person = new GraphQLObjectType({
	name: 'Person',
	description: 'This represents a Person',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve(person) {
					return person.id
				}
			},
			firstName: {
				type: GraphQLString,
				resolve(person) {
					return person.firstName
				}
			},
			lastName: {
				type: GraphQLString,
				resolve(person) {
					return person.lastName
				}
			},
			email: {
				type: GraphQLString,
				resolve(person) {
					return person.email
				}
			},
			posts: {
				type: new GraphQLList(Post),
				resolve(person) {
					return person.getPosts();
				}
			}
		};// return
	}// field
});// Person

const Post = new GraphQLObjectType({ 
	name: 'Post',
	description: 'This is a Post',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				resolve(post) {
					return post.id
				}
			},
			title: {
				type: GraphQLString,
				resolve(post) {
					return post.title
				}
			},
			content: {
				type: GraphQLString,
				resolve(post) {
					return post.content
				}
			},
			person: {
				type: Person,
				resolve(post) {
					return post.getPerson();
				}
			}
		}// return
	}// fields
});// Post

const Query = new GraphQLObjectType({
	name: 'Query',
	description: 'This is a root Query',
	fields: () => {
		return {
			people: {
				type: new GraphQLList(Person),
				args: {
					id: {
						type: GraphQLInt
					},
					email: {
						type: GraphQLString
					}
				},
				resolve(root, args) {
					return Db.models.person.findAll({where: args});
				},
			},// People
			posts: {
				type: new GraphQLList(Post),
				resolve(root, args) {
					return Db.models.post.findAll({where: args});
				}
			}// posts
		};// return
	}// fields
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Functions to do Mutations',
	fields() {
		return {
			addPerson: {
				type: Person,
				args: {
					firstName: {
						type: new GraphQLNonNull(GraphQLString)
					},
					lastName: {
						type: new GraphQLNonNull(GraphQLString)
					},
					email: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve(_, args) {
					return Db.models.person.create({
						firstName: args.firstName,
						lastName: args.lastName,
						email: args.email.toLowerCase()
					});
				}
			}// addPerson
		}
	}
});

const Schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation
});

export default Schema;