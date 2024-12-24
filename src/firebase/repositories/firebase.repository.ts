import { Inject, Injectable } from '@nestjs/common'
import { app, auth, messaging } from 'firebase-admin'

export const IFirebaseRepository = Symbol('IFirebaseRepository')

export interface IFirebaseRepository {
  getAuth(): auth.Auth
  getFirestore(): FirebaseFirestore.Firestore
  getMessaging(): messaging.Messaging
  getCollection(collectionName: string): FirebaseFirestore.CollectionReference
}

@Injectable()
export class FirebaseRepository {
  #auth: auth.Auth
  #firestore: FirebaseFirestore.Firestore
  #messaging: messaging.Messaging

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#auth = this.firebaseApp.auth()
    this.#firestore = this.firebaseApp.firestore()
    this.#messaging = this.firebaseApp.messaging()
  }

  getAuth() {
    return this.#auth
  }

  getFirestore() {
    return this.#firestore
  }

  getMessaging() {
    return this.#messaging
  }

  getCollection(collectionName: string) {
    return this.#firestore.collection(collectionName);
  }
}
