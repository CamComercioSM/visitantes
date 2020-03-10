import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import {auth} from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore) { }
  loginGoogleUser() {
    return this.afsAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => credential.user.email)
  }
  
  logoutUser() {
    return this.afsAuth.auth.signOut();
  }
  // private updateUserData(user) {
  //   console.log(user);
    
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  //   const data = {
  //     id: user.uid,
  //     email: user.email,
  //     roles: {
  //       editor: true
  //     }
  //   }
  //   return userRef.set(data, { merge: true })
  // }

  isAuth() {
    return this.afsAuth.authState;
  }
}
