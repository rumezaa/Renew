import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { collection, getDoc, doc, addDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { auth, db } from "./config";


async function addPosts(data) {
  const postsRef = collection(db, "posts");

  //adding the post to the posts collection
  const postRef = await addDoc(postsRef, data)
  await updateDoc(postRef, {id: postRef.id});

  const userRef = doc(db, "users", auth.currentUser.uid);
  const userSnap = await getDoc(userRef)

  //updating users post field
  const updatedPosts = userSnap.data().posts ? [...userSnap.data().posts, postRef.id] : [postRef.id]
  await updateDoc(userRef, {posts: updatedPosts })
}

async function updatePosts(data) {
  const postRef = doc(db,"posts",data.id)
  await setDoc(postRef, data )
}

async function addUser(data) {
  const usersCollection = collection(db, "users");
  
  try {
    const userRef = doc(usersCollection, auth.currentUser.uid);
    await setDoc(userRef, data);
    await updateDoc(userRef, {id: userRef.id});
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
}

async function uploadImages(location, file) {
  const storage = getStorage();
  const imageRef = ref(storage, location);

  try {
    const response = await fetch(file);
    const blob = await response.blob();
    const snap = await uploadBytes(imageRef, blob);
    const fileRef = await getDownloadURL(snap.ref)

    return fileRef
    
  } catch (error) {
    console.error("Error uploading image", error);
  }
}


function getUserPosts(post) {
  const postRef = doc(db, "posts", post);
  onSnapshot(postRef, (docSnap) => {
    if (docSnap.exists()) {
     return docSnap.data()
    } else {
      console.log("No such document!");
    }
  });
  
}
   

  // console.log(imageFiles)


export { addUser, addPosts, uploadImages, getUserPosts, updatePosts };
